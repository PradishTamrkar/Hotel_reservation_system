const PromosAndOffer = require("../models/promosAndOffers");
const getFileURL = require("../service/getFileURL");

//offer Creation
const createOffer = async (data,file) => {

    const { offer_name,offer_description,offered_discount } = data
    if (!offer_name || !offer_description || !offered_discount) {
        throw new Error("All fields are required");
    }

    const offer_image = file ? file.filename : null

    const newOffer =  await PromosAndOffer.create({
        offer_name,
        offer_description,
        offered_discount,
        offer_image
    })

    const offerWithUrl = {
        ...newOffer.toJSON(),
        offer_image: getFileURL(newOffer.offer_image)
    }
    return ({message:'Offer created successfully',offer: offerWithUrl})
}

//GET ALL offers
const getAllOffers = async () => {
        
    const offer = await PromosAndOffer.findAll();
    const offerWithUrl = offer.map(o => ({
        ...o.toJSON(),
        offer_image: getFileURL(o.offer_image)
    }))
    return (offerWithUrl)
}

//GET single Offer
const getOfferByID = async(id) => {

    const offer = await PromosAndOffer.findByPk(id)
    if(!offer) 
        throw new Error('Offer not found')

    const offerWithUrl = {
        ...offer.toJSON(),
        offer_image: getFileURL(offer.offer_image)
    }
    return (offerWithUrl)
}  

//Update offer Info
const updateOffer = async(id,data,file) => {

    const {offer_name,offer_description,offered_discount} = data

    const offer = await PromosAndOffer.findByPk(id)
    if(!offer)
        throw new Error('Offer not found')

    const offer_image = file? file.filename : offer.offer_image
        
    await offer.update({
        offer_name,
        offer_description,
        offered_discount,
        offer_image
    })

    const offerWithUrl = {
        ...offer.toJSON(),
        offer_image: getFileURL(offer.offer_image)
    }
    return ({ message: "Offer updated successfully", offer: offerWithUrl })
}

//Delete Offer
const deleteOffer = async (id) => {
        
    const offer = await PromosAndOffer.findByPk(id)
    if(!offer)
        throw new Error('Offer not found')
    await offer.destroy();
    return ({message: 'Offer deleted successfully'})
}

module.exports = {
    createOffer,
    getAllOffers,
    getOfferByID,
    updateOffer,
    deleteOffer
}