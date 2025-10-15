const express = require('express')
const amenityBridgeController = require('../controllers/amenityBridgeController')
const { verifyToken, adminOnly } = require('../service/auth')

const router = express.Router()

router.post('/',verifyToken,adminOnly,amenityBridgeController.createAmenityBridge)
router.get('/',amenityBridgeController.getAllAmenityBridge)
router.get('/:id',amenityBridgeController.getAmenitiesByCategory)
router.put('/:id',verifyToken,adminOnly,amenityBridgeController.updateAmenityBridge)
router.delete('/:id',verifyToken,adminOnly,amenityBridgeController.deleteAmenityBridge)

module.exports=router