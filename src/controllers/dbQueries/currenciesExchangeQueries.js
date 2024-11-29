const db = require('../../../database/models')
const model = db.Data_currencies_exchange

const currenciesExchangeQueries = {
    create: async(data) => {
        await model.bulkCreate(data)
    },
}       

module.exports = currenciesExchangeQueries