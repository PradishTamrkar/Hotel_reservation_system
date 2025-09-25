const express = require('express')
const contactUsController = require('../controllers/contactUsController')

const router = express.Router()

router.post('/',contactUsController.createMessage)
router.get('/',contactUsController.getAllMessage)
router.get('/:id',contactUsController.getMessageByID)
router.delete('/:id',contactUsController.deleteMessage)

module.exports=router