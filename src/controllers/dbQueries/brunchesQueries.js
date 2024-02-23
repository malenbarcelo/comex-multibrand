const db = require('../../../database/models')
const sequelize = require('sequelize')

const brunchesQueries = {
    allData: async() => {
        const brunches = await db.Brunches.findAll({
            order:['brunch'],
            raw:true,
        })
        return brunches
    },
    brunch: async(idBrunch) => {
        const brunch = await db.Brunches.findOne({
            where:{id:idBrunch},
            include: [
                {association: 'brunch_currency'}
            ],
            raw:true,
            nest:true
        })
        return brunch
    },
}

module.exports = brunchesQueries