const express = require('express')
const bookingController = require('../controllers/bookingController')
const { verifyToken, customerOrGuest, adminOnly } =require('../service/auth')

const router = express.Router()

router.post('/',verifyToken,customerOrGuest,bookingController.createBooking)
router.get('/',verifyToken,adminOnly,bookingController.getAllBooking)
router.get("/search",verifyToken,adminOnly,bookingController.searchBookingByCDetail)
router.get('/:id',verifyToken,bookingController.getBookingByID)
router.put('/:id',verifyToken,bookingController.updateBooking)
router.delete('/:id',verifyToken,bookingController.deleteBooking)


module.exports = router