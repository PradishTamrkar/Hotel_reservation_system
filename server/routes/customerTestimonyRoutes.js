const express = require('express')
const customerTestimonyController = require('../controllers/customerTestimonyController')

const router = express.Router()

router.post('/',customerTestimonyController.createCustomerTestimony)
router.get('/',customerTestimonyController.getAllCustomersTestimony)
// router.get('/:id',customerTestimonyController.getCustomerTestimonyByID)
router.put('/:id',customerTestimonyController.updateCustomerTestimony)
router.delete('/:id',customerTestimonyController.deleteCustomerTestimony)

module.exports=router