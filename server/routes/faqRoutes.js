const express = require('express')
const faqController = require('../controllers/faqController')
const { verifyToken, adminOnly } = require('../service/auth')

const router = express.Router()

router.post('/',verifyToken,adminOnly,faqController.createFAQ)
router.get('/',faqController.getAllFAQ)
router.get('/:id',faqController.getFAQByID)
router.put('/:id',verifyToken,adminOnly,faqController.updateFAQ)
router.delete('/:id',verifyToken,adminOnly,faqController.deleteFAQ)

module.exports=router