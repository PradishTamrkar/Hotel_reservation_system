const express = require('express')
const promosAndOfferController = require('../controllers/promosAndOfferController')
const { verifyToken, adminOnly } = require('../service/auth')
const uploads = require('../service/uploads')

const router = express.Router()

router.post('/',verifyToken,adminOnly,uploads.single('offer_image'),promosAndOfferController.createOffer)
router.get('/',promosAndOfferController.getAllOffers)
router.get('/:id',promosAndOfferController.getOfferByID)
router.put('/:id',verifyToken,adminOnly,uploads.single('offer_image'),promosAndOfferController.updateOffer)
router.delete('/:id',verifyToken,adminOnly,promosAndOfferController.deleteOffer)

module.exports=router