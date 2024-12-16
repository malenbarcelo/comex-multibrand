const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Purchase_orders_details

const purchaseOrdersDetailsQueries = {
    update: async(id,data) => {
        await model.update(
            data,
            {where:{id:id}})
    },
    updateEstimatedCosts: async(data) => {
        for (let i = 0; i < data.length; i++) {
            await model.update(
                {
                    estimated_cost_supplier_currency: data[i].estimated_cost_supplier_currency
                },
                {
                    where:{
                        id: data[i].id
                    }
                }
            )
        }
    },
}       

module.exports = purchaseOrdersDetailsQueries