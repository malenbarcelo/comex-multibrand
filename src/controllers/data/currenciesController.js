const currenciesQueries = require('../dbQueries/currenciesQueries')
const brunchesQueries = require('../dbQueries/brunchesQueries')
const costingsChangesQueries = require('../dbQueries/costingsChangesQueries')

const currenciesController = {
  //BACKEND
  currencies: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const brunchData = await brunchesQueries.brunch(idBrunch)
      const changes = await costingsChangesQueries.getData(idBrunch)
      const selectedItem = 'data'

      return res.render('data/currencies/currencies',{title:'Monedas',brunchData,changes,selectedItem})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //APIS
  brunchCurrencies: async(req,res) =>{
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

      const idBrunch =  req.params.idBrunch
      const idUser = req.session.userLogged.id
      const data = req.body

      //create exchange rate
      await currenciesQueries.createExchangeRate(idBrunch,idUser,data.id_currencies,data.currency_exchange)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = currenciesController

