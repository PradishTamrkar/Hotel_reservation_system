const promos_and_offers = require("../models/promosAndOffers");
const PromosAndOffer = require("../models/promosAndOffers");
const { updateCustomer } = require("./customerController");

//offer Creation
const createOffer = async (req,res) => {
    try{

        console.log("Body:", req.body)
        console.log("File:", req.file)

        const body = req.body || {};
        const { offer_name,offer_description,offered_discount } = body
        if (!offer_name || !offer_description || !offered_discount) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const offer_image = req.file ? req.file.filename : null

        const newOffer =  await PromosAndOffer.create({
            offer_name,
            offer_description,
            offered_discount,
            offer_image
        })
        res.status(201).json({message:'Offer created successfully',offer: newOffer})
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

        console.log("Body:", req.body)
        console.log("File:", req.file)

        const body = req.body || {};
        const {offer_name,offer_description,offered_discount} = body

        const offer = await PromosAndOffer.findByPk(req.params.id)
        if(!offer)
            return res.status(404).json({message: 'Offer not found'})

        const offer_image = req.file? req.file.filename : offer.offer_image
        
        await offer.update({
            offer_name,
            offer_description,
            offered_discount,
            offer_image
        })
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