const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_currencies

const currenciesQueries = {
    currencies: async() => {
        const currencies = await model.findAll({
            raw:true,
            order:[['currency','ASC']]
        })
        return currencies
    },
    brunchCurrencies: async(idBrunch) => {
        const currencies = await model.findAll({
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
            currency.currency_exchange.sort((a, b) => b.id - a.id);
        })

        return currencies
    },
    createCurrency: async(currencyName) => {
        const currency = await model.findOne({
            where:{currency:currencyName}
        })

        if (!currency) {
            await model.create({
                currency:currencyName
            })
        }
    },
    createExchangeRate: async(idBrunch,idUser,idCurrency,exchange) => {
        await db.Data_currencies_exchange.create({
            id_brunches:idBrunch,
            id_currencies: idCurrency,
            currency_exchange:exchange,
            id_users: idUser
        })
    },
    currencyExchangeData: async(idCurrencyExchange) => {
        const currencyExchangeData = await model_exchange.findOne({
            where:{id:idCurrencyExchange},
            include: [{association: 'currency_exchange_currency'}],
            raw:true,
            nest:true
        })
        return currencyExchangeData
    },
    deleteCurrencyExchange: async(idCurrencyExchange) => {
        await model_exchange.destroy({
            where:{id:idCurrencyExchange}
            })
    },
    deleteCurrency: async(idCurrency) => {
        await model.destroy({
            where:{id:idCurrency}
            })
    },
    editCurrency: async(idCurrencyExchange,newCurrencyExchange) => {
        await model_exchange.update(
            {currency_exchange:newCurrencyExchange},
            {where:{id:idCurrencyExchange}}
    )
    },
    idCurrency: async(currencyName) => {
        const idCurrency = await model.findOne({
            where:{currency:currencyName}
        })

        if (idCurrency) {
            return idCurrency.id
        }else{
            return null
        }
    },
    idCurrencyExchange: async(idCurrency, idBrunch) => {
        const idCurrencyExchange = await model_exchange.findOne({
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
        const findCurrency = await model_exchange.findAll({
            where:{id_currencies:idCurrency}
        })
        return findCurrency
    },
    findCurrency: async(idCurrency,idBrunch) => {
        const findCurrency = await model_exchange.findOne({
            where:{id_currencies:idCurrency,id_brunches:idBrunch}
        })
        return findCurrency
    },
    
}       

module.exports = currenciesQueries