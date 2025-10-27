const {createRAmenity, getAllRAmenity, getRAmenityByID, updateRAmenity, deleteRAmenity} = require('../service/roomAmenitiesService')

//Amenity Creation
const handleCreateRAmenity = async (req,res) => {
    try{
        const rAmenity = await createRAmenity()
        res.status(201).json(rAmenity)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL Amenity
const handleGetAllRAmenity = async (req,res) => {
    try{
        const rAmenity = await getAllRAmenity();
        res.json(rAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Customer
const handleGetRAmenityByID = async(req,res) => {
    try{
        const rAmenity = await getRAmenityByID(req.params.id)
        res.json(rAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update Customer Info
const handleUpdateRAmenity = async(req,res) => {
    try{
        const rAmenity = await updateRAmenity(req.params.id)
        res.json(rAmenity)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Customer
const handleDeleteRAmenity = async (req,res) => {
    try{
        const rAmenity = await deleteRAmenity(req.params.id)
        res.json({message: 'Room Amenity deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    handleCreateRAmenity,
    handleGetAllRAmenity,
    handleGetRAmenityByID,
    handleUpdateRAmenity,
    handleDeleteRAmenity
}