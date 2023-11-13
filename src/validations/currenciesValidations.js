const {body} = require('express-validator')
const db = require('../../database/models')
const path = require('path')
const fs = require('fs')
const currenciesQueries = require('../controllers/dbQueries/currenciesQueries')
const brunchesQueries = require('../controllers/dbQueries/brunchesQueries')

const currenciesValidations = {
    editCurrency: [
        body('currencyExchange')
            .notEmpty().withMessage('Ingrese una tasa de cambio').bail()
            .isNumeric().withMessage('La tasa de cambio debe ser numérica. Use el punto (.) como separador de decimales')
    ],
    createCurrency: [
        body('currencyName')
            .notEmpty().withMessage('Ingrese una moneda').bail()
            .custom(async(value,{ req }) => {                
                const idBrunch = req.params.idBrunch
                const brunch = await brunchesQueries.brunch(idBrunch)
                const currencyName = req.body.currencyName
                const idCurrency = await currenciesQueries.idCurrency(currencyName)
                if (idCurrency != null) {
                    const currencyToCreate = await currenciesQueries.findCurrency(idCurrency,idBrunch)
                    if (currencyToCreate) {
                        throw new Error('Ya existe una moneda con el nombre "' + currencyName + '" en ' + brunch.brunch)
                    }
                }
                return true
            }),
        body('currencyExchange')
            .notEmpty().withMessage('Ingrese una tasa de cambio').bail()
            .isNumeric().withMessage('La tasa de cambio debe ser numérica. Use el punto (.) como separador de decimales')
    ],
}

module.exports = currenciesValidations