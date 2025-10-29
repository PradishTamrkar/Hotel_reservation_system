
const {createHotelAmenity, getAllHotelAmenity, getHotelAmenityByID, updateHotelAmenity, deleteHotelAmenity} = require("../service/hotelAmenityService")

//Hotel Amenity Creation
const handleCreateHotelAmenity = async (req,res) => {
    try{
        const hotelAmenity = await createHotelAmenity(req.body)
        res.status(201).json({message:"Hotel Amenity created successfully", hotelAmenity})
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL Hotel Amenity
const handleGetAllHotelAmenity= async (req,res) => {
    try{
        const hotelAmenity = await getAllHotelAmenity();
        res.json(hotelAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Hotel Amenity
const handleGetHotelAmenityByID = async(req,res) => {
    try{
        const hotelAmenity = await getHotelAmenitysByID(req.params.id)
        res.json(hotelAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update Hotel Amenity Info
const handleUpdateHotelAmenity= async(req,res) => {
    try{

        const hotelAmenity = await updateHotelAmenity(req.params.id,req.body,req.file)
        res.json({message: "Hotel Amenity updated successfully",hotelAmenity})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Hotel Amenity
const handleDeleteHotelAmenity = async (req,res) => {
    try{
        const hotelAmenity = await deleteHotelAmenity(req.params.id)
        res.json({message: 'Hotel Amenity deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    handleCreateHotelAmenity,
    handleGetAllHotelAmenity,
    handleGetHotelAmenityByID,
    handleUpdateHotelAmenity,
    handleDeleteHotelAmenity
}