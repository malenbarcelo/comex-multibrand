const {body} = require('express-validator')
const db = require('../../database/models')
const path = require('path')
const fs = require('fs')
const readXlsFile = require('read-excel-file/node')
const muQueries = require('../controllers/dbQueries/measurementUnitsQueries')
const pricesListsQueries = require('../controllers/dbQueries/pricesListsQueries')
const suppliersQueries = require('../controllers/dbQueries/suppliersQueries')

const pricesListsValidations = {
    createItem: [
        body('item')
            .notEmpty().withMessage('El campo no puede estar vacío')
            .custom(async(value,{ req }) => {
                const idBrunch = req.params.idBrunch
                const supplier = await suppliersQueries.supplierId(req.body.supplier)
                const supplierPriceList = await pricesListsQueries.supplierPriceList(idBrunch,supplier.id)
                const supplierPriceListItems = []

                supplierPriceList.forEach(item => {
                    supplierPriceListItems.push(item.item)
                })

                if (supplierPriceListItems.includes(req.body.item)) {
                    throw new Error('El item ya existe en la lista de precios del proveedor')
                }
            }),
        body('description').notEmpty().withMessage('El campo no puede estar vacío'),
        body('fob')
            .notEmpty().withMessage('El campo no puede estar vacío').bail()
            .isNumeric().withMessage('El campo debe ser numérico, utilice el punto (.) como separador de decimales'),
        body('selectMU')
            .custom(async(value,{ req }) => {
                if(req.body.selectMU == 'default'){
                    throw new Error('Debe seleccionar una unidad de medida')
                }
                return true
            }),
        body('muPerBox')
            .notEmpty().withMessage('El campo no puede estar vacío').bail()
            .isNumeric().withMessage('El campo debe ser numérico, utilice el punto (.) como separador de decimales'),
        body('weight')
            .notEmpty().withMessage('El campo no puede estar vacío').bail()
            .isNumeric().withMessage('El campo debe ser numérico, utilice el punto (.) como separador de decimales'),
        body('volume')
            .notEmpty().withMessage('El campo no puede estar vacío').bail()
            .isNumeric().withMessage('El campo debe ser numérico, utilice el punto (.) como separador de decimales').bail()
            .custom(async(value,{ req }) => {
                if (req.body.selectCostCalc == "Volumen" && req.body.volume == 0) {
                    throw new Error('Si el cálculo de costo es por volumen, el volumen no puede ser 0')
                }
            }),
        body('brand').notEmpty().withMessage('El campo no puede estar vacío'),
        body('origin').notEmpty().withMessage('El campo no puede estar vacío'),
        body('selectCostCalc')
            .custom(async(value,{ req }) => {
                if(req.body.selectCostCalc == 'default'){
                    throw new Error('Debe seleccionar una opción')
                }
                return true
            }),
        body('hasBreaks')
            .custom(async(value,{ req }) => {
                if(req.body.hasBreaks == 'default'){
                    throw new Error('Debe seleccionar una opción')
                }
                return true
            })
    ],
    uploadPriceList: [
        body('priceList')
            .custom(async(value,{ req }) => {
                let file = req.file
                let acceptedExtensions = ['.xls','.xlsx','.xlsm']
                if(!file){
                    throw new Error('Debe subir un archivo')
                }else{
                    let fileExtension = path.extname(file.originalname)
                    if(!acceptedExtensions.includes(fileExtension)){
                        throw new Error(`Las extensiones aceptadas son ${acceptedExtensions.join(',')}`)
                    }else{
                        const fileName = req.file.filename
                        const data = await readXlsFile('public/images/' + fileName)

                        for (let i = 1; i < data.length; i++) {
                            if (data[i][0] == null || data[i][1] == null || data[i][9] == null || data[i][10] == null) {
                                throw new Error('Los campos "Item", "Descripción", "Marca" y "Origen" no pueden estar vacíos')
                            }

                            const mus = await muQueries.allMU()
                            let acceptedMus = []
                            mus.forEach(mu => {
                                acceptedMus.push(mu.measurement_unit)
                            })

                            if(!acceptedMus.includes(data[i][2])){
                                throw new Error(`Las unidades de medida aceptadas son "${acceptedMus.join('", "')}"`)
                            }

                            if(isNaN(data[i][3]) || data[i][3]===null){
                                throw new Error('El campo "UM por caja" debe estar completo y debe ser numérico')
                            }

                            if( data[i][4]===null && data[i][7]=='Volumen' || isNaN(data[i][4])){
                                throw new Error('Si el costeo es por Volumen, el campo "Volumen (m3)" debe estar completo y debe ser numérico')
                            }

                            if (data[i][5] == null || isNaN(data[i][5]) || data[i][6] == null || isNaN(data[i][6]) ) {
                                throw new Error('Los campos "Peso (kg)" y "Precio por UM" deben estar completos y deben ser numéricos')
                            }

                            if (data[i][7] !== 'Volumen' && data[i][7] !== 'Precio' ) {
                                throw new Error('El campo "Costeo" solo admite los valores "Volumen" y "Precio"')
                            }

                            if (data[i][8] !== 'si' && data[i][8] !== 'no' ) {
                                throw new Error('El campo "Roturas" solo admite los valores "si" y "no"')
                            }

                            const idBrunch = req.params.idBrunch
                            const idSupplier = req.params.idSupplier
                            const supplierPriceList = await pricesListsQueries.supplierPriceList(idBrunch, idSupplier)
                            const dataItems = []
                            const supplierPriceListItems = []
                            const missingItems = []

                            supplierPriceList.forEach(item => {
                                supplierPriceListItems.push(item.item)
                            })

                            for (let i = 1; i < data.length; i++) {
                                dataItems.push(data[i][0].toString())
                            }

                            supplierPriceListItems.forEach(item => {
                                if(!dataItems.includes(item)){
                                    missingItems.push(item)
                                }
                            })

                            if(missingItems.length > 0){
                                throw new Error('La nueva lista debe incluir todos los items de la lista anterior. Items faltantes: ' + missingItems)
                            }

                            const removeDuplicates = [...new Set(dataItems)]

                            if(removeDuplicates.length < dataItems.length){
                                throw new Error('Hay items duplicados en la lista a subir')
                            }
                        }
                    }
                }
                return true
            })
        ]
    }

module.exports = pricesListsValidations