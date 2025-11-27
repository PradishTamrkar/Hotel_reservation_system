const PromosAndOffer = require("../models/promosAndOffers");

//offer Creation
const createOffer = async (data,file) => {

    const { offer_name,offer_description,offered_discount } = data
    if (!offer_name || !offer_description || !offered_discount) {
        throw new Error("All fields are required");
    }

    const offer_image = file ? file.path : null

    const newOffer =  await PromosAndOffer.create({
        offer_name,
        offer_description,
        offered_discount,
        offer_image
    })

    return ({message:'Offer created successfully',offer: newOffer})
}

//GET ALL offers
const getAllOffers = async () => {
        
    const offer = await PromosAndOffer.findAll();
    return offer;
}

//GET single Offer
const getOfferByID = async(id) => {

    const offer = await PromosAndOffer.findByPk(id)
    if(!offer) 
        throw new Error('Offer not found')
    return offer;
}  

//Update offer Info
const updateOffer = async(id,data,file) => {

    const {offer_name,offer_description,offered_discount} = data

    const offer = await PromosAndOffer.findByPk(id)
    if(!offer)
        throw new Error('Offer not found')

    const offer_image = file? file.path : offer.offer_image
        
    await offer.update({
        offer_name,
        offer_description,
        offered_discount,
        offer_image
    })
    return ({ message: "Offer updated successfully", offer })
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