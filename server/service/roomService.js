const { DataTypes, QueryTypes } = require('sequelize')
const { db: sequelize } = require("../config/config")
const Room = require('../models/room')

//Room JOINS
const sqlRoom = `
SELECT
    r.room_id,
    r.room_no,
    r.room_status,
    r.room_images,
    r.room_description,
    r.capacity,
    r.room_catagory_id
FROM room r
`

const sqlAvailableRoomByDate = `
SELECT DISTINCT
    r.room_id,
    r.room_no,
    r.room_status,
    r.room_images,
    r.room_description,
    r.capacity,
    r.room_catagory_id,
    rc.room_catagory_name,
    rc.room_catagory_description,
    rc.room_catagory_images,
    rc.price_per_night,
    rc.offer_id,
    p.offer_name,
    p.offer_description,
    p.offered_discount
FROM room r
JOIN room_catagory rc ON r.room_catagory_id = rc.room_catagory_id
LEFT JOIN promos_and_offers p ON rc.offer_id = p.offer_id
WHERE r.room_status = 'Available'
AND r.room_id NOT IN (
SELECT bd.room_id 
FROM booking_details bd
JOIN booking b ON bd.booking_id = b.booking_id
WHERE (
        (b.check_in_date <= :check_out_date AND b.check_out_date >= :check_in_date)
    )
)
ORDER BY rc.room_catagory_name, r.room_no
`
//room creation
const createRoom = async(data, file) => {
    const { room_catagory_id, room_no, room_description, capacity } = data

    if (!room_catagory_id || !room_no || !room_description || !capacity)
        throw new Error("All fields are required");

    const room_images = file ? file.path : null
    
    const newRoom = await Room.create({
        room_catagory_id: parseInt(room_catagory_id),
        room_no: String(room_no), 
        room_description,
        capacity: String(capacity),
        room_images
    })
    
    return newRoom
}

//Get All rooms
const getAllRooms = async () => {
    const room = await sequelize.query(
        `
        ${sqlRoom}
        ORDER BY 
             CASE 
                WHEN r.room_no ~ '^[0-9]+$' THEN CAST(r.room_no AS INTEGER)
                ELSE 999999
             END,
            r.room_no
        `,
        {
            type:QueryTypes.SELECT
        }
    )
    return{
        totalRoom: room.length,
        room
    }
}

//get single room
const getRoomByID = async (id) => {
    const rooms = await sequelize.query(
        `
        ${sqlRoom} 
        WHERE r.room_id = :id 
        `,
        { 
            replacements: { id }, 
            type: QueryTypes.SELECT 
        }
    )
    if(!rooms || rooms.length === 0) 
        throw new Error('Room not found')

    return rooms[0];
}

const getAvailableRoomsByDate = async (check_in_date, check_out_date) => {
    // Get all rooms that are NOT booked during the specified date range
    const availableRooms = await sequelize.query(
        `
        ${sqlAvailableRoomByDate}
        `,
        {
            replacements: { check_in_date, check_out_date },
            type: QueryTypes.SELECT
        }
    );

    // Group rooms by category
    const groupedByCategory = availableRooms.reduce((acc, room) => {
        const categoryId = room.room_catagory_id;
        
        if (!acc[categoryId]) {
            acc[categoryId] = {
                room_catagory_id: categoryId,
                room_catagory_name: room.room_catagory_name,
                room_catagory_description: room.room_catagory_description,
                room_catagory_images: getFileURL(room.room_catagory_images),
                price_per_night: room.price_per_night,
                offer_id: room.offer_id,
                offer_name: room.offer_name,
                offer_description: room.offer_description,
                offered_discount: room.offered_discount,
                available_rooms: []
            };
        }
        
        acc[categoryId].available_rooms.push({
            room_id: room.room_id,
            room_no: room.room_no,
            room_status: room.room_status,
            room_images: getFileURL(room.room_images),
            room_description: room.room_description,
            capacity: room.capacity
        });
        
        return acc;
    }, {});

    return {
        check_in_date,
        check_out_date,
        categories: Object.values(groupedByCategory),
        total_categories: Object.keys(groupedByCategory).length,
        total_available_rooms: availableRooms.length
    };
};

const searchRooms = async (searchTerm) => {
    const rooms = await sequelize.query(
        `
        ${sqlRoom}
        wHERE r.room_no ILIKE :search
        ORDER BY 
            CASE
                WHEN r.room_no ~ '^[0-9]+$' THEN CAST(r.room_no AS INTEGER)
                ELSE 999999
            END,
            r.room_no
        `,{
            replacements: {search: `%${searchTerm}%`},
            type: QueryTypes.SELECT
        }
    )

    return{
        totalRoom: rooms.length,
        room: rooms
    }
}

//update room
const updateRoom = async(id,data,file) => {
    const { room_catagory_id,room_no,room_description,capacity,room_status  } = data
    const room = await Room.findByPk(id)
    if(!room)
        throw new Error('Room not found')
    const room_images = file? file.filename : room.room_images
    await room.update({
        room_catagory_id,
        room_no,
        room_description,
        capacity,
        room_status: room_status || room.room_status,
        room_images                
    })
    return room
}

//delete room
const deleteRoom = async (id) => {
    const room = await Room.findByPk(id)
    if(!room)
        throw new Error('Room not found')
    await room.destroy();
    return{ message:'Room deleted successfully'}
}

const isRoomAvailable = async (room_id, check_in_date, check_out_date) => {
    const overlappingBookings = await sequelize.query(
        `
        SELECT * FROM booking_details bd
        JOIN booking b ON bd.booking_id = b.booking_id
        WHERE bd.room_id = :room_id
        AND (
            (b.check_in_date <= :check_out_date AND b.check_out_date >= :check_in_date)
        )
        `,{
            replacements: { room_id,check_in_date,check_out_date },
            type: QueryTypes.SELECT
        }
    )
    return overlappingBookings.length === 0 /// 0  means available
}

module.exports = {
    createRoom,
    getAllRooms,
    getRoomByID,
    updateRoom,
    deleteRoom,
    isRoomAvailable,
    getAvailableRoomsByDate,
    searchRooms
}