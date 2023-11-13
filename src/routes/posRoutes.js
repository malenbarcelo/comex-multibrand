const express = require('express')
const posController = require('../controllers/posController.js')


const router = express.Router()

router.get('/:idBrunch/create-purchase-order',posController.createPo)



module.exports = router



