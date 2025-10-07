const express = require('express')
const bookingHistoryController = require('../controllers/bookingHistoryController')

const router = express.Router()

router.get('/:customer_id',bookingHistoryController.getAllBookingsByCustomer)

module.exports=router