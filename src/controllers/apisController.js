const db = require('../../database/models')
const sequelize = require('sequelize')
const pricesListsQueries = require('./dbQueries/pricesListsQueries')
const currenciesQueries = require('./dbQueries/currenciesQueries')
const measurementUnitsQueries = require('./dbQueries/measurementUnitsQueries')
const suppliersQueries = require('./dbQueries/suppliersQueries')
const purchaseOrdersQueries = require('./dbQueries/purchaseOrdersQueries')
const brunchesQueries = require('./dbQueries/brunchesQueries')
const usersQueries = require('./dbQueries/usersQueries')
const bcrypt = require('bcryptjs')

const apisController = {
  brunchCurrencies: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch

      const brunchCurrencies = await currenciesQueries.brunchCurrencies(idBrunch)

      res.status(200).json(brunchCurrencies)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createPo: async(req,res) =>{
    try{

      const data = req.body

      //get idPO if exists
      const getPo = await purchaseOrdersQueries.filterPo(data.purchaseOrder)

      //delete PO if exists
      if (getPo != null) {
        const idPo = getPo.id
        await purchaseOrdersQueries.deletePoDetails(idPo)
        await purchaseOrdersQueries.deletePo(idPo)
      }

      //create PO
      await purchaseOrdersQueries.createPo(data)

      //get PO id
      const idPo = await purchaseOrdersQueries.lastIdPo(data.idBrunch)

      //create PO Details
      await purchaseOrdersQueries.createPoDetails(data,idPo)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  deleteCurrency: async(req,res) =>{
    try{

      const idCurrencyExchange = req.params.idCurrencyExchange

      //get currency
      const currencyExchangeData = await currenciesQueries.currencyExchangeData(idCurrencyExchange)

      //find currency in other brunches
      const idCurrency = currencyExchangeData.id_currencies
      const findCurrency = await currenciesQueries.findCurrencyById(idCurrency)

      //delete currency from Currency_exchanges
      await currenciesQueries.deleteCurrencyExchange(idCurrencyExchange)

      //delete currency from Currencies if correponds
      if (findCurrency.length == 1) {
        await currenciesQueries.deleteCurrency(idCurrency)
      }

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  deleteItem: async(req,res) =>{
    try{

      const idItem = req.params.idItem

      //delete item
      await pricesListsQueries.deleteItem(idItem)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  measurementUnits: async(req,res) =>{
    try{

      const measurementUnits = await measurementUnitsQueries.allMU()

      res.status(200).json(measurementUnits)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  filterBrunch: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const brunch = await brunchesQueries.brunch(idBrunch)

      res.status(200).json(brunch)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  filterPurchaseOrder: async(req,res) =>{
    try{

      const purchaseOrder = req.params.purchaseOrder
      const po = await purchaseOrdersQueries.filterPo(purchaseOrder)

      res.status(200).json(po)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  filterSupplier: async(req,res) =>{
    try{

      const idSupplier = req.params.idSupplier
      const supplier = await suppliersQueries.filterSupplier(idSupplier)

      res.status(200).json(supplier)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  priceList: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idSupplier = req.params.idSupplier

      const supplierPriceList = await pricesListsQueries.supplierPriceList(idBrunch,idSupplier)

      res.status(200).json(supplierPriceList)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  purchaseOrders: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch

      const brunchPos = await purchaseOrdersQueries.brunchPos(idBrunch)

      res.status(200).json(brunchPos)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  suppliers: async(req,res) =>{
    try{

      const suppliers = await suppliersQueries.allSuppliers()

      res.status(200).json(suppliers)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  users: async(req,res) =>{
    try{

      const users = await usersQueries.allUsers()

      users.forEach(user => {
        delete user.password
      })

      res.status(200).json(users)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  purchaseOrderDetails: async(req,res) =>{
    try{

      const purchaseOrder = req.params.purchaseOrder

      const poData = await purchaseOrdersQueries.filterPo(purchaseOrder)

      const poDetails = await purchaseOrdersQueries.getPoDetails(poData.id)

      res.status(200).json(poDetails)

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  restorePassword: async(req,res) =>{
    try{

      const idUser = req.params.idUser

      const userToLogin = await usersQueries.findUserById(idUser)

      const newPassword = bcrypt.hashSync(userToLogin.user_name,10)

      await usersQueries.changePassword(userToLogin.user_name,newPassword)

      res.status(200).json()

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  }
}
module.exports = apisController

