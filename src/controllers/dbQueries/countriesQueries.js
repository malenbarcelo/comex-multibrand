const db = require('../../../database/models')
const sequelize = require('sequelize')

const countriesQueries = {
    allCountries: async(idBrunch) => {
        const allCountries = await db.Countries.findAll({
            order:['country'],
            raw:true
        })
        return allCountries
    },
    filterCountry: async(countryName) => {
        const country = await db.Countries.findOne({
            where:{country:countryName},
            raw:true
        })
        return country
    },
    countryName: async(idCountry) => {
        const countryName = await db.Countries.findOne({
            where:{id:idCountry},
            raw:true
        })
        return countryName
    },
    editCountry: async(idCountry,countryName) => {
        await db.Countries.update(
            {country:countryName},
            {where:{id:idCountry}}
    )
    },
    createCountry: async(countryName) => {
        await db.Countries.create({
                country:countryName
            })
    }
    
}       

module.exports = countriesQueries