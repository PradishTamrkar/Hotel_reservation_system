const express = require('express')
const contactUsController = require('../controllers/contactUsController')
const {verifyToken,adminOnly}=require('../middlewares/auth')

const router = express.Router()

router.post('/',contactUsController.handleCreateMessage)
router.get('/',verifyToken,adminOnly,contactUsController.handleGetAllMessages)
router.get('/:id',verifyToken,adminOnly,contactUsController.handleGetMessageByID)
router.delete('/:id',contactUsController.handleDeleteMessage)

module.exports=router