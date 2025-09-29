const express = require('express')
const { verifyToken, customerOrGuest } = require('../service/auth')
const customerController = require('../controllers/customerController')

const router = express.Router()

router.post('/register',customerController.createCustomer)
router.post('/login',customerController.customerLogin)
router.get('/',verifyToken, customerOrGuest, customerController.getAllCustomer)
router.get('/:id',verifyToken, customerOrGuest, customerController.getCustomersByID)
router.put('/:id',verifyToken, customerOrGuest, customerController.updateCustomer)
router.delete('/:id',verifyToken, customerOrGuest , customerController.deleteCustomer)

module.exports=router