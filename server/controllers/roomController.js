const { createRoom, getAllRooms, getRoomByID, updateRoom, deleteRoom} = require('../service/roomService')
    
//Room creation
const handleCreateRoom = async(req,res) => {
    try{
        const room = await createRoom(req.body, req.file)
        res.status(201).json({message: "Room created successfully", room})
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//Get ALL Rooms
const handleGetAllRooms = async (req,res) => {
    try{
        const result = await getAllRooms(req.query.pageNumber, req.query.limit)
        res.json(result)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//get single room
const handleGetRoomByID = async (req,res) => {
    try{
        const room = await getRoomByID(req.params.id)
        res.json(room)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//update Room
const handleUpdateRoom = async (req,res) => {
    try{
        const room = await updateRoom(req.params.id, req.body, req.file)
        res.json({message: "Room updated successfully", room});    
    }catch(err){
        res.status(500).json({error: err.message});
    }
}


//Delete Room
const handleDeleteRoom = async (req,res) => {
    try{
        const result = await deleteRoom(req.params.id)
        res.json({message: 'Room deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    handleCreateRoom,
    handleGetAllRooms,
    handleGetRoomByID,
    handleUpdateRoom,
    handleDeleteRoom
}
