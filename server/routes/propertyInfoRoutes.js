const express = require('express')
const propertyInfoController = require('../controllers/propertyInfoController')
const {verifyToken, adminOnly} = require('../service/auth')
const uploads = require('../service/uploads')

const router = express.Router()

router.post('/',adminOnly,verifyToken,uploads.single('property_info_image'),propertyInfoController.createPropertyInfo)
router.get('/',propertyInfoController.getAllPropertyInfo)
router.get('/:id',propertyInfoController.getPropertyInfoByID)
router.put('/:id',verifyToken,adminOnly,uploads.single('property_info_image'),propertyInfoController.updatePropertyInfo)
router.delete('/:id',verifyToken,adminOnly,propertyInfoController.deletePropertyInfo)

module.exports=router