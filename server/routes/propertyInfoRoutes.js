const express = require('express')
const propertyInfoController = require('../controllers/propertyInfoController')
const {verifyToken, adminOnly} = require('../middlewares/auth')
const {upload,optimizeImage} = require('../middlewares/uploads')

const router = express.Router()

router.post('/',adminOnly,verifyToken,upload.single('property_info_image'),optimizeImage,propertyInfoController.createPropertyInfo)
router.get('/',propertyInfoController.getAllPropertyInfo)
router.get('/:id',propertyInfoController.getPropertyInfoByID)
router.put('/:id',verifyToken,adminOnly,upload.single('property_info_image'),optimizeImage,propertyInfoController.updatePropertyInfo)
router.delete('/:id',verifyToken,adminOnly,propertyInfoController.deletePropertyInfo)

module.exports=router