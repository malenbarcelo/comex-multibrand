const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const model = db.Data_suppliers_volume_factors

const suppliersVolumeFactorsQueries = {
    volumeFactors: async(idBrunch) => {
        const latestEntries = await model.findAll({
            include: [
                { 
                    association: 'factor_supplier',
                    include: [{association: 'supplier_currency'}] 
                },
                { association: 'factor_user' }
            ],
            where: {
                id_brunches: idBrunch,
                created_at: {
                    [Op.eq]: sequelize.literal(`(
                        SELECT MAX(created_at)
                        FROM data_suppliers_volume_factors AS subquery
                        WHERE 
                            subquery.id_suppliers = Data_suppliers_volume_factors.id_suppliers
                            AND subquery.id_brunches = Data_suppliers_volume_factors.id_brunches
                    )`)
                }
            },
            nest: true
        })

        const latestIds = latestEntries.map(entry => entry.id)

        const volumeFactors = await model.findAll({
            where: { id: latestIds },
            include: [
                { 
                    association: 'factor_supplier',
                    include: [{association: 'supplier_currency'}]
                },
                { association: 'factor_user' }
            ],
            order: [['factor_supplier', 'supplier', 'ASC']],
            nest: true
        })
    
        return volumeFactors
    },
    create: async(data) => {
        await model.create(data)
    },
    get: async({ filters }) => {
    
            // order
            let order = ''
            if (filters.order) {
                order = filters.order
            }
    
            //where
            const where = {}
    
            if (filters.id_brunches) {
                where.id_brunches = filters.id_brunches
            }
    
            if (filters.id_suppliers) {
                where.id_suppliers = filters.id_suppliers
            }
    
            const data = await model.findAll({
                order,
                where,
                raw: true
            })
    
            return data
        },
}       

module.exports = suppliersVolumeFactorsQueries