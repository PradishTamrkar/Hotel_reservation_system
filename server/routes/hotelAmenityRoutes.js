const express = require('express')
const hotelAmenitiesController = require('../controllers/hotelAmenitiesController')
const {verifyToken, adminOnly } = require('../service/auth')
const uploads = require('../service/uploads')

const router = express.Router()

router.post('/',verifyToken,adminOnly,uploads.single('hotel_amenity_image'),hotelAmenitiesController.createHotelAmenity)
router.get('/',hotelAmenitiesController.getAllHotelAmenity)
router.get('/:id',hotelAmenitiesController.getHotelAmenitysByID)
router.put('/:id',verifyToken,adminOnly,uploads.single('hotel_amenity_image'),hotelAmenitiesController.updateHotelAmenity)
router.delete('/:id',verifyToken,adminOnly,hotelAmenitiesController.deleteHotelAmenity)

module.exports=router