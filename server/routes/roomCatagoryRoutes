const express = require('express')
const roomCatagoryController = require('../controllers/roomCatagoryController')
const { verifyToken, adminOnly } = require('../middlewares/auth')
const uploads = require('../middlewares/uploads')

const router = express.Router()

router.post('/',verifyToken,adminOnly,uploads.single('room_catagory_images'),roomCatagoryController.handleCreateRoomCategory)
router.get('/',roomCatagoryController.handleGetAllRoomCategory)
router.get('/offers',roomCatagoryController.handleGetCatByExclusiveDeals)
router.get('/:id/rooms',roomCatagoryController.handleGetRoomByCategory)
router.get('/:id',roomCatagoryController.handleGetRoomCategoryByID)
router.put('/:id',verifyToken,adminOnly,uploads.single('room_catagory_images'),roomCatagoryController.handleUpdateRoomCategory)
router.delete('/:id',verifyToken,adminOnly,roomCatagoryController.handleDeleteRoomCategory)

module.exports=router