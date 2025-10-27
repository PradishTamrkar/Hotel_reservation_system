const express = require('express')
const { verifyToken, customerOnly } = require('../middlewares/auth')
const customerController = require('../controllers/customerController')

const router = express.Router()

router.post('/register',customerController.handleCreateCustomer)
router.post('/login',customerController.handleCustomerLogin)
router.get('/',customerController.handleGetAllCustomers)
router.get('/:id',customerController.handleGetCustomerByID)
router.put('/:id',verifyToken, customerController.handleUpdateCustomer)
router.delete('/:id',verifyToken, customerController.handleDeleteCustomer)

module.exports=router