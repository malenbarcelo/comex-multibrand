const db = require('../../../database/models')
const model = db.Costings_changes

const costingChangesQueries = {
    getData: async(idBrunch) => {
        const data = await model.findAll({
            where:{
                id_brunches:idBrunch,
                updated_costs: 0
            },
            include: [
                {association: 'user_data'}
            ],
            raw:true,
            nest:true
        })
        return data
    },
    create: async (data) => {
        await model.create(data)
    },
    updateChanges: async (idBrunch) => {
        await model.update(
            {
                updated_costs: 1
            },
            {
                where: { id_brunches: idBrunch }
            }
        );
    },
}

module.exports = costingChangesQueries