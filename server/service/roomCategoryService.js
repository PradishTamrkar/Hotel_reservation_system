const { DataTypes, QueryTypes } = require('sequelize')
const { db: sequelize } = require("../config/config");
const RoomCatagory = require('../models/roomCatagory')
const getFileUrl = require('./getFileURL');
const room = require('../models/room');

const sqlRoomCategory = 
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
//create Room Category
const createRoomCategory = async(data,file) => {
    
    const { room_catagory_name,room_catagory_description,price_per_night,offer_id } = data
    
    if (!room_catagory_name || !room_catagory_description || !price_per_night )
        throw new Error("All fields are required");

    const room_catagory_images = file ? file.filename : null
    const newRoomCategory = await RoomCatagory.create({
        room_catagory_name,
        room_catagory_description,
        room_catagory_images,
        price_per_night,
        offer_id: offer_id || null
    })

    return{
        ...newRoomCategory.toJSON(),
        room_catagory_images: getFileUrl(newRoomCategory.room_catagory_images)
    }    
}

//Get ALL Rooms Catagories
const getAllRoomCategory = async () => {
    const roomCategory = await sequelize.query(
        `
        ${sqlRoomCategory}
        `,
        {
            type:QueryTypes.SELECT
        })
        const updated = roomCategory.map(cat => ({
            ...cat,
            room_catagory_images: getFileUrl(cat.room_catagory_images)
        }));
    return{roomCategory: updated}
}

//Get Single Room Category
const getRoomCategoryByID = async (id) => {
    const roomCategory = await sequelize.query(
        `
        ${sqlRoomCategory} 
        WHERE rc.room_catagory_id = :id
        `,
        { 
            replacements: { id }, 
            type: QueryTypes.SELECT 
        })
    if(!roomCategory) 
        throw new Error('Room Category not found')

    const roomCategoryWithUrl = roomCategory.map(cat => ({
        ...cat,
        room_catagory_images: getFileUrl(cat.room_catagory_images)
    }));
    return(roomCategoryWithUrl);
}

//Get Room By Category
const getRoomByCategory = async ( catId ) => {
    if(isNaN(catId))
        throw new Error('Invalid Room Category')
    const rooms = await sequelize.query(
        `
        ${sqlRoomByCat}
        WHERE r.room_catagory_id = :catId
        ORDER BY r.room_no
        `,
        {
            replacements: {catId},
            type: QueryTypes.SELECT
        })
    const updatedRooms = rooms.map((room) => ({
        ...room,
        room_images: getFileUrl(room.room_images)
    })
    )
    return{ room_catagory_id: catId, count: updatedRooms.length, rooms: updatedRooms}
}

//Get Room By Exclusive Deals
const getCatByExclusiveDeals = async () => {

    const categryWithOffer = await sequelize.query(
        `
        ${sqlCatByExclusiveDeals}
        WHERE rc.offer_id IS NOT NULL
        ORDER BY p.offered_discount DESC NULLS LAST, rc.room_catagory_name
        `,{
            type: QueryTypes.SELECT
        })
    const updated = categryWithOffer.map(item => ({
        ...item,
        room_catagory_images: getFileUrl(item.room_catagory_images),
        offer_image: getFileUrl(item.offer_image)
        }));
    return{ count: updated.length, roomCategory: updated };
}

//Update Room Catagory
const updateRoomCategory = async(id,data,file) => {

    const { room_catagory_name,room_catagory_description,price_per_night } = data
    const roomCategory = await RoomCatagory.findByPk(id)
    if(!roomCategory) 
        throw new Error('Room Catagory not found')
    const room_catagory_images = file? file.filename : roomCategory.room_catagory_images
    await roomCategory.update({
        room_catagory_name,
        room_catagory_description,
        room_catagory_images,
        price_per_night,
    })

    const roomCatWithURL = {
        ...roomCategory.toJSON(),
        room_catagory_images: getFileUrl(roomCategory.room_catagory_images)
    }
    return{message:"Catagory updated successfully", roomCategory: roomCatWithURL}
}

//Delete Room Catagory
const deleteRoomCategory = async (id) => {

    const roomCategory = await RoomCatagory.findByPk(id)
    if(!roomCategory)
        throw new Error('Room Catagory not found')
    await roomCategory.destroy();
    return({message: 'Room Catagory deleted successfully'})
}
module.exports = {
    createRoomCategory,
    getAllRoomCategory,
    getRoomCategoryByID,
    getRoomByCategory,
    getCatByExclusiveDeals,
    updateRoomCategory,
    deleteRoomCategory
}
