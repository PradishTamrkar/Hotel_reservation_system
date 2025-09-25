const RoomAmenity = require("../models/roomAmenities")

//Amenity Creation
const createRAmenity = async (req,res) => {
    try{
        const rAmenity = await RoomAmenity.create(req.body)
        res.status(201).json(rAmenity)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL Amenity
const getAllRAmenity = async (req,res) => {
    try{
        const rAmenity = await RoomAmenity.findAll();
        res.json(rAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Customer
const getRAmenityByID = async(req,res) => {
    try{
        const rAmenity = await RoomAmenity.findByPk(req.params.id)
        if(!rAmenity) 
            return res.status(404).json({message: 'Room Amenity not found'})
        res.json(rAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update Customer Info
const updateRAmenity = async(req,res) => {
    try{
        const rAmenity = await RoomAmenity.findByPk(req.params.id)
        if(!rAmenity)
            return res.status(404).json({message: 'Room Amenity not found'})

        await rAmenity.update(req.body)
        res.json(rAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Customer
const deleteRAmenity = async (req,res) => {
    try{
        const rAmenity = await RoomAmenity.findByPk(req.params.id)
        if(!rAmenity)
            return res.status(404).json({message: 'Room Amenity not found'})
        await rAmenity.destroy();
        res.json({message: 'Room Amenity deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createRAmenity = createRAmenity
exports.getAllRAmenity = getAllRAmenity
exports.getRAmenityByID = getRAmenityByID
exports.updateRAmenity = updateRAmenity
exports.deleteRAmenity = deleteRAmenity