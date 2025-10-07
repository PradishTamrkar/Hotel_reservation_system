const express = require('express')
const { verifyToken, customerOrGuest } = require('../service/auth')
const customerController = require('../controllers/customerController')

const router = express.Router()

router.post('/register',customerController.createCustomer)
router.post('/login',customerController.customerLogin)
router.get('/',customerController.getAllCustomer)
router.get('/:id',customerController.getCustomersByID)
router.put('/:id',verifyToken, customerController.updateCustomer)
router.delete('/:id',verifyToken, customerController.deleteCustomer)

module.exports=router