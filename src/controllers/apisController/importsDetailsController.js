const purchaseOrdersDetailsQueries = require("../dbQueries/purchaseOrdersDetailsQueries")

const coeficientFactorsController = {
    update: async(req,res) =>{
        try{

          const data = req.body

          await purchaseOrdersDetailsQueries.update(data.id,data.newData)

          res.status(200).json()

        }catch(error){
          console.group(error)
          return res.send('Ha ocurrido un error')
        }
    },
}
module.exports = coeficientFactorsController

