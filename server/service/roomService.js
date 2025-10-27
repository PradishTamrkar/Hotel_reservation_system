const { DataTypes, QueryTypes } = require('sequelize')
const sequelize = require('../config/db')
const Room = require('../models/room')
const getFileURL = require('./getFileURL')

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

//create room
const createRoom = async(data,file) => {
    const { room_catagory_id,room_no,room_description,capacity } = data

    if (!room_no || !room_description || !capacity )
        throw new Error("All fields are required");

    const room_images = file ? file.filename : null
    const newRoom = await Room.create({
        room_catagory_id,
        room_no,
        room_description,
        capacity,
        room_images
    })
    return {
        ...newRoom.toJSON(),
        room_images:getFileUrl(newRoom.room_images)
    }
}

//Get All rooms
const getAllRooms = async (pageNumber =1 ,limit = 10) => {
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

    const updatedRooms = room.map(room => ({
        ...room,
        room_images: getFileURL(room.room_images)
    }))
    return{
        pageNumber,
        limit,
        totalRoom: updatedRooms.length,
        room: updatedRooms
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
    const room = rooms[0]
    return {
        ...room,
        room_images: getFileUrl(room.room_images)
    };
}

//update room
const updateRoom = async(id,data,file) => {
    const { room_catagory_id,room_no,room_description,capacity  } = data
    const room = await Room.findByPk(id)
    if(!room)
        throw new Error('Room not found')
    const room_images = file? file.filename : room.room_images
    await room.update({
        room_catagory_id,
        room_no,
        room_description,
        capacity,
        room_images                
    })
    return {
        ...room.toJSON(),
        room_images: getFileUrl(room.room_images)
    };
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
    isRoomAvailable
}