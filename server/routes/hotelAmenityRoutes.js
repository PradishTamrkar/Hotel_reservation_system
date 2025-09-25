const express = require('express')
const hotelAmenitiesController = require('../controllers/hotelAmenitiesController')

const router = express.Router()

router.post('/',hotelAmenitiesController.createHotelAmenity)
router.get('/',hotelAmenitiesController.getAllHotelAmenity)
router.get('/:id',hotelAmenitiesController.getHotelAmenitysByID)
router.put('/:id',hotelAmenitiesController.updateHotelAmenity)
router.delete('/:id',hotelAmenitiesController.deleteHotelAmenity)

module.exports=router