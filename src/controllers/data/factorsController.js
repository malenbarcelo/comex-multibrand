const brunchesQueries = require('../dbQueries/brunchesQueries')
const suppliersVolumeFactorsQueries = require('../dbQueries/suppliersVolumeFactorsQueries')


const currenciesController = {
  //BACKEND
  volumeFactors: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const brunchData = await brunchesQueries.brunch(idBrunch)

      return res.render('data/factors/volumeFactors',{title:'Factores',brunchData})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //APIS
  suppliersVolumeFactors: async(req,res) =>{
    try{

      const idBrunch =  req.params.idBrunch

      const volumeFactors = await suppliersVolumeFactorsQueries.volumeFactors(idBrunch)

      res.status(200).json(volumeFactors)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = currenciesController

