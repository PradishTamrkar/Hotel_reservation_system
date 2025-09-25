const express = require('express')
const customerController = require('../controllers/customerController')

const router = express.Router()

router.post('/',customerController.createCustomer)
router.get('/',customerController.getAllCustomer)
router.get('/:id',customerController.getCustomersByID)
router.put('/:id',customerController.updateCustomer)
router.delete('/:id',customerController.deleteCustomer)

module.exports=router