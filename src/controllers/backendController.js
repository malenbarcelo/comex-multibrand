const brunchesQueries = require('./dbQueries/brunchesQueries')
const suppliersQueries = require('./dbQueries/suppliersQueries')
const costingsChangesQueries = require('./dbQueries/costingsChangesQueries')
const musQueries = require('./dbQueries/measurementUnitsQueries')
const countriesQueries = require('./dbQueries/countriesQueries')
const currenciesQueries = require('./dbQueries/currenciesQueries')
const purchaseOrdersQueries = require('./dbQueries/purchaseOrdersQueries')

//get DB Data
async function getData(idBrunch){
    const brunchData = await brunchesQueries.brunch(idBrunch)
    const changes = await costingsChangesQueries.getData(idBrunch)
    const suppliers = await suppliersQueries.brunchSuppliers(idBrunch)
    const countries = await countriesQueries.allCountries()
    const currencies = await currenciesQueries.currencies()
    const mus = await musQueries.getData()
    const data = {brunchData,changes,suppliers,mus,countries,currencies}
    return data
  }

const backendController = {
  imports: async(req,res) =>{
    try{

        const idBrunch = req.params.idBrunch
        const data = await getData(idBrunch)
        const imports = await purchaseOrdersQueries.filterLast100(idBrunch)
        const selectedItem = 'imports'
    
        imports.forEach(item => {
            const date = new Date(item.po_date)
            const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            item.dateString = dateString
        })

        return res.render('imports/imports',{title:'Importaciones',data, imports, selectedItem})
    
    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  costings: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)
      const selectedItem = 'costings'

      return res.render('costings/costings',{title:'Costos estimados',data,selectedItem})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  // prices
  salePrices: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)
      const selectedItem = 'salePrices'

      return res.render('salePrices/salePrices',{title:'Listas de precios',data,selectedItem})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //DATA
  pricesLists: async(req,res) =>{
      try{

          const idBrunch = req.params.idBrunch
          const data = await getData(idBrunch)
          const selectedItem = 'data'

          return res.render('data/pricesLists/pricesLists',{title:'Listas de precios', data, selectedItem})

          }catch(error){
              console.log(error)
              return res.send('Ha ocurrido un error')
      }
  },
  volumeFactors: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const selectedItem = 'data'
      const data = await getData(idBrunch)

      return res.render('data/factors/volumeFactors',{title:'Factores por volumen',data,selectedItem})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  coeficientFactors: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const selectedItem = 'data'
      const data = await getData(idBrunch)

      return res.render('data/factors/coeficientFactors',{title:'Factores por coeficiente',data,selectedItem})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  currencies: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const selectedItem = 'data'
      const data = await getData(idBrunch)

      return res.render('data/currencies/currencies',{title:'Monedas',data,selectedItem})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  suppliers: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const selectedItem = 'data'
      const data = await getData(idBrunch)

      return res.render('data/suppliers/suppliers',{title:'Proveedores',data,selectedItem})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  measurementUnits: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const selectedItem = 'data'
      const data = await getData(idBrunch)

      return res.render('data/measurementUnits/measurementUnits',{title:'Unidades de medida',data,selectedItem})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = backendController

