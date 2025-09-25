const express = require('express')
const adminController = require('../controllers/adminController')

const router = express.Router()

router.post('/',adminController.createAdmin)
router.get('/',adminController.getAdmin)
router.get('/:id',adminController.getAdminByID)
router.put('/:id',adminController.updateAdmin)
router.delete('/:id',adminController.deleteAdmin)

module.exports=router