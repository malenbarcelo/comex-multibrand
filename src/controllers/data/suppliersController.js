const brunchesQueries = require('../dbQueries/brunchesQueries')
const suppliersVolumeFactorsQueries = require('../dbQueries/suppliersVolumeFactorsQueries')
const suppliersQueries = require('../dbQueries/suppliersQueries')


const currenciesController = {
  //BACKEND
  // volumeFactors: async(req,res) =>{
  //   try{

  //     const idBrunch = req.params.idBrunch
  //     const brunchData = await brunchesQueries.brunch(idBrunch)

  //     return res.render('data/factors/volumeFactors',{title:'Factores',brunchData})

  //   }catch(error){
  //     console.log(error)
  //     return res.send('Ha ocurrido un error')
  //   }
  // },
  //APIS
  suppliers: async(req,res) =>{
    try{

      const allSuppliers = await suppliersQueries.allSuppliers()

      res.status(200).json(allSuppliers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = currenciesController

