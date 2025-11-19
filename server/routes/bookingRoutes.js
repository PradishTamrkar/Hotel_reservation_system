const express = require('express')
const bookingController = require('../controllers/bookingController')
const { verifyToken, adminOnly, allowCustomerOrGuest, customerOnly } =require('../middlewares/auth')

const router = express.Router()

router.post('/',verifyToken, allowCustomerOrGuest,bookingController.handleCreateBooking)
router.get('/',verifyToken,adminOnly,bookingController.handleGetAllBooking)
router.get("/search",verifyToken,adminOnly,bookingController.handleSearchBookingByCDetail)
router.get('/customer/:customerId', verifyToken, bookingController.handleGetBookingsByCustomerId);
router.get('/:id',verifyToken,bookingController.handleGetBookingByID)
router.put('/:id',verifyToken,bookingController.hanldeUpdateBooking)
router.delete('/:id',verifyToken,bookingController.handleDeleteBooking)

module.exports = router