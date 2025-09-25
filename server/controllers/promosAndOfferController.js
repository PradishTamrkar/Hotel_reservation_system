const PromosAndOffer = require("../models/promosAndOffers");
const { updateCustomer } = require("./customerController");

//offer Creation
const createOffer = async (req,res) => {
    try{
        const offer = await PromosAndOffer.create(req.body)
        res.status(201).json(offer)
    }catch(err){
        res.status(500).json({error: err.message});
    }
}

//GET ALL offers
const getAllOffers = async (req,res) => {
    try{
        const offer = await PromosAndOffer.findAll();
        res.json(offer)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//GET single Offer
const getOfferByID = async(req,res) => {
    try{
        const offer = await PromosAndOffer.findByPk(req.params.id)
        if(!offer) 
            return res.status(404).json({message: 'Offer not found'})
        res.json(offer)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}  

//Update offer Info
const updateOffer = async(req,res) => {
    try{
        const offer = await PromosAndOffer.findByPk(req.params.id)
        if(!offer)
            return res.status(404).json({message: 'Offer not found'})

        await offer.update(req.body)
        res.json(offer)
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

//Delete Offer
const deleteOffer = async (req,res) => {
    try{
        const offer = await PromosAndOffer.findByPk(req.params.id)
        if(!offer)
            return res.status(404).json({message: 'Offer not found'})
        await offer.destroy();
        res.json({message: 'Offer deleted successfully'})
    }catch(err){
        res.status(500).json({error: err.message})
    }
}

exports.createOffer = createOffer
exports.getAllOffers = getAllOffers
exports.getOfferByID = getOfferByID
exports.updateOffer = updateOffer
exports.deleteOffer = deleteOffer