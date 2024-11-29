const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_suppliers_brunches

const suppliersBrunchesQueries = {
    
    create: async(data) => {
        await model.bulkCreate(data)
    }
}       

module.exports = suppliersBrunchesQueries