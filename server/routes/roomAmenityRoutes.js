const express = require('express')
const roomAmenitiesController = require('../controllers/roomAmenitiesController')
const { verifyToken, adminOnly } = require('../middlewares/auth')

const router = express.Router()

router.post('/',verifyToken,adminOnly,roomAmenitiesController.handleCreateRAmenity)
router.get('/',roomAmenitiesController.handleGetAllRAmenity)
router.get('/:id',roomAmenitiesController.handleGetRAmenityByID)
router.put('/:id',verifyToken,adminOnly,roomAmenitiesController.handleUpdateRAmenity)
router.delete('/:id',verifyToken,adminOnly,roomAmenitiesController.handleDeleteRAmenity)

module.exports=router