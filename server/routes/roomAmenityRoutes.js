const express = require('express')
const roomAmenitiesController = require('../controllers/roomAmenitiesController')
const { verifyToken, adminOnly } = require('../service/auth')

const router = express.Router()

router.post('/',verifyToken,adminOnly,roomAmenitiesController.createRAmenity)
router.get('/',roomAmenitiesController.getAllRAmenity)
router.get('/:id',roomAmenitiesController.getRAmenityByID)
router.put('/:id',verifyToken,adminOnly,roomAmenitiesController.updateRAmenity)
router.delete('/:id',verifyToken,adminOnly,roomAmenitiesController.deleteRAmenity)

module.exports=router