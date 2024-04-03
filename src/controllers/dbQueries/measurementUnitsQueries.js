const db = require('../../../database/models')
const sequelize = require('sequelize')

const measurementQueries = {
    allMU: async() => {
        const allMU = await db.Measurement_units.findAll({
            order:['measurement_unit'],
            raw:true
        })
        return allMU
    },
    filterMU: async(idMU) => {
        const muData = await db.Measurement_units.findOne({
            order:['measurement_unit'],
            where:{id:idMU},
            raw:true,
        })
        return muData
    },
    editMU: async(idMU,unitsPerMU) => {
        await db.Measurement_units.update(
            {
            units_per_um:unitsPerMU
            },
            {where:{id:idMU}}
    )},
    createMU: async(mu,unitsunitsPerMU) => {
        await db.Measurement_units.create({
            measurement_unit:mu,
            units_per_um:unitsunitsPerMU
        })
    }
}       

module.exports = measurementQueries