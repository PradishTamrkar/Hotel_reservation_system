const express = require('express')
const bookingDetailsController = require('../controllers/bookingDetailsController')

const router = express.Router()

router.post('/',bookingDetailsController.createBookingDetails)
router.get('/',bookingDetailsController.getAllBookingDetails)
router.get('/:id',bookingDetailsController.getBookingDetailsByID)
router.put('/:id',bookingDetailsController.updateBookingDetails)
router.delete('/:id',bookingDetailsController.deleteBookingDetails)

module.exports=router