const HotelAmenity = require("../models/hotelAmenities")

//Hotel Amenity Creation
const createHotelAmenity = async (req,res) => {
    try{

        console.log("Body:", req.body)
        console.log("File:", req.file)

        const body = req.body || {};
        const { hotel_amenity_name,hotel_amenity_description } = body
         if (!hotel_amenity_name || !hotel_amenity_description ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const hotel_amenity_image = req.file ? req.file.filename : null

        const newHotelAmenity = await HotelAmenity.create({
            hotel_amenity_name,
            hotel_amenity_description,
            hotel_amenity_image
        })
        res.status(201).json({message:"Hotel Amenity created successfully", hotelAmenity: newHotelAmenity})
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

        const body = req.body || {};
        const { hotel_amenity_name,hotel_amenity_description } = body

        const hotelAmenity = await HotelAmenity.findByPk(req.params.id)
        if(!hotelAmenity)
            return res.status(404).json({message: 'Hotel Amenity not found'})

        const hotel_amenity_image = req.file ? req.file.filename : hotelAmenity.hotel_amenity_image

        await hotelAmenity.update({
            hotel_amenity_name,
            hotel_amenity_description,
            hotel_amenity_image
        })
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