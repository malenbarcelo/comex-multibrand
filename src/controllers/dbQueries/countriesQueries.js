const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_countries

const countriesQueries = {
    allCountries: async(idBrunch) => {
        const allCountries = await model.findAll({
            order:['country'],
            raw:true
        })
        return allCountries
    },
    filterCountry: async(countryName) => {
        const country = await model.findOne({
            where:{country:countryName},
            raw:true
        })
        return country
    },
    countryName: async(idCountry) => {
        const countryName = await model.findOne({
            where:{id:idCountry},
            raw:true
        })
        return countryName
    },
    editCountry: async(idCountry,countryName) => {
        await model.update(
            {country:countryName},
            {where:{id:idCountry}}
    )
    },
    createCountry: async(countryName) => {
        await model.create({
                country:countryName
            })
    }
    
}       

module.exports = countriesQueries