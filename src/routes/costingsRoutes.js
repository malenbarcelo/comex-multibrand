const express = require('express')
const costingsController = require('../controllers/costingsController.js')
const router = express.Router()

//BACKEND
router.get('/:idBrunch',costingsController.costings)

//APIS
router.get('/:idBrunch/all-data',costingsController.costingsData)
router.get('/:idBrunch/changes',costingsController.changes)
router.post('/:idBrunch/update',costingsController.update)
router.post('/:idBrunch/update-changes',costingsController.updateChanges)
router.post('/download',costingsController.download)

module.exports = router

