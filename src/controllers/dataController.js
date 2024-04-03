const db = require('../../database/models')
const sequelize = require('sequelize')
const currenciesQueries = require('./dbQueries/currenciesQueries')
const brunchesQueries = require('./dbQueries/brunchesQueries')
const countriesQueries = require('./dbQueries/countriesQueries')
const suppliersQueries = require('./dbQueries/suppliersQueries')
const pricesListsQueries = require('./dbQueries/pricesListsQueries')
const measurementUnitsQueries = require('./dbQueries/measurementUnitsQueries')
const {validationResult} = require('express-validator')
const purchaseOrdersQueries = require('./dbQueries/purchaseOrdersQueries')
const excelJs = require('exceljs')
const readXlsFile = require('read-excel-file/node')
const fs = require('fs')

//get DB Data
async function getData(idBrunch){
  const brunchCurrencies = await currenciesQueries.brunchCurrencies(idBrunch)
  const countries = await countriesQueries.allCountries()
  const brunches = await brunchesQueries.allData()
  const suppliers = await suppliersQueries.allSuppliers()
  const brunch = await brunchesQueries.brunch(idBrunch)
  const mu = await measurementUnitsQueries.allMU()
  const data = {idBrunch,brunches,brunch,brunchCurrencies,countries,suppliers,mu}
  return data
}

const dataController = {
  currencies: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)

      return res.render('data/currencies/currencies',{title:'Monedas',data})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createEditCurrencyProcess: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch      
      const currencyName = req.body.currencyName
      const newCurrency =  parseFloat(req.body.currencyExchange)

      ///Table currencies
      //find currencyId
      let idCurrency = await currenciesQueries.idCurrency(currencyName)

      //create currency if it doesn´t exist
      await currenciesQueries.createCurrency(currencyName)
      idCurrency = await currenciesQueries.idCurrency(currencyName)

      ///Table currencies_exchange
      //find currencyExchangeId
      const currencyExchangeId = await currenciesQueries.idCurrencyExchange(idCurrency, idBrunch)

      //create currency exchange or edit currency exchange
      if (currencyExchangeId == null) { //create currency exchange
        await currenciesQueries.createCurrencyExchange(idBrunch,idCurrency,newCurrency)        
      }else{ // update currency exchange
        await currenciesQueries.editCurrency(currencyExchangeId,newCurrency)
      }

      data = await getData(idBrunch)
      
      return res.render('data/currencies/currencies',{title:'Monedas',data})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  measurementUnits: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      
      const data = await getData(idBrunch)

      return res.render('data/measurementUnits/measurementUnits',{title:'Unidades de medida',data})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createMUProcess: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const mu = req.body.measurementUnit
      const unitsPerMU = req.body.unitsPerMU

      //create measurement unit
      await measurementUnitsQueries.createMU(mu,unitsPerMU)

      const data = await getData(idBrunch)
      
      return res.render('data/measurementUnits/measurementUnits',{title:'Unidades de medida',data})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  pricesLists: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)
      const supplierId = req.params.idSupplier

      return res.render('data/pricesLists/pricesLists',{title:'Listas de precios',data,supplierId})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createEditItemProcess: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch      
      const data = await getData(idBrunch)
      const date = new Date()
      const itemData = req.body

      const supplier = data.suppliers.filter(supplier => supplier.supplier == itemData.supplierName)[0]
      const supplierId = supplier.id
      const supplierPriceList = await pricesListsQueries.supplierPriceList(idBrunch,supplierId)
      const priceListNumber = supplierPriceList[0].price_list_number

      const findItem = supplierPriceList.filter(item => item.item == itemData.item)

      if (findItem.length == 0) {
        //create item
        await pricesListsQueries.createItem(idBrunch,itemData,supplier,date,priceListNumber)  
      }else{
        //edit item
        const itemId = findItem[0].id
        await pricesListsQueries.editItem(idBrunch,itemData,date,itemId)
      }

      return res.render('data/pricesLists/pricesLists',{title:'Listas de precios',data,supplierId})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  deleteItem: async(req,res) =>{
    try{

      const idItem = req.params.idItem
      const idBrunch = req.params.idBrunch
      const supplierId = req.params.idSupplier

      const data = await getData(idBrunch)

      //delete item
      await pricesListsQueries.deleteItem(idItem)

      return res.render('data/pricesLists/pricesLists',{title:'Listas de precios',data,supplierId})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },















  countries: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      
      const data = await getData(idBrunch)

      return res.render('data/countries/countries',{title:'Países',data})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createCountry: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)
      return res.render('data/countries/createCountry',{title:'Crear País',data})
    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createCountryProcess: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      var data = await getData(idBrunch)

      const resultValidation = validationResult(req)

      if (resultValidation.errors.length > 0){
          return res.render('data/countries/createCountry',{
              errors:resultValidation.mapped(),
              oldData: req.body,
              title:'Crear país',
              data
          })
      }

      //create currency if it doesn´t exist
      await countriesQueries.createCountry(req.body.countryName)

      const successMessage = 'createCountry'

      data = await getData(idBrunch)
      
      return res.render('data/countries/countries',{title:'Países',data,successMessage})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createCurrency: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)
      return res.render('data/currencies/createCurrency',{title:'Crear Moneda',data})
    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createCurrencyProcess: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch

      var data = await getData(idBrunch)

      const resultValidation = validationResult(req)

      if (resultValidation.errors.length > 0){
          return res.render('data/currencies/createCurrency',{
              errors:resultValidation.mapped(),
              oldData: req.body,
              title:'crear Moneda',
              data
          })
      }

      //create currency if it doesn´t exist
      await currenciesQueries.createCurrency(req.body.currencyName)

      //find currency id
      const idCurrency = await currenciesQueries.idCurrency(req.body.currencyName)

      //create currency exchange
      await currenciesQueries.createCurrencyExchange(parseInt(idBrunch),idCurrency,parseFloat(req.body.currencyExchange))

      const successMessage = 'createCurrency'

      data = await getData(idBrunch)
      
      return res.render('data/currencies/currencies',{title:'Monedas',data,successMessage})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createItem: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idSupplier = req.params.idSupplier      
      const data = await getData(idBrunch)
            
      const supplier = data.suppliers.filter(supplier => supplier.id == idSupplier)[0]

      return res.render('data/pricesLists/createItem',{title:'Crear Item',data,supplier})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createItemProcess: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch      
      const data = await getData(idBrunch)
      const date = new Date()
      const itemData = req.body
      const supplier = data.suppliers.filter(supplier => supplier.supplier == itemData.supplier)[0]
      const supplierId = supplier.id
      let priceListNumber = 1

      const resultValidation = validationResult(req)

      if (resultValidation.errors.length > 0){
          return res.render('data/pricesLists/createItem',{
              errors:resultValidation.mapped(),
              oldData: req.body,
              title:'crear Item',
              data,
              supplier
          })
      }

      const supplierPriceList = await pricesListsQueries.supplierPriceList(idBrunch,supplierId)

      supplierPriceList.forEach(item => {
        if (item.price_list_number > priceListNumber) {
          priceListNumber = item.price_list_number
        }
      })

      await pricesListsQueries.createItem(idBrunch,itemData,supplier,date,priceListNumber)

      const successMessage = 'createItem'

      return res.render('data/pricesLists/pricesLists',{title:'Listas de precios',data,supplierId,successMessage})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createMU: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)
      return res.render('data/measurementUnits/createMU',{title:'Crear UM',data})
    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  
  createSupplier: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)
      return res.render('data/suppliers/createSupplier',{title:'Crear Proveedor',data})
    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createSupplierProcess: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const idCurrency = req.body.selectCurrency
      const idCountry = req.body.selectCountry
      const supplierName = req.body.supplierName
      const supplierBusinessName = req.body.supplierBusinessName
      const supplierAddress = req.body.supplierAddress

      //create supplier
      await suppliersQueries.createSupplier(idCurrency,idCountry,supplierName,supplierBusinessName,supplierAddress)

      const successMessage = 'createSupplier'

      const data = await getData(idBrunch)
      
      return res.render('data/suppliers/suppliers',{title:'Proveedores',data,successMessage})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  
  
  editCountry: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idCountry = req.params.idCountry

      //get countryName
      const countryName = await countriesQueries.countryName(idCountry)

      const data = await getData(idBrunch)

      return res.render('data/countries/editCountry',{title:'Editar País',data,countryName})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editCountryProcess: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idCountry = req.params.idCountry
      
      var data = await getData(idBrunch)

      //get countryName
      const countryName = await countriesQueries.countryName(idCountry)

      const resultValidation = validationResult(req)

      if (resultValidation.errors.length > 0){
          return res.render('data/countries/editCountry',{
              errors:resultValidation.mapped(),
              oldData: req.body,
              title:'Editar país',
              data,
              countryName
          })
      }
      
      //edit country
      await countriesQueries.editCountry(idCountry,req.body.countryName)

      data = await getData(idBrunch)

      const successMessage = 'editCountry'

      return res.render('data/countries/countries',{title:'Países',data,successMessage})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editCurrency: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idCurrencyExchange = req.params.idCurrencyExchange

      //get currency exchange
      const currencyExchangeData = await currenciesQueries.currencyExchangeData(idCurrencyExchange)

      const data = await getData(idBrunch)

      return res.render('data/currencies/editCurrency',{title:'Editar Moneda',data,currencyExchangeData})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editItem: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idItem = req.params.idItem
      
      //get item
      const item = await pricesListsQueries.filterItem(idItem)

      const data = await getData(idBrunch)

      return res.render('data/pricesLists/editItem',{title:'Editar Item',data,item})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editItemProcess: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)
      const idItem = req.params.idItem
      const supplierId = data.suppliers.filter(supplier => supplier.supplier == req.body.supplier)[0].id
      const description = req.body.description
      const fob = parseFloat(req.body.fob,4)
      const muPerBox = parseFloat(req.body.muPerBox,2)
      const weight = parseFloat(req.body.weight,4)
      const volume = parseFloat(req.body.volume,4)
      const brand = req.body.brand
      const origin = req.body.origin
      const costCalculation = req.body.selectCostCalc
      const idMu = parseInt(req.body.selectMU)
      const hasBreaks = req.body.hasBreaks

      //edit item
      await pricesListsQueries.editItem(idItem,description,fob,idMu,muPerBox,weight,volume,brand,origin,costCalculation,hasBreaks)
      
      const successMessage = 'editItem'

      return res.render('data/pricesLists/pricesLists',{title:'Listas de precios',data,successMessage,supplierId})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editMU: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idMU = req.params.idMU

      const muData = await measurementUnitsQueries.filterMU(idMU)

      const data = await getData(idBrunch)

      return res.render('data/measurementUnits/editMU',{title:'Editar UM',data,muData})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editMUProcess: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idMU = req.params.idMU

      //edit measurement unit
      await measurementUnitsQueries.editMU(idMU,req.body.unitsPerUM)

      const data = await getData(idBrunch)

      const successMessage = 'editMU'

      return res.render('data/measurementUnits/measurementUnits',{title:'Unidades de medida',data,successMessage})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editSupplier: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idSupplier = req.params.idSupplier

      //get supplier
      const supplier = await suppliersQueries.filterSupplier(idSupplier)

      const data = await getData(idBrunch)

      return res.render('data/suppliers/editSupplier',{title:'Editar Proveedor',data,supplier})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editSupplierProcess: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idSupplier = req.params.idSupplier
      const idCurrency = req.body.selectCurrency
      const idCountry = req.body.selectCountry
      const supplierName = req.body.supplierName
      const supplierBusinessName = req.body.supplierBusinessName
      const supplierAddress = req.body.supplierAddress

      //edit supplier
      await suppliersQueries.editSupplier(idSupplier, idCurrency,idCountry,supplierName,supplierBusinessName,supplierAddress)

      const data = await getData(idBrunch)

      const successMessage = 'editSupplier'

      return res.render('data/suppliers/suppliers',{title:'Proveedores',data,successMessage})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editCurrencyProcess: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idCurrencyExchange = req.params.idCurrencyExchange

      //get currency exchange
      const currencyExchangeData = await currenciesQueries.currencyExchangeData(idCurrencyExchange)

      var data = await getData(idBrunch)

      const resultValidation = validationResult(req)

      if (resultValidation.errors.length > 0){
          return res.render('data/currencies/editCurrency',{
              errors:resultValidation.mapped(),
              oldData: req.body,
              title:'Editar Moneda',
              data,
              currencyExchangeData
          })
      }
      
      const newCurrencyExchange = req.body.currencyExchange

      //edit currency
      await currenciesQueries.editCurrency(idCurrencyExchange,newCurrencyExchange)

      data = await getData(idBrunch)

      const successMessage = 'editCurrency'

      return res.render('data/currencies/currencies',{title:'Monedas',data,successMessage})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  
  
  suppliers: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)

      return res.render('data/suppliers/suppliers',{title:'Proveedores',data})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  downloadPriceList: async(req,res) =>{
    try{
  
      const idBrunch = req.params.idBrunch
      const idSupplier = req.params.idSupplier
  
      const supplierPriceList = await pricesListsQueries.supplierPriceList(idBrunch,idSupplier)
      const supplier = await suppliersQueries.filterSupplier(idSupplier)

      const currency = supplier.supplier_currency.currency

      const workbook = new excelJs.Workbook()

      const worksheet = workbook.addWorksheet(supplier.supplier)
  
      const columns = [
        { header: 'Item', key: 'item', width: 10, style: {alignment:{horizontal: 'center'}}},
        { header: 'Descripción', key: 'description', width: 60 },
        { header: 'UM', key: 'mu', width: 8, style: {alignment:{horizontal: 'center'}} },
        { header: 'UM por caja', key: 'muPerBox', width: 15, style: {alignment:{horizontal: 'center'}} },
        { header: 'Volumen (m3)', key: 'volume', width: 15, style: {alignment:{horizontal: 'center'}} },
        { header: 'Peso (kg)', key: 'weight', width: 10, style: {alignment:{horizontal: 'center'}} },
        { header: 'Precio por UM (' + currency + ')', key: 'price', width: 15, style: {alignment:{horizontal: 'center'}} },
        { header: 'Roturas', key: 'hasBreaks', width: 10, style: {alignment:{horizontal: 'center'}} },
        { header: 'Marca', key: 'brand', width: 10, style: {alignment:{horizontal: 'center'}} },
        { header: 'Origen', key: 'origin', width: 10, style: {alignment:{horizontal: 'center'}} }
      ]
  
      worksheet.columns = columns

      supplierPriceList.forEach(item => {
        const rowData = {
          'item': item.item,
          'description': item.description,
          'mu': item.price_list_mu.measurement_unit,
          'muPerBox': parseFloat(item.mu_per_box,2),
          'volume': parseFloat(item.volume_m3,4),
          'weight': parseFloat(item.weight_kg,4),
          'price': parseFloat(item.fob,4),
          'hasBreaks': item.has_breaks == 1 ? "si" : 'no',
          'brand': item.brand,
          'origin': item.origin

        }

        worksheet.addRow(rowData)
        
      }) 
  
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=Lista de precios - ' + supplier.supplier + '.xlsx')
    
      await workbook.xlsx.write(res)
      
      res.end()
  
    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  uploadPriceList: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const supplierId = req.params.idSupplier
      const supplier = await suppliersQueries.filterSupplier(supplierId)
      const data = await getData(idBrunch)
      const date = new Date()
      let priceListNumber = 0

      const supplierPriceList = await pricesListsQueries.supplierPriceList(idBrunch,supplierId)

      supplierPriceList.forEach(element => {
        if (element.price_list_number > priceListNumber){
          priceListNumber = element.price_list_number
        }
      })

      priceListNumber +=1

      const resultValidation = validationResult(req)

      if (resultValidation.errors.length > 0){

        const uploadFormVisible = true

        return res.render('data/pricesLists/pricesLists',{
          title:'Listas de precios',
          data,
          supplierId,
          errors:resultValidation.mapped(),
          uploadFormVisible,
          supplier
        })
      }      

      const file = req.file.filename

      const priceList = await readXlsFile('public/images/' + file)

      //create price list
      for (let i = 1; i < priceList.length; i++) {
        
        const measurementUnit = data.mu.filter(item => item.measurement_unit == priceList[i][2] )
        
        let itemData = {}
        itemData.item = priceList[i][0]
        itemData.description = priceList[i][1]
        itemData.fob = priceList[i][6]
        itemData.selectMU = measurementUnit[0].id
        itemData.muPerBox = priceList[i][3]
        itemData.brand = priceList[i][8]
        itemData.origin = priceList[i][9]
        itemData.weight = priceList[i][5]
        itemData.volume = priceList[i][4]
        itemData.hasBreaks = priceList[i][7] == 'si' ? 1: 0

        await pricesListsQueries.createItem(idBrunch,itemData,supplier,date,priceListNumber)

      }

      //Delete file
      var filePath = 'public/images/' + file 
      fs.unlinkSync(filePath)

      return res.render('data/pricesLists/pricesLists',{title:'Listas de precios',data,supplierId})

    }catch(error){
      console.log(error)
        return res.send('Ha ocurrido un error')
    }

  }
}
module.exports = dataController

