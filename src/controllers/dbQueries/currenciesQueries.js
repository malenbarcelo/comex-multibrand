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
        const currencies = await db.Currencies.findAll({
            include: [
                {
                    association: 'currency_exchange',
                    where:{
                        id_brunches: idBrunch
                    },
                }
            ],
            order:[['currency','ASC']],
            nest:true,
        })

        currencies.forEach(currency => {
            currency.currency_exchange.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        })

        return currencies
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
    createExchangeRate: async(idBrunch,idUser,idCurrency,exchange) => {
        await db.Currencies_exchange.create({
            id_brunches:idBrunch,
            id_currencies: idCurrency,
            currency_exchange:exchange,
            id_users: idUser
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
    idCurrencyExchange: async(idCurrency, idBrunch) => {
        const idCurrencyExchange = await db.Currencies_exchange.findOne({
            where:{
                id_currencies:idCurrency,
                id_brunches: idBrunch
            }
        })

        if (idCurrencyExchange) {
            return idCurrencyExchange.id
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
    },
    
}       

module.exports = currenciesQueries