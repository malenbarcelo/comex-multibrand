
const importsDetailsController = require('../../controllers/apisController/importsDetailsController')
const express = require('express')

const router = express.Router()

router.post('/update',importsDetailsController.update)

module.exports = router



