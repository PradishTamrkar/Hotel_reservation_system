const express = require('express')
const customerServiceController = require('../controllers/customerServicesController')

const router = express.Router()

router.post('/',customerServiceController.createCustomerService)
router.get('/',customerServiceController.getAllCustomerService)
router.get('/:id',customerServiceController.getCustomerServiceByID)
router.put('/:id',customerServiceController.updateCustomerService)
router.delete('/:id',customerServiceController.deleteCustomerService)

module.exports=router