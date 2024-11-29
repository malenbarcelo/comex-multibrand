const currenciesQueries = require("../../dbQueries/currenciesQueries")
const currenciesExchangeQueries = require("../../dbQueries/currenciesExchangeQueries")
const costingsChangesQueries = require("../../dbQueries/costingsChangesQueries")

const currenciesController = {
  currencies: async(req,res) =>{
    try{

      const idBrunch =  req.params.idBrunch

      const currencies = await currenciesQueries.brunchCurrencies(idBrunch)

      res.status(200).json(currencies)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createExchangeRate: async(req,res) =>{
    try{

      const data = req.body
      data.id_users = req.session.userLogged.id
      let currencies = await currenciesQueries.brunchCurrencies(data.id_brunches)
      currencies = currencies.map(c => c.get({ plain: true }))
      const currencyData = currencies.filter(c => c.id == data.id_currencies)
      const currency = currencyData[0].currency
      const oldData = currencyData[0].currency_exchange[0].currency_exchange
      const newData = data.currency_exchange
      
      //create exchange rate
      await currenciesExchangeQueries.create([data])

      // create changes
      const changes = {
        id_brunches: data.id_brunches, 
        type: 'Tasa de cambio', 
        description: currency + ': ' + parseFloat(oldData,2).toFixed(2) + ' a ' + parseFloat(newData,2).toFixed(2),
        id_users: req.session.userLogged.id,
        updated_costs: 0
      }

      await costingsChangesQueries.create(changes)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = currenciesController

