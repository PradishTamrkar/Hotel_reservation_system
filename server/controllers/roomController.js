    const { DataTypes, QueryTypes } = require('sequelize')
    const sequelize = require('../config/db')
    const Room = require('../models/room')

    //Room JOINS

    const sqlRoom = `
    SELECT
        r.room_id,
        r.room_no,
        r.room_status
    FROM room r
    `
    //Room creation
    const createRoom = async(req,res) => {
        try{
             console.log("Body:", req.body)
            console.log("File:", req.file)

            const body = req.body || {};
            const { room_catagory_id,room_no,room_description,capacity } = body

        if (!room_no || !room_description || !capacity ) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const room_images = req.file ? req.file.filename : null
            const newRoom = await Room.create({
                room_catagory_id,
                room_no,
                room_description,
                capacity,
                room_images
            })
            const roomWithURL={
                ...newRoom.toJSON(),
                room_images:getFileUrl(newRoom.room_images)
            }
            res.status(201).json({message:'Room created successfully',room: roomWithURL})
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //Get ALL Rooms
    const getAllRooms = async (req,res) => {
        try{
            const pageNumber = parseInt(req.query.pageNumber) || 1
            const limit = parseInt(req.query.limit) || 10
            const offset = (pageNumber -1 ) * limit 
            const room = await sequelize.query(
                `
                ${sqlRoom}
                ORDER BY r.room_id
                LIMIT :limit OFFSET :offset
                `,
                {
                    replacements:{limit,offset},
                    type:QueryTypes.SELECT
                }
            )
            res.json({
                pageNumber,
                limit,
                totalRoom: room.length,
                room
            })
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //Get Single Room
    const getRoomByID = async (req,res) => {
        try{
            const { id } = req.params
            const room = await sequelize.query(
                `
                ${sqlRoom} 
                WHERE r.room_id = :id 
                `,
                { 
                    replacements: { id }, 
                    type: QueryTypes.SELECT 
                }
            )
            if(!room) 
                return res.status(404).json({message: 'Room not found'})
            res.json(room)
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //Update Room
    const updateRoom = async(req,res) => {
        try{
            console.log("Body:", req.body)
            console.log("File:", req.file)

            const body = req.body || {};
            const { room_catagory_id,room_no,room_description,capacity  } = body
            const room = await Room.findByPk(req.params.id)
            if(!room) 
                return res.status(404).json({message: 'Room not found'})
            const room_images = req.file? req.file.filename : room.room_images
            await room.update({
                room_catagory_id,
                room_no,
                room_description,
                capacity,
                room_images                
            })
            res.json(room)
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //Delete Room
    const deleteRoom = async (req,res) => {
        try{
            const room = await Room.findByPk(req.params.id)
            if(!room)
                return res.status(404).json({message: 'Room not found'})
            await room.destroy();
            res.json({message: 'Room deleted successfully'})
        }catch(err){
            res.status(500).json({error: err.message})
        }
    }

    exports.createRoom = createRoom
    exports.getAllRooms = getAllRooms
    exports.getRoomByID = getRoomByID
    exports.updateRoom = updateRoom
    exports.deleteRoom = deleteRoom
