const express = require('express')
const importsController = require('../controllers/importsController.js')

const router = express.Router()

router.get('/:idBrunch/imports-data',importsController.imports)
router.get('/:idBrunch/imports-data/:supplier/:year/:po/:item',importsController.importsFiltered)
router.get('/:idBrunch/create-purchase-order/:idSupplier',importsController.createPo)
router.get('/:idBrunch/edit-purchase-order/:purchaseOrder',importsController.editPo)
router.get('/:idBrunch/view-purchase-order/:idPO/:showPrices',importsController.viewPurchaseOrder)
router.get('/:idBrunch/print-purchase-order/:idPO/:showPrices',importsController.printPO)
router.get('/:idBrunch/download-purchase-order/:idPO/:showPrices',importsController.downloadPoExcel)

module.exports = router



