const suppliersCoeficientFactorsQueries = require("../../dbQueries/suppliersCoeficientFactorsQueries")
const costingsChangesQueries = require("../../dbQueries/costingsChangesQueries")

const coeficientFactorsController = {
  coeficientFactors: async(req,res) =>{
    try{

      const idBrunch =  req.params.idBrunch
      const coeficientFactors = await suppliersCoeficientFactorsQueries.coeficientFactors(idBrunch)

      
      res.status(200).json(coeficientFactors)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  create: async(req,res) =>{
    try{

      const dataToCreate =  req.body.create
      const action =  req.body.action
      dataToCreate.id_users = req.session.userLogged.id
      
      //create factor
      await suppliersCoeficientFactorsQueries.create(dataToCreate)

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
module.exports = coeficientFactorsController

