const db = require('../../../database/models')
const model = db.Costings

const costingQueries = {
    maxListNumber: async(idBrunch) => {
        const maxListNumber = await model.max('costing_number', {
            where:{id_brunches:idBrunch}
        })
        return maxListNumber
    },
    getData: async(idBrunch,maxListNumber) => {
        const data = await model.findAll({
            where:{
                id_brunches:idBrunch,
                costing_number:maxListNumber
            },
            include: [
                {association: 'supplier_data'},
                {association: 'mu_data'},
                {association: 'currency_data'}
            ],
            order:[['id_suppliers','ASC'],['item','ASC']],
            raw:true,
            nest:true
        })
        return data
    },
    bulkCreate: async(data) => {
        await model.bulkCreate(data)
    },
    filter: async(idBrunch,idSupplier,items) => {
        const data = await model.findAll({
            where:{                
                item:items,
                id_brunches: idBrunch,
                id_suppliers: idSupplier
            },
            order:[['id','DESC']],
            raw:true
        })
        return data
    },
}

module.exports = costingQueries