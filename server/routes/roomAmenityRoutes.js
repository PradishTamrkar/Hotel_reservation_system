const express = require('express')
const roomAmenitiesController = require('../controllers/roomAmenitiesController')

const router = express.Router()

router.post('/',roomAmenitiesController.createRAmenity)
router.get('/',roomAmenitiesController.getAllRAmenity)
router.get('/:id',roomAmenitiesController.getRAmenityByID)
router.put('/:id',roomAmenitiesController.updateRAmenity)
router.delete('/:id',roomAmenitiesController.deleteRAmenity)

module.exports=router