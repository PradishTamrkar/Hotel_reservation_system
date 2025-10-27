const express = require('express')
const bookingDetailsController = require('../controllers/bookingDetailsController')

const router = express.Router()

router.get('/',bookingDetailsController.handleGetAllBookingDetails)
router.get('/:booking_id',bookingDetailsController.handleGetBookingDetailsByBookingID)

module.exports=router