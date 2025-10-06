const express = require('express')
const customerServiceController = require('../controllers/customerServicesController')
const { verifyToken, adminOnly } = require('../service/auth')

const router = express.Router()

router.post('/',verifyToken,adminOnly,customerServiceController.createCustomerService)
router.get('/',customerServiceController.getAllCustomerService)
router.get('/:id',customerServiceController.getCustomerServiceByID)
router.put('/:id',verifyToken,adminOnly,customerServiceController.updateCustomerService)
router.delete('/:id',verifyToken,adminOnly,customerServiceController.deleteCustomerService)

module.exports=router