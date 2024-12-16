const pricesListsController = require('../../controllers/apisController/data/pricesListsController')
const volumeFactorsController = require('../../controllers/apisController/data/volumeFactorsController')
const coeficientFactorsController = require('../../controllers/apisController/data/coeficientFactorsController')
const suppliersController = require('../../controllers/apisController/data/suppliersController')
const currenciesController = require('../../controllers/apisController/data/currenciesController')
const measurementUnitsController = require('../../controllers/apisController/data/measurementUnitsController')
const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router()

//Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('public/files/pricesLists'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()    
      const fileExtension = path.extname(file.originalname)   
      const fileName = file.originalname.replace(fileExtension,'')      
      cb(null, 'priceList' + uniqueSuffix + fileExtension)
    }
})

const upload = multer({storage: storage})

/*---Prices Lists---*/
router.get('/prices-lists/:idBrunch',pricesListsController.pricesLists)
router.post('/prices-lists/add-item',pricesListsController.addItem)
router.post('/prices-lists/edit-item',pricesListsController.editItem)
router.post('/prices-lists/read-excel-file',upload.single('ulppFile'),pricesListsController.readExcelFile)
router.post('/prices-lists/upload-excel-file',pricesListsController.uploadExcelFile)
router.post('/prices-lists/download',pricesListsController.download)

/*---Volume factors---*/
router.get('/volume-factors/:idBrunch',volumeFactorsController.volumeFactors)
router.post('/volume-factors/create',volumeFactorsController.create)

/*---Coeficient factors---*/
router.get('/coeficient-factors/:idBrunch',coeficientFactorsController.coeficientFactors)
router.post('/coeficient-factors/create',coeficientFactorsController.create)

/*---Suppliers---*/
router.get('/suppliers',suppliersController.allSuppliers)
router.get('/suppliers/:idBrunch',suppliersController.suppliers)
router.post('/suppliers/create',suppliersController.create)
router.post('/suppliers/edit',suppliersController.edit) //composed route

/*---Currencies---*/
router.get('/currencies/:idBrunch',currenciesController.currencies)
router.post('/currencies/create-exchange-rate',currenciesController.createExchangeRate)

/*---Measurement units---*/
router.get('/measurement-units',measurementUnitsController.measurementUnits)


module.exports = router



