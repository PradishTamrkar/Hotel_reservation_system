const express = require('express')
const faqController = require('../controllers/faqController')
const { verifyToken, adminOnly } = require('../middlewares/auth')

const router = express.Router()

router.post('/',verifyToken,adminOnly,faqController.handleCreateFAQ)
router.get('/',faqController.handleGetAllFAQ)
router.get('/:id',faqController.handleGetFAQByID)
router.put('/:id',verifyToken,adminOnly,faqController.handleUpdateFAQ)
router.delete('/:id',verifyToken,adminOnly,faqController.handleDeleteFAQ)

module.exports=router