const {body} = require('express-validator')
const db = require('../../database/models')
const path = require('path')
const fs = require('fs')
const countriesQueries = require('../controllers/dbQueries/countriesQueries')

const countriesValidations = {
    editCountry: [
        body('countryName')
            .notEmpty().withMessage('Ingrese un país').bail()
            .custom(async(value,{ req }) => {                
                const countryName = req.body.countryName
                const country = await countriesQueries.filterCountry(countryName)
                console.log(country)
                if (country != null) {
                    throw new Error('Ya existe un país con el nombre "' + countryName +'"')
                }
                return true
            })
        ],
    createCountry: [
        body('countryName')
            .notEmpty().withMessage('Ingrese un país').bail()
            .custom(async(value,{ req }) => {                
                const countryName = req.body.countryName
                const country = await countriesQueries.filterCountry(countryName)
                console.log(country)
                if (country != null) {
                    throw new Error('Ya existe un país con el nombre "' + countryName +'"')
                }
                return true
            })
    ],
}

module.exports = countriesValidations