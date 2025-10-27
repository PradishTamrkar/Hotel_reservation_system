const express = require('express')
const promosAndOfferController = require('../controllers/promosAndOfferController')
const { verifyToken, adminOnly } = require('../middlewares/auth')
const uploads = require('../middlewares/uploads')

const router = express.Router()

router.post('/',verifyToken,adminOnly,uploads.single('offer_image'),promosAndOfferController.handleCreateOffer)
router.get('/',promosAndOfferController.handleGetAllOffers)
router.get('/:id',promosAndOfferController.handleGetOfferByID)
router.put('/:id',verifyToken,adminOnly,uploads.single('offer_image'),promosAndOfferController.handleUpdateOffer)
router.delete('/:id',verifyToken,adminOnly,promosAndOfferController.handleDeleteOffer)

module.exports=router