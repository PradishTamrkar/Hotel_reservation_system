const express = require('express')
const contactUsController = require('../controllers/contactUsController')
const {verifyToken,adminOnly}=require('../service/auth')
const router = express.Router()

router.post('/',contactUsController.createMessage)
router.get('/',verifyToken,adminOnly,contactUsController.getAllMessage)
router.get('/:id',verifyToken,adminOnly,contactUsController.getMessageByID)
router.delete('/:id',contactUsController.deleteMessage)

module.exports=router