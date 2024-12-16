const suppliersQueries = require("../../dbQueries/suppliersQueries")
const suppliersBrunchesQueries = require("../../dbQueries/suppliersBrunchesQueries")

const suppliersController = {
  allSuppliers: async(req,res) =>{
    try{

      const suppliers = await suppliersQueries.getAllSuppliers()

      res.status(200).json(suppliers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  suppliers: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch

      const suppliers = await suppliersQueries.getData(idBrunch)

      res.status(200).json(suppliers)

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
  edit: async(req,res) =>{
    try{

      const data = req.body

      //edit supplier
      await suppliersQueries.update(data.supplierData, data.supplierId)

      //create suppliers brunches
      const supplierBrunches = req.body.brunches.map(b => ({id_suppliers:data.supplierId,id_brunches:b}))
      await suppliersBrunchesQueries.destroy(data.supplierId)
      await suppliersBrunchesQueries.create(supplierBrunches)

      res.status(200).json()

    }catch(error){
      console.group(error)
      res.status(500).send('Ha ocurrido un error')
    }
  },
  
}
module.exports = suppliersController

