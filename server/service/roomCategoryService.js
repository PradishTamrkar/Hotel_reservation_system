const { DataTypes, QueryTypes } = require('sequelize')
const { db: sequelize } = require("../config/config");
const RoomCatagory = require('../models/roomCatagory')
const room = require('../models/room');

const sqlRoomCategory = 
`
SELECT
    rc.room_catagory_id,
    rc.room_catagory_name,
    rc.room_catagory_description,
    rc.room_catagory_images,
    rc.price_per_night,
    rc.offer_id,
    p.offer_name,
    p.offered_discount
FROM room_catagory rc
LEFT JOIN promos_and_offers p ON rc.offer_id = p.offer_id
ORDER BY rc.room_catagory_id
`

const sqlRoomCatByID =
`
SELECT
    rc.room_catagory_id,
    rc.room_catagory_name,
    rc.room_catagory_description,
    rc.room_catagory_images,
    rc.price_per_night,
    rc.offer_id,
    p.offer_name,
    p.offer_description,
    p.offered_discount
FROM room_catagory rc
LEFT JOIN promos_and_offers p ON rc.offer_id = p.offer_id
WHERE rc.room_catagory_id = :id
`

const sqlRoomByCat = 
`
SELECT
    r.room_id,
    r.room_no,
    r.room_status,
    r.room_images,
    r.capacity,
    r.room_description,
    r.room_catagory_id
FROM room r
`

const sqlCatByExclusiveDeals = 
`
SELECT
    rc.room_catagory_id,
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
    try {
        console.log('=== CREATE ROOM CATEGORY SERVICE ===');
        console.log('Received data:', JSON.stringify(data, null, 2));
        console.log('Received file:', file ? {
            fieldname: file.fieldname,
            originalname: file.originalname,
            path: file.path,
            size: file.size
        } : 'No file');
        console.log('====================================');

        const { room_catagory_name, room_catagory_description, price_per_night, offer_id } = data;
        
        // Validate required fields
        if (!room_catagory_name || !room_catagory_description || !price_per_night) {
            throw new Error("Room name, description, and price are required");
        }

        // Validate price is a valid number
        const priceValue = parseFloat(price_per_night);
        if (isNaN(priceValue) || priceValue <= 0) {
            throw new Error("Price must be a valid positive number");
        }

        // Get image path from Cloudinary
        const room_catagory_images = file ? file.path : null;

        // Handle offer_id properly - convert string "null" to actual null
        let offerIdValue = null;
        if (offer_id && offer_id !== 'null' && offer_id !== '' && offer_id !== 'undefined') {
            offerIdValue = parseInt(offer_id, 10);
            if (isNaN(offerIdValue)) {
                throw new Error("Invalid offer ID");
            }
        }

        console.log('Creating room category with:', {
            room_catagory_name,
            room_catagory_description,
            room_catagory_images,
            price_per_night: priceValue,
            offer_id: offerIdValue
        });

        const newRoomCategory = await RoomCatagory.create({
            room_catagory_name,
            room_catagory_description,
            room_catagory_images,
            price_per_night: priceValue,
            offer_id: offerIdValue
        });

        console.log('✅ Room category created successfully:', newRoomCategory.room_catagory_id);
        return newRoomCategory;

    } catch (error) {
        console.error('❌ CREATE ROOM CATEGORY ERROR:', error);
        console.error('Error stack:', error.stack);
        throw error;
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
    return{ roomCategory }
}

//Get Single Room Category
const getRoomCategoryByID = async (id) => {
    const roomCategory = await sequelize.query(
        `
        ${sqlRoomCatByID} 
        `,
        { 
            replacements: { id }, 
            type: QueryTypes.SELECT 
        })
    if(!roomCategory || roomCategory.length === 0) 
        throw new Error('Room Category not found')

    return roomCategory;
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

    return{ room_catagory_id: catId, count: rooms.length, rooms}
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
    return{ count: categryWithOffer.length, roomCategory: categryWithOffer };
}

//Update Room Catagory
const updateRoomCategory = async(id,data,file) => {

    const { room_catagory_name,room_catagory_description,price_per_night,offer_id } = data
    const roomCategory = await RoomCatagory.findByPk(id)
    if(!roomCategory) 
        throw new Error('Room Catagory not found')
    const room_catagory_images = file? file.path : roomCategory.room_catagory_images

    let offerIdValue = null
    if(offer_id && offer_id !== 'null' && offer_id !== ''){
        offerIdValue = parseInt(offer_id);
    }
    await roomCategory.update({
        room_catagory_name,
        room_catagory_description,
        room_catagory_images,
        price_per_night,
        offer_id:offerIdValue
    })
    return{message:"Catagory updated successfully",roomCategory}
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
