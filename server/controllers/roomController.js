const { DataTypes, QueryTypes } = require('sequelize')
const sequelize = require('../config/db')
const Room = require('../models/room')

//Room JOINS
const sqlRoom =`
SELECT 
    r.room_type,
    r.price_per_night,
    r.room_images,
    json_agg(
        json_build_object(
            'room_amenity_id', ra.room_amenity_id,
            'room_amenity_name', ra.room_amenity_name    
        )
    ) FILTER (WHERE ra.room_amenity_id IS NOT NULL) AS r_amenities
FROM room r
LEFT JOIN room_amenity ra ON r.room_no = ra.room_no
`

const sqlRoomGroupBy = `
GROUP BY r.room_no, r.room_type, r.price_per_night, r.capacity, r.room_status, r.room_images
`
//Room creation
const createRoom = async(req,res) => {
    try{
        const room = await Room.create(req.body)
        res.status(201).json(room)
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
            ${sqlRoomGroupBy}
            ORDER BY r.room_no
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
        const room = await sequelize.query(
            `
            ${sqlRoom} 
            WHERE r.room_no = :id 
            ${sqlRoomGroupBy}
            `
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
        const room = await Room.findByPk(req.params.id)
        if(!room) 
            return res.status(404).json({message: 'Room not found'})
        await room.update(req.body)
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
