const express = require('express')
const roomController = require('../controllers/roomController')
const { verifyToken, adminOnly } = require('../middlewares/auth')
const uploads = require('../middlewares/uploads')

const router = express.Router()

router.post('/',verifyToken,adminOnly,uploads.single('room_images'),roomController.handleCreateRoom)
router.get('/',roomController.handleGetAllRooms)
router.get('/:id',roomController.handleGetRoomByID)
router.put('/:id',verifyToken,adminOnly,uploads.single('room_images'),roomController.handleUpdateRoom)
router.delete('/:id',verifyToken,adminOnly,roomController.handleDeleteRoom)

module.exports = router