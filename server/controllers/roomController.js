const { createRoom, getAllRooms, getRoomByID, updateRoom, deleteRoom, getAvailableRoomsByDate, searchRooms} = require('../service/roomService')
    
//Room creation
const handleCreateRoom = async(req, res) => {
    try {
        console.log('Body:', req.body);
        console.log('File:', req.file);
        console.log('Body types:', {
            room_catagory_id: typeof req.body.room_catagory_id,
            room_no: typeof req.body.room_no,
            room_description: typeof req.body.room_description,
            capacity: typeof req.body.capacity
        });
        
        const room = await createRoom(req.body, req.file);
        res.status(201).json({message: "Room created successfully", room});
    } catch(err) {;
        res.status(500).json({error: err.message});
    }
}

//Get ALL Rooms
const handleGetAllRooms = async (req,res) => {
    try{
        const result = await getAllRooms()
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

//get room by date
const handleGetAvailableRoomsByDate = async (req, res) => {
    try {
        const { check_in_date, check_out_date } = req.query;
        
        // Validate required parameters
        if (!check_in_date || !check_out_date) {
            return res.status(400).json({ 
                error: 'Both check_in_date and check_out_date are required' 
            });
        }

        // Validate date format and range
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return res.status(400).json({ 
                error: 'Invalid date format. Use YYYY-MM-DD' 
            });
        }

        if (checkOut <= checkIn) {
            return res.status(400).json({ 
                error: 'Check-out date must be after check-in date' 
            });
        }

        if (checkIn < today) {
            return res.status(400).json({ 
                error: 'Check-in date cannot be in the past' 
            });
        }

        const result = await getAvailableRoomsByDate(check_in_date, check_out_date);
        res.json(result);
    } catch (err) {
        console.error('Error getting available rooms:', err);
        res.status(500).json({ error: err.message });
    }
};

const handleSearchRooms = async (req,res) => {
    try{
        const {search} = req.query

        if(!search)
            return res.status(400).json({error: 'Search query is required'})

        const result = await searchRooms(search);
        res.json(result)
    }catch(err){
        console.error('Error searching rooms:',err)
        res.status(500).json({error: err.message})
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
    handleDeleteRoom,
    handleGetAvailableRoomsByDate,
    handleSearchRooms
}