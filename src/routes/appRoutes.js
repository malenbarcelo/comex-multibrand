const express = require('express')
const backendController = require('../controllers/backendController.js')

const router = express.Router()

// imports
router.get('/imports/:idBrunch',backendController.imports)

// costings
router.get('/costings/:idBrunch',backendController.costings)

// prices
router.get('/sale-prices/:idBrunch',backendController.salePrices)

// data
router.get('/data/prices-lists/:idBrunch',backendController.pricesLists)
router.get('/data/volume-factors/:idBrunch',backendController.volumeFactors)
router.get('/data/coeficient-factors/:idBrunch',backendController.coeficientFactors)
router.get('/data/currencies/:idBrunch',backendController.currencies)
router.get('/data/suppliers/:idBrunch',backendController.suppliers)
router.get('/data/measurement-units/:idBrunch',backendController.measurementUnits)



module.exports = router



