const suppliersBrunchesQueries = require("../../dbQueries/suppliersBrunchesQueries")

const suppliersController = {
  destroy: async(req,res) =>{
    try{

      const data = req.body

      //create supplier
      const newSupplier = await suppliersQueries.create(data.supplierData)

      //create suppliers brunches
      const supplierBrunches = req.body.brunches.map(b => ({id_suppliers:newSupplier.id,id_brunches:b}))
      await suppliersBrunchesQueries.create(supplierBrunches)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  create: async(req,res) =>{
    try{

      const data = req.body

      //create supplier
      const newSupplier = await suppliersQueries.create(data.supplierData)

      //create suppliers brunches
      const supplierBrunches = req.body.brunches.map(b => ({id_suppliers:newSupplier.id,id_brunches:b}))
      await suppliersBrunchesQueries.create(supplierBrunches)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = suppliersController

