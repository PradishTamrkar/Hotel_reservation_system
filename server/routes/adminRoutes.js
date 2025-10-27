const express = require('express') 
const { verifyToken, adminOnly } = require('../middlewares/auth')
const adminController = require('../controllers/adminController')

const router = express.Router()

router.post('/register',adminController.handleCreateAdmin)
router.post('/login',adminController.handleAdminLogin)
router.get('/',verifyToken, adminOnly, adminController.handleGetAdminByID)
router.get('/:id',verifyToken, adminOnly, adminController.handleGetAdminByID)
router.put('/:id',verifyToken, adminOnly, adminController.handleUpdateAdmin)
router.delete('/:id',verifyToken, adminOnly, adminController.handleDeleteAdmin)

module.exports=router