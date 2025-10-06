const express = require('express')
const roomController = require('../controllers/roomController')
const { verifyToken, adminOnly } = require('../service/auth')

const router = express.Router()

router.post('/',verifyToken,adminOnly,roomController.createRoom)
router.get('/',roomController.getAllRooms)
router.get('/:id',roomController.getRoomByID)
router.put('/:id',verifyToken,adminOnly,roomController.updateRoom)
router.delete('/:id',verifyToken,adminOnly,roomController.deleteRoom)

module.exports = router