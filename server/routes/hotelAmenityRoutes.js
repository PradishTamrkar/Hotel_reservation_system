const express = require('express')
const hotelAmenitiesController = require('../controllers/hotelAmenitiesController')
const {verifyToken, adminOnly } = require('../middlewares/auth')
const uploads = require('../middlewares/uploads')

const router = express.Router()

router.post('/',verifyToken,adminOnly,uploads.single('hotel_amenity_image'),hotelAmenitiesController.handleCreateHotelAmenity)
router.get('/',hotelAmenitiesController.handleGetAllHotelAmenity)
router.get('/:id',hotelAmenitiesController.handleGetHotelAmenityByID)
router.put('/:id',verifyToken,adminOnly,uploads.single('hotel_amenity_image'),hotelAmenitiesController.handleUpdateHotelAmenity)
router.delete('/:id',verifyToken,adminOnly,hotelAmenitiesController.handleDeleteHotelAmenity)

module.exports=router