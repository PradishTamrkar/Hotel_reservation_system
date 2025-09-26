const express = require('express')
const bookingController = require('../controllers/bookingController')

const router = express.Router()

router.post('/',bookingController.createBooking)
router.get('/',bookingController.getAllBooking)
router.get("/search", bookingController.searchBookingByCDetail)
router.get('/:id',bookingController.getBookingByID)
router.put('/:id',bookingController.updateBooking)
router.delete('/:id',bookingController.deleteBooking)


module.exports = router