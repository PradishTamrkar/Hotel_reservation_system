const express = require('express')
const promosAndOfferController = require('../controllers/promosAndOfferController')
const { verifyToken, adminOnly } = require('../service/auth')

const router = express.Router()

router.post('/',verifyToken,adminOnly,promosAndOfferController.createOffer)
router.get('/',promosAndOfferController.getAllOffers)
router.get('/:id',promosAndOfferController.getOfferByID)
router.put('/:id',verifyToken,adminOnly,promosAndOfferController.updateOffer)
router.delete('/:id',verifyToken,adminOnly,promosAndOfferController.deleteOffer)

module.exports=router