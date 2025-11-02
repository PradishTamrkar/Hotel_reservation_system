const express = require('express')
const roomController = require('../controllers/roomController')
const { verifyToken, adminOnly } = require('../middlewares/auth')
const {upload,optimizeImage} = require('../middlewares/uploads')

const router = express.Router()

router.post('/',verifyToken,adminOnly,upload.single('room_images'),optimizeImage,roomController.handleCreateRoom)
router.get('/',roomController.handleGetAllRooms)
router.get('/:id',roomController.handleGetRoomByID)
router.put('/:id',verifyToken,adminOnly,upload.single('room_images'),optimizeImage,roomController.handleUpdateRoom)
router.delete('/:id',verifyToken,adminOnly,roomController.handleDeleteRoom)

module.exports = router