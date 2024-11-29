
const importsController = require('../../controllers/apisController/importsController')
const express = require('express')

const router = express.Router()

router.get('/:idBrunch',importsController.imports)
router.post('/add-estimated-costs/:idBrunch',importsController.addEstimatedCosts)


module.exports = router



