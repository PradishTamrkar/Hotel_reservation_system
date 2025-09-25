const express = require('express')
const promosAndOfferController = require('../controllers/promosAndOfferController')

const router = express.Router()

router.post('/',promosAndOfferController.createOffer)
router.get('/',promosAndOfferController.getAllOffers)
router.get('/:id',promosAndOfferController.getOfferByID)
router.put('/:id',promosAndOfferController.updateOffer)
router.delete('/:id',promosAndOfferController.deleteOffer)

module.exports=router