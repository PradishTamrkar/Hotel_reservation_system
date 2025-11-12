const {createOffer,getAllOffers,getOfferByID,updateOffer,deleteOffer} = require("../service/promosAndOfferService");

//offer Creation
const handleCreateOffer = async (req,res) => {
    try{
        const offer = await createOffer(req.body,req.file)
        res.status(201).json({offer})
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL offers
const handleGetAllOffers = async (req,res) => {
    try{
        const offer = await getAllOffers();
        res.json(offer)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Offer
const handleGetOfferByID = async(req,res) => {
    try{
        const offer = await getOfferByID(req.params.id)
        res.json(offer)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update offer Info
const handleUpdateOffer = async(req,res) => {
    try{

        const offer = await updateOffer(req.params.id,req.body,req.file)
        res.json({ message: "Offer updated successfully", offer })
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Offer
const handleDeleteOffer = async (req,res) => {
    try{
        const offer = await deleteOffer(req.params.id)
        res.json({message: 'Offer deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    handleCreateOffer,
    handleGetAllOffers,
    handleGetOfferByID,
    handleUpdateOffer,
    handleDeleteOffer
}