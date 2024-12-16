const measurementUnitsQueries = require("../../dbQueries/measurementUnitsQueries")

const easurementUnitsController = {
  measurementUnits: async(req,res) =>{
    try{

      const measurementUnits = await measurementUnitsQueries.getData()

      res.status(200).json(measurementUnits)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = easurementUnitsController

