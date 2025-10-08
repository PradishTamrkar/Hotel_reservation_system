const express = require('express')
const customerTestimonyController = require('../controllers/customerTestimonyController')
const { verifyToken,customerOrGuest,adminOnly } = require('../service/auth')

const router = express.Router()

router.post('/',verifyToken,customerOrGuest,customerTestimonyController.createCustomerTestimony)
router.get('/',customerTestimonyController.getAllCustomersTestimony)
// router.get('/:id',customerTestimonyController.getCustomerTestimonyByID)
router.put('/:id',customerTestimonyController.updateCustomerTestimony)
router.delete('/:id',verifyToken,adminOnly,customerTestimonyController.deleteCustomerTestimony)

module.exports=router