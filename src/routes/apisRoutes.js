const express = require('express')
const apisController = require('../controllers/apisController.js')
const importsController = require('../controllers/importsController.js')

const router = express.Router()

//IMPORTS
router.post('/receive-import',importsController.receiveImport)


//PURCHASE ORDERS
router.get('/:idBrunch/filter-pos-details/:item',apisController.filterPosWithItem)
router.get('/:idBrunch/imports-by-supplier',apisController.posBySupplier)
router.get('/:idBrunch/imports-by-supplier-and-year/:year',apisController.posBySupplierAndYear)
router.get('/:idBrunch/item-last-po',apisController.itemsLastPo)



router.get('/:idBrunch/price-list/:idSupplier',apisController.priceList)
router.get('/:idBrunch/filter-supplier/:idSupplier',apisController.filterSupplier)
router.get('/:idBrunch/filter-brunch',apisController.filterBrunch)
router.get('/filter-purchase-order/:purchaseOrder',apisController.filterPurchaseOrder)
router.get('/measurement-units',apisController.measurementUnits)
router.get('/suppliers',apisController.suppliers)
router.get('/users',apisController.users)
router.get('/currencies',apisController.currencies)
router.post('/users/restore-password/:idUser',apisController.restorePassword)
router.get('/:idBrunch/purchase-orders',apisController.purchaseOrders)
router.delete('/delete-currency/:idCurrencyExchange',apisController.deleteCurrency)
router.post('/delete-item/:idItem',apisController.deleteItem)
router.post('/create-purchase-order',apisController.createPo)
router.get('/purchase-order-details/:purchaseOrder',apisController.purchaseOrderDetails)


module.exports = router
