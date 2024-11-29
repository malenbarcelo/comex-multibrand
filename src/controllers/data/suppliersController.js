const brunchesQueries = require('../dbQueries/brunchesQueries')
const suppliersQueries = require('../dbQueries/suppliersQueries')
const suppliersBrunchesQueries = require('../dbQueries/suppliersBrunchesQueries')
const countriesQueries = require('../dbQueries/countriesQueries')
const currenciesQueries = require('../dbQueries/currenciesQueries')
const costingsChangesQueries = require('../dbQueries/costingsChangesQueries')

const currenciesController = {
  //BACKEND
  suppliers: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const brunchData = await brunchesQueries.brunch(idBrunch)
      const countries = await countriesQueries.allCountries()
      const currencies = await currenciesQueries.currencies()
      const changes = await costingsChangesQueries.getData(idBrunch)
      const selectedItem = 'data'

      return res.render('data/suppliers/suppliers',{title:'Proveedores',brunchData,countries,currencies,selectedItem,changes})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //APIS
  allSuppliers: async(req,res) =>{
    try{

      const allSuppliers = await suppliersQueries.allSuppliers()

      res.status(200).json(allSuppliers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  brunchSuppliers: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch

      const allSuppliers = await suppliersQueries.brunchSuppliers(idBrunch)

      res.status(200).json(allSuppliers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  
}
module.exports = currenciesController

