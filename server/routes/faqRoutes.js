const express = require('express')
const faqController = require('../controllers/faqController')

const router = express.Router()

router.post('/',faqController.createFAQ)
router.get('/',faqController.getAllFAQ)
router.get('/:id',faqController.getFAQByID)
router.put('/:id',faqController.updateFAQ)
router.delete('/:id',faqController.deleteFAQ)

module.exports=router