const express = require('express')
const dataController = require('../controllers/dataController.js')
const currenciesValidations = require('../validations/currenciesValidations.js')
const countriesValidations = require('../validations/countriesValidations.js')
const pricesListsValidations = require('../validations/pricesListsValidations.js')

const multer = require('multer')
const path = require('path')

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('public/images'))
    },
    filename: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname)
      const fileName = 'priceList'    
      cb(null, fileName + fileExtension)
    }
})

const upload = multer({storage: storage})

router.get('/:idBrunch/currencies',dataController.currencies)
router.get('/:idBrunch/edit-currency/:idCurrencyExchange',dataController.editCurrency)
router.post('/:idBrunch/edit-currency/:idCurrencyExchange',currenciesValidations.editCurrency,dataController.editCurrencyProcess)
router.get('/:idBrunch/create-currency',dataController.createCurrency)
router.post('/:idBrunch/create-currency',currenciesValidations.createCurrency,dataController.createCurrencyProcess)
router.get('/:idBrunch/countries',dataController.countries)
router.get('/:idBrunch/create-country',dataController.createCountry)
router.post('/:idBrunch/create-country',countriesValidations.createCountry,dataController.createCountryProcess)
router.get('/:idBrunch/edit-country/:idCountry',dataController.editCountry)
router.post('/:idBrunch/edit-country/:idCountry',countriesValidations.editCountry,dataController.editCountryProcess)
router.post('/:idBrunch/upload-price-list/:idSupplier', upload.single('priceList'),pricesListsValidations.uploadPriceList,dataController.uploadPriceList)
router.get('/:idBrunch/create-item/:idSupplier',dataController.createItem)
router.post('/:idBrunch/create-item',pricesListsValidations.createItem,dataController.createItemProcess)
router.get('/:idBrunch/download-price-list/:idSupplier',dataController.downloadPriceList)


router.get('/:idBrunch/suppliers',dataController.suppliers)
router.get('/:idBrunch/edit-supplier/:idSupplier',dataController.editSupplier)
router.post('/:idBrunch/edit-supplier/:idSupplier',dataController.editSupplierProcess)
router.get('/:idBrunch/create-supplier',dataController.createSupplier)
router.post('/:idBrunch/create-supplier',dataController.createSupplierProcess)
router.get('/:idBrunch/measurement-units',dataController.measurementUnits)
router.get('/:idBrunch/edit-mu/:idMU',dataController.editMU)
router.post('/:idBrunch/edit-mu/:idMU',dataController.editMUProcess)
router.get('/:idBrunch/create-mu',dataController.createMU)
router.post('/:idBrunch/create-mu',dataController.createMUProcess)
router.get('/:idBrunch/prices-lists/:idSupplier',dataController.pricesLists)
router.post('/:idBrunch/prices-lists/:idSupplier',dataController.pricesLists)
router.get('/:idBrunch/edit-item/:idItem',dataController.editItem)
router.post('/:idBrunch/edit-item/:idItem',dataController.editItemProcess)



module.exports = router



