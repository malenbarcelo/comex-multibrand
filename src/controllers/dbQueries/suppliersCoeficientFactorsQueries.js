const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const model = db.Data_suppliers_coeficient_factors

const suppliersCoeficientFactorsQueries = {
    coeficientFactors: async(idBrunch) => {
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
                        FROM Data_suppliers_coeficient_factors AS subquery
                        WHERE 
                            subquery.id_suppliers = Data_suppliers_coeficient_factors.id_suppliers
                            AND subquery.id_brunches = Data_suppliers_coeficient_factors.id_brunches
                    )`)
                }
            },
            nest: true
        })

        const latestIds = latestEntries.map(entry => entry.id)

        const coeficientFactors = await model.findAll({
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
    
        return coeficientFactors
    },
    create: async(data) => {
        await model.create(data)
    }
}       

module.exports = suppliersCoeficientFactorsQueries