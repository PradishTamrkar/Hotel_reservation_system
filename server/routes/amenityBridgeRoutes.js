const express = require('express')
const amenityBridgeController = require('../controllers/amenityBridgeController')
const { verifyToken, adminOnly } = require('../middlewares/auth')

const router = express.Router()

router.post('/',verifyToken,adminOnly,amenityBridgeController.handleCreateAmenityBridge)
router.get('/',amenityBridgeController.hanldeGetAllAmenityBridge)
router.get('/:id',amenityBridgeController.handleGetAmenitiesByCategory)
router.put('/:id',verifyToken,adminOnly,amenityBridgeController.handleUpdateAmenityBridge)
router.delete('/:id',verifyToken,adminOnly,amenityBridgeController.hanldDeleteAmenityBridge)

module.exports=router