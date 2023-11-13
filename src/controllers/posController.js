const db = require('../../database/models')
const currenciesQueries = require('./dbQueries/currenciesQueries')
const brunchesQueries = require('./dbQueries/brunchesQueries')
const suppliersQueries = require('./dbQueries/suppliersQueries')

//get DB Data
async function getData(idBrunch){
  const brunches = await brunchesQueries.allData()
  const suppliers = await suppliersQueries.brunchSuppliers(idBrunch)
  const data = {idBrunch,brunches,suppliers}
  return data
}

const posController = {
  createPo: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch

      const data = await getData(idBrunch)
      
      return res.render('purchaseOrders/createPo',{title:'Crear OC',data})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = posController

