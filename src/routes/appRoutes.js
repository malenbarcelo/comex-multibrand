const express = require('express')
const backendController = require('../controllers/backendController.js')

const router = express.Router()

//IMPORTS
router.get('/imports/:idBrunch',backendController.imports)

//COSTING
router.get('/costings/:idBrunch',backendController.costings)

//DATA
router.get('/data/prices-lists/:idBrunch',backendController.pricesLists)
router.get('/data/volume-factors/:idBrunch',backendController.volumeFactors)
router.get('/data/coeficient-factors/:idBrunch',backendController.coeficientFactors)
router.get('/data/currencies/:idBrunch',backendController.currencies)
router.get('/data/suppliers/:idBrunch',backendController.suppliers)
router.get('/data/measurement-units/:idBrunch',backendController.measurementUnits)



module.exports = router



