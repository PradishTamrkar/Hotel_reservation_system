const { createRoomCategory, getAllRoomCategory, getRoomCategoryByID, getRoomByCategory, getCatByExclusiveDeals, updateRoomCategory, deleteRoomCategory} = require('../service/roomCategoryService')
    
//Room Catagory creation
    
const handleCreateRoomCategory = async(req,res) => {
    try{
        const roomCategory = await createRoomCategory(req.body, req.file)
        res.status(201).json({message:'Room Catagory created successfully',roomCategory})
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //Get ALL Rooms Catagories
    const handleGetAllRoomCategory = async (req,res) => {
        try{
            const result = await getAllRoomCategory()
            res.json({result})
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //Get Single Room Catagory
    const handleGetRoomCategoryByID = async (req,res) => {
        try{
            const roomCategory = await getRoomCategoryByID(req.params.id)
            res.json(roomCategory);
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }
    //getroom by catagory
    const handleGetRoomByCategory = async ( req,res ) => {
        try{ 
            const catId = parseInt(req.params.id, 10)
            const result = await getRoomByCategory(catId)
            res.json(result)
        }catch(err){
            console.error('getRoomByCatagory error:', err)
            return res.status(500).json({error:err.message})
        }
    }

    //get Room By Exclusive Deals
    const handleGetCatByExclusiveDeals = async (req,res) => {
        try{
            const result = await getCatByExclusiveDeals()
            res.json(result)
        }catch(err){
            console.error('getRoomCatagoryExclusiveDeals error:', err);
            return res.status(500).json({ error: err.message });
        }
    }
    //Update Room Catagory
    const handleUpdateRoomCategory = async(req,res) => {
        try{
            const roomCategory = await updateRoomCategory(req.params.id, req.body, req.file)
            res.json({message:"Catagory updated successfully", roomCategory})
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }

    //Delete Room
    const handleDeleteRoomCategory = async (req,res) => {
        try{
            const result = await deleteRoomCategory(req.params.id)
            res.json({message: 'Room Catagory deleted successfully'})
        }catch(err){
            res.status(500).json({error: err.message})
        }
    }

module.exports = {
    handleCreateRoomCategory,
    handleGetAllRoomCategory,
    handleGetRoomCategoryByID,
    handleGetRoomByCategory,
    handleGetCatByExclusiveDeals,
    handleUpdateRoomCategory,
    handleDeleteRoomCategory
}
