const db = require('../../../database/models')
const sequelize = require('sequelize')

const currenciesQueries = {
    currencies: async() => {
        const currencies = await db.Currencies.findAll({
            raw:true
        })
        return currencies
    },
    brunchCurrencies: async(idBrunch) => {
        const brunchCurrencies = await db.Currencies_exchange.findAll({
            where:{id_brunches:idBrunch},
            include: [
                { association: 'currency_exchange_currency'}
            ],
            raw:true,
            nest:true
        })
        return brunchCurrencies
    },
    createCurrency: async(currencyName) => {
        const currency = await db.Currencies.findOne({
            where:{currency:currencyName}
        })

        if (!currency) {
            await db.Currencies.create({
                currency:currencyName
            })
        }
    },
    createCurrencyExchange: async(idBrunch,idCurrency,currencyExchange) => {
        await db.Currencies_exchange.create({
            id_brunches:idBrunch,
            id_currencies: idCurrency,
            currency_exchange:currencyExchange
            })
    },
    currencyExchangeData: async(idCurrencyExchange) => {
        const currencyExchangeData = await db.Currencies_exchange.findOne({
            where:{id:idCurrencyExchange},
            include: [{association: 'currency_exchange_currency'}],
            raw:true,
            nest:true
        })
        return currencyExchangeData
    },
    deleteCurrencyExchange: async(idCurrencyExchange) => {
        await db.Currencies_exchange.destroy({
            where:{id:idCurrencyExchange}
            })
    },
    deleteCurrency: async(idCurrency) => {
        await db.Currencies.destroy({
            where:{id:idCurrency}
            })
    },
    editCurrency: async(idCurrencyExchange,newCurrencyExchange) => {
        await db.Currencies_exchange.update(
            {currency_exchange:newCurrencyExchange},
            {where:{id:idCurrencyExchange}}
    )
    },
    idCurrency: async(currencyName) => {
        const idCurrency = await db.Currencies.findOne({
            where:{currency:currencyName}
        })

        if (idCurrency) {
            return idCurrency.id
        }else{
            return null
        }
    },
    findCurrencyById: async(idCurrency) => {
        const findCurrency = await db.Currencies_exchange.findAll({
            where:{id_currencies:idCurrency}
        })
        return findCurrency
    },
    findCurrency: async(idCurrency,idBrunch) => {
        const findCurrency = await db.Currencies_exchange.findOne({
            where:{id_currencies:idCurrency,id_brunches:idBrunch}
        })
        return findCurrency
    }
}       

module.exports = currenciesQueries