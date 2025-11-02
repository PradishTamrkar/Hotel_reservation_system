const express = require('express')
const hotelAmenitiesController = require('../controllers/hotelAmenitiesController')
const {verifyToken, adminOnly } = require('../middlewares/auth')
const {upload,optimizeImage} = require('../middlewares/uploads')

const router = express.Router()

router.post('/',verifyToken,adminOnly,upload.single('hotel_amenity_image'),optimizeImage,hotelAmenitiesController.handleCreateHotelAmenity)
router.get('/',hotelAmenitiesController.handleGetAllHotelAmenity)
router.get('/:id',hotelAmenitiesController.handleGetHotelAmenityByID)
router.put('/:id',verifyToken,adminOnly,upload.single('hotel_amenity_image'),optimizeImage,hotelAmenitiesController.handleUpdateHotelAmenity)
router.delete('/:id',verifyToken,adminOnly,hotelAmenitiesController.handleDeleteHotelAmenity)

module.exports=router