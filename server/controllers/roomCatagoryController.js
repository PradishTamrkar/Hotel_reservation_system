    const { DataTypes, QueryTypes } = require('sequelize')
    const sequelize = require('../config/db')
    const RoomCatagory = require('../models/roomCatagory')
    const getFileUrl = require('../service/getFileURL');
const room = require('../models/room');

    const sqlRoomCatagory = 
    `
    SELECT
        rc.room_catagory_id,
        rc.room_catagory_name,
        rc.room_catagory_description,
        rc.room_catagory_images,
        rc.price_per_night
    FROM room_catagory rc
    `

    const sqlRoomByCat = 
    `
    SELECT
        r.room_no,
        r.room_status,
        r.room_images,
        r.capacity,
        r.room_catagory_id
    FROM room r
    `

    const sqlCatByExclusiveDeals = 
    `
    SELECT
        rc.room_catagory_name,
        rc.room_catagory_description,
        rc.room_catagory_images,
        rc.price_per_night,
        rc.offer_id,
        p.offer_name,
        p.offer_image,
        p.offer_description,
        p.offered_discount
      FROM room_catagory rc
      JOIN promos_and_offers p ON rc.offer_id = p.offer_id
    `
    //Room Catagory creation
    const createRoomCatagory = async(req,res) => {
        try{

        console.log("Body:", req.body)
        console.log("File:", req.file)

        const body = req.body || {};
        const { room_catagory_name,room_catagory_description,price_per_night,offer_id } = body

        if (!room_catagory_name || !room_catagory_description || !price_per_night ) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const room_catagory_images = req.file ? req.file.filename : null
        const newRoomCatagory = await RoomCatagory.create({
            room_catagory_name,
            room_catagory_description,
            room_catagory_images,
            price_per_night,
            offer_id: offer_id || null
        })

        const roomCatWithUrl={
            ...newRoomCatagory.toJSON(),
            room_catagory_images: getFileUrl(newRoomCatagory.room_catagory_images)
        }
        res.status(201).json({message:'Room Catagory created successfully',roomCatagory: roomCatWithUrl})
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //Get ALL Rooms Catagories
    const getAllRoomCatagory = async (req,res) => {
        try{
            // const pageNumber = parseInt(req.query.pageNumber) || 1
            // const limit = parseInt(req.query.limit) || 10
            // const offset = (pageNumber -1 ) * limit 
            const roomCatagory = await sequelize.query(
                `
                ${sqlRoomCatagory}
                `,
                {
                    // replacements:{limit,offset},
                    type:QueryTypes.SELECT
                }
            )
                const updated = roomCatagory.map(cat => ({
                    ...cat,
                    room_catagory_images: getFileUrl(cat.room_catagory_images)
                }));
            res.json({roomCatagory: updated})
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //Get Single Room Catagory
    const getRoomCatagoryByID = async (req,res) => {
        try{
            const { id } = req.params
            const roomCatagory = await sequelize.query(
                `
                ${sqlRoomCatagory} 
                WHERE rc.room_catagory_id = :id
                `,
                { 
                    replacements: { id }, 
                    type: QueryTypes.SELECT 
                }
            )
            if(!roomCatagory) 
                return res.status(404).json({message: 'Room Catagory not found'})

            const roomCatagoryWithUrl = roomCatagory.map(cat => ({
                 ...cat,
                room_catagory_images: getFileUrl(cat.room_catagory_images)
            }));
            res.json(roomCatagoryWithUrl);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //getroom by catagory
    const getRoomByCatagory = async ( req,res ) => {
        try{ 
            const catId = parseInt(req.params.id, 10)
            if(isNaN(catId))
                return res.status(400).json({error: 'Invalid room catagory'})
        const rooms = await sequelize.query(
            `
            ${sqlRoomByCat}
            WHERE r.room_catagory_id = :catId
            ORDER BY r.room_no
            `,{
            replacements: {catId},
            type: QueryTypes.SELECT
            }
        )
        const updatedRooms = rooms.map(room => ({
            ...room,
            room_images: getFileUrl(room.room_images)
        })
        )
        return res.json({ room_catagory_id: catId, count: updatedRooms.length, rooms: updatedRooms})
        }catch(err){
            console.error('getRoomByCatagory error:', err)
            return res.status(500).json({error:err.message})
        }
    }

    //get Room By Exclusive Deals
    const getCatByExclusiveDeals = async (req,res) => {
        try{
            const catagryWithOffer = await sequelize.query(
                `
                ${sqlCatByExclusiveDeals}
                WHERE rc.offer_id IS NOT NULL
                ORDER BY p.offered_discount DESC NULLS LAST, rc.room_catagory_name
                `,{
                    type: QueryTypes.SELECT
                }
            )
                const updated = catagryWithOffer.map(item => ({
                    ...item,
                    room_catagory_images: getFileUrl(item.room_catagory_images),
                    offer_image: getFileUrl(item.offer_image)
                }));
            res.json({ count: updated.length, catagories: updated });
        }catch(err){
            console.error('getRoomCatagoryExclusiveDeals error:', err);
            return res.status(500).json({ error: err.message });
        }
    }
    //Update Room
    const updateRoomCatagory = async(req,res) => {
        try{

            console.log("Body:", req.body)
            console.log("File:", req.file)

            const body = req.body || {};
            const { room_catagory_name,room_catagory_description,price_per_night } = body
            const roomCatagory = await RoomCatagory.findByPk(req.params.id)
            if(!roomCatagory) 
                return res.status(404).json({message: 'Room Catagory not found'})
            const room_catagory_images = req.file? req.file.filename : roomCatagory.room_catagory_images
            await roomCatagory.update({
                room_catagory_name,
                room_catagory_description,
                room_catagory_images,
                price_per_night,
            })

            const roomCatWithURL = {
                ...roomCatagory.toJSON(),
                room_catagory_images: getFileUrl(roomCatagory.room_catagory_images)
            }
            res.json({message:"Catagory updated successfully", roomCatagory: roomCatWithURL})
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //Delete Room
    const deleteRoomCatagory = async (req,res) => {
        try{
            const roomCatagory = await RoomCatagory.findByPk(req.params.id)
            if(!roomCatagory)
                return res.status(404).json({message: 'Room Catagory not found'})
            await roomCatagory.destroy();
            res.json({message: 'Room Catagory deleted successfully'})
        }catch(err){
            res.status(500).json({error: err.message})
        }
    }

    exports.createRoomCatagory = createRoomCatagory
    exports.getAllRoomCatagory = getAllRoomCatagory
    exports.getRoomCatagoryByID = getRoomCatagoryByID
    exports.updateRoomCatagory = updateRoomCatagory
    exports.deleteRoomCatagory = deleteRoomCatagory
    exports.getRoomByCatagory = getRoomByCatagory
    exports.getCatByExclusiveDeals = getCatByExclusiveDeals
