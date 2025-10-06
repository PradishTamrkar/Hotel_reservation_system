const express = require('express')
const propertyInfoController = require('../controllers/propertyInfoController')
const {verifyToken, adminOnly} = require('../service/auth')

const router = express.Router()

router.post('/',adminOnly,verifyToken,propertyInfoController.createPropertyInfo)
router.get('/',propertyInfoController.getAllPropertyInfo)
router.get('/:id',propertyInfoController.getPropertyInfoByID)
router.put('/:id',verifyToken,adminOnly,propertyInfoController.updatePropertyInfo)
router.delete('/:id',verifyToken,adminOnly,propertyInfoController.deletePropertyInfo)

module.exports=router