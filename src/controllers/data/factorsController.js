const brunchesQueries = require('../dbQueries/brunchesQueries')
const suppliersVolumeFactorsQueries = require('../dbQueries/suppliersVolumeFactorsQueries')
const suppliersCoeficientFactorsQueries = require('../dbQueries/suppliersCoeficientFactorsQueries')
const costingsChangesQueries = require('../dbQueries/costingsChangesQueries')

const currenciesController = {
  //BACKEND
  volumeFactors: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const brunchData = await brunchesQueries.brunch(idBrunch)
      const changes = await costingsChangesQueries.getData(idBrunch)
      const selectedItem = 'data'

      return res.render('data/factors/volumeFactors',{title:'Factores por volumen',brunchData,changes,selectedItem})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  coeficientFactors: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const brunchData = await brunchesQueries.brunch(idBrunch)
      const changes = await costingsChangesQueries.getData(idBrunch)
      const selectedItem = 'data'

      return res.render('data/factors/coeficientFactors',{title:'Factores por coeficiente',changes,brunchData,selectedItem})

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
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  suppliersCoeficientFactors: async(req,res) =>{
    try{

      const idBrunch =  req.params.idBrunch

      const coeficientFactors = await suppliersCoeficientFactorsQueries.coeficientFactors(idBrunch)

      res.status(200).json(coeficientFactors)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createVolumeFactor: async(req,res) =>{
    try{

      const data =  req.body
      data.id_users = req.session.userLogged.id

      //create data
      await suppliersVolumeFactorsQueries.create(data)

      res.status(200).json()

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createCoeficientFactor: async(req,res) =>{
    try{

      const data =  req.body
      data.id_users = req.session.userLogged.id

      console.log(data)

      //create data
      await suppliersCoeficientFactorsQueries.create(data)

      res.status(200).json()

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  }
}
module.exports = currenciesController

