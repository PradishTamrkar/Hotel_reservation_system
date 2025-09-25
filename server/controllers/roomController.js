const sequelize = require('../config/db')
const Room = require('../models/room')

//Room JOINS
const sqlRoom = `
SELECT 
    r.room_no,
    r.room_type,
    r.price_per_night,
    ra.room_amenity_id,
    ra.room_amenity_name,
    bd.booking_details_id,
    b.booking_id,
    b.booking_date, 
    b.check_in_date, 
    b.check_out_date, 
    c.customer_id,
    c.first_name || ' ' || c.middle_name || ' ' || c.last_name AS customer_name 
FROM room r
LEFT JOIN "room_amenity" ra ON r.room_no = ra.room_no
LEFT JOIN "booking_details" bd ON r.room_no = bd.room_no
LEFT JOIN "booking" b ON bd.booking_id = b.booking_id
LEFT JOIN "customer" c ON b.customer_id = c.customer_id 
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
        const [room] = await sequelize.query(sqlRoom)
        res.json(room)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//Get Single Room
const getRoomByID = async (req,res) => {
    try{
        const room = await sequelize.query(
            sqlRoom+ `WHERE r.room_no = :id`
            //replacements
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
