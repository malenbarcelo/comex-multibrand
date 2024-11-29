const suppliersVolumeFactorsQueries = require("../../dbQueries/suppliersVolumeFactorsQueries")
const costingsChangesQueries = require("../../dbQueries/costingsChangesQueries")

const volumeFactorsController = {
  volumeFactors: async(req,res) =>{
    try{

      const idBrunch =  req.params.idBrunch
      const volumeFactors = await suppliersVolumeFactorsQueries.volumeFactors(idBrunch)

      res.status(200).json(volumeFactors)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  create: async(req,res) =>{
    try{

      const dataToCreate =  req.body.dataToCreate
      const action =  req.body.action
      dataToCreate.id_users = req.session.userLogged.id

      //create data
      await suppliersVolumeFactorsQueries.create(dataToCreate)

      //create changes
      const description = action == 'create' ? 'Nuevo factor: ' : 'Edición de factor: '
      const changes = {
        id_brunches: dataToCreate.id_brunches, 
        type: 'Factores', 
        description: description + dataToCreate.supplier,
        id_users: req.session.userLogged.id,
        updated_costs: 0
      }

      await costingsChangesQueries.create(changes)

      res.status(200).json()

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = volumeFactorsController

