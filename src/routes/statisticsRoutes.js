const express = require('express')
const statisticsController = require('../controllers/statistictsController.js')
const router = express.Router()

router.get('/:idBrunch/import-history',statisticsController.importHistory)
router.get('/:idBrunch/prices-and-costs',statisticsController.pricesAndCosts)


module.exports = router

