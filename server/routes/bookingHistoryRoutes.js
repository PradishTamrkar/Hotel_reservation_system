const express = require('express')
const bookingHistoryController = require('../controllers/bookingHistoryController')

const router = express.Router()

router.get('/:customerID',bookingHistoryController.getAllBookingsByCustomer)

module.exports=router