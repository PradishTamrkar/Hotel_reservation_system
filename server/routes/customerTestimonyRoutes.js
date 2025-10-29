const express = require('express')
const customerTestimonyController = require('../controllers/customerTestimonyController')
const { verifyToken,adminOnly, customerOnly } = require('../middlewares/auth')

const router = express.Router()

router.post('/',verifyToken,customerOnly,customerTestimonyController.handleCreateCustomerTestimony)
router.get('/',customerTestimonyController.handleGetAllCustomerTestimonies)
// router.get('/:id',customerTestimonyController.getCustomerTestimonyByID)
router.put('/:id',verifyToken,customerTestimonyController.handleUpdateCustomerTestimony)
router.delete('/:id',verifyToken,adminOnly,customerTestimonyController.handleDeleteCustomerTestimony)

module.exports=router