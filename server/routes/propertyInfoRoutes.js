const express = require('express')
const propertyInfoController = require('../controllers/propertyInfoController')

const router = express.Router()

router.post('/',propertyInfoController.createPropertyInfo)
router.get('/',propertyInfoController.getAllPropertyInfo)
router.get('/:id',propertyInfoController.getPropertyInfoByID)
router.put('/:id',propertyInfoController.updatePropertyInfo)
router.delete('/:id',propertyInfoController.deletePropertyInfo)

module.exports=router