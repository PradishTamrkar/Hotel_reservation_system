const { createAmenityBridge, getAllAmenityBridge, getAmenitiesByCategory, updateAmenityBridge, deleteAmenityBridge} = require("../service/amenityBridgeService")

//Amenity Bridge Creation
const handleCreateAmenityBridge = async (req,res) => {
    try{
        const { room_catagory_id, room_amenity_id} =req.body
        const amenityBridge = createAmenityBridge(room_catagory_id,room_amenity_id)
        res.status(201).json({message:'bridge created successfully'},amenityBridge)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL Booking Details
const hanldeGetAllAmenityBridge = async (req,res) => {
    try{
        const amenityBridge = await getAllAmenityBridge()
        res.json(amenityBridge)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//see amenities inside one catagory
const handleGetAmenitiesByCategory = async (req, res) => {
  try {
    const amenityBridge = await getAmenitiesByCategory(req.params.id)

    res.json(amenityBridge);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};  

//Update Bookoing Details Info
const handleUpdateAmenityBridge= async(req,res) => {
    try{
        const amenityBridge = await updateAmenityBridge(req.params.id, req.body)
        res.json(amenityBridge)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Booking Details
const hanldDeleteAmenityBridge = async (req,res) => {
    try{
        const result = await deleteAmenityBridge(req.params.id)
        res.json(result)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    handleCreateAmenityBridge,
    hanldeGetAllAmenityBridge,
    handleGetAmenitiesByCategory,
    handleUpdateAmenityBridge,
    hanldDeleteAmenityBridge
}