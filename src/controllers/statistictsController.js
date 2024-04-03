const db = require('../../database/models')
const brunchesQueries = require('./dbQueries/brunchesQueries')
const suppliersQueries = require('./dbQueries/suppliersQueries')

//get DB Data
async function getData(idBrunch){
    const brunch = await brunchesQueries.brunch(idBrunch)
    const suppliers = await suppliersQueries.allSuppliers()
    const data = {idBrunch,brunch,suppliers}
    return data
}

const statisticsController = {
    importHistory: async(req,res) => {
        try{

            const idBrunch = req.params.idBrunch
            const data = await getData(idBrunch)

            return res.render('statistics/importHistory',{title:'Historial de importaciones',data})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    pricesAndCosts: async(req,res) => {
        try{

            const idBrunch = req.params.idBrunch
            const data = await getData(idBrunch)

            return res.render('statistics/pricesAndCosts',{title:'Precios y costos',data})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },

}
module.exports = statisticsController

