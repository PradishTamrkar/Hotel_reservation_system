const express = require('express')
const promosAndOfferController = require('../controllers/promosAndOfferController')
const { verifyToken, adminOnly } = require('../middlewares/auth')
const {upload,optimizeImage} = require('../middlewares/uploads')

const router = express.Router()

router.post('/',verifyToken,adminOnly,upload.single('offer_image'),optimizeImage,promosAndOfferController.handleCreateOffer)
router.get('/',promosAndOfferController.handleGetAllOffers)
router.get('/:id',promosAndOfferController.handleGetOfferByID)
router.put('/:id',verifyToken,adminOnly,upload.single('offer_image'),optimizeImage,promosAndOfferController.handleUpdateOffer)
router.delete('/:id',verifyToken,adminOnly,promosAndOfferController.handleDeleteOffer)

module.exports=router