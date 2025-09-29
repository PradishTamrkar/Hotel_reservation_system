const express = require('express') 
const { verifyToken, adminOnly } = require('../service/auth')
const adminController = require('../controllers/adminController')

const router = express.Router()

router.post('/register',adminController.createAdmin)
router.post('/login',adminController.adminLogin)
router.get('/',verifyToken, adminOnly, adminController.getAdmin)
router.get('/:id',verifyToken, adminOnly, adminController.getAdminByID)
router.put('/:id',verifyToken, adminOnly, adminController.updateAdmin)
router.delete('/:id',verifyToken, adminOnly, adminController.deleteAdmin)

module.exports=router