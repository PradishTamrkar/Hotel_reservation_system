const express = require('express')
const roomController = require('../controllers/roomController')
const { verifyToken, adminOnly } = require('../service/auth')
const uploads = require('../service/uploads')

const router = express.Router()

router.post('/',verifyToken,adminOnly,uploads.single('room_images'),roomController.createRoom)
router.get('/',roomController.getAllRooms)
router.get('/:id',roomController.getRoomByID)
router.put('/:id',verifyToken,adminOnly,uploads.single('room_images'),roomController.updateRoom)
router.delete('/:id',verifyToken,adminOnly,roomController.deleteRoom)

module.exports = router