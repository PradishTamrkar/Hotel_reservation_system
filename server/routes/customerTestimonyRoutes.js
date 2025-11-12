const express = require('express')
const customerTestimonyController = require('../controllers/customerTestimonyController')
const { verifyToken,adminOnly, customerOnly } = require('../middlewares/auth')

const router = express.Router()

router.post('/',verifyToken,customerOnly,customerTestimonyController.handleCreateCustomerTestimony)
router.get('/',customerTestimonyController.handleGetAllCustomerTestimonies)
router.get('/featured', customerTestimonyController.handleGetFeaturedTestimonies)
router.patch('/:id/toggle-featured', verifyToken, adminOnly, customerTestimonyController.handleToggleFeaturedTestimony)
router.put('/:id',verifyToken,customerTestimonyController.handleUpdateCustomerTestimony)
router.delete('/:id',verifyToken,adminOnly,customerTestimonyController.handleDeleteCustomerTestimony)

module.exports=router