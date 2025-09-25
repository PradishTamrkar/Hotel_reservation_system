const HotelAmenity = require("../models/hotelAmenities")

//Hotel Amenity Creation
const createHotelAmenity = async (req,res) => {
    try{
        const hotelAmenity = await HotelAmenity.create(req.body)
        res.status(201).json(hotelAmenity)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL Hotel Amenity
const getAllHotelAmenity= async (req,res) => {
    try{
        const hotelAmenity = await HotelAmenity.findAll();
        res.json(hotelAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Hotel Amenity
const getHotelAmenityByID = async(req,res) => {
    try{
        const hotelAmenity = await HotelAmenity.findByPk(req.params.id)
        if(!hotelAmenity) 
            return res.status(404).json({message: 'Hotel Amenity not found'})
        res.json(hotelAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update Hotel Amenity Info
const updateHotelAmenity= async(req,res) => {
    try{
        const hotelAmenity = await HotelAmenity.findByPk(req.params.id)
        if(!hotelAmenity)
            return res.status(404).json({message: 'Hotel Amenity not found'})

        await hotelAmenity.update(req.body)
        res.json(hotelAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Hotel Amenity
const deleteHotelAmenity = async (req,res) => {
    try{
        const hotelAmenity = await HotelAmenity.findByPk(req.params.id)
        if(!hotelAmenity)
            return res.status(404).json({message: 'Hotel Amenity not found'})
        await hotelAmenity.destroy();
        res.json({message: 'Hotel Amenity deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createHotelAmenity = createHotelAmenity
exports.getAllHotelAmenity= getAllHotelAmenity
exports.getHotelAmenitysByID = getHotelAmenityByID
exports.updateHotelAmenity = updateHotelAmenity
exports.deleteHotelAmenity= deleteHotelAmenity