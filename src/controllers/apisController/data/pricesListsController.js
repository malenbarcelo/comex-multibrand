const costingChangesQueries = require("../../dbQueries/costingsChangesQueries")
const pricesListsQueries = require("../../dbQueries/pricesListsQueries")
const musQueries = require("../../dbQueries/measurementUnitsQueries")
const readXlsFile = require('read-excel-file/node')
const excelJs = require('exceljs')

const pricesListsController = {
  pricesLists: async(req,res) =>{
    try{

      const idBrunch =  req.params.idBrunch

      const suppliersLastPriceList = await pricesListsQueries.lastListsNumbers(idBrunch)
      const conditions = suppliersLastPriceList.map(cond => ({
        id_suppliers: cond.id_suppliers,
        price_list_number: cond.max_price_list_number
      }))

      const pricesLists = await pricesListsQueries.getData(idBrunch,conditions)

      res.status(200).json(pricesLists)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  addItem: async(req,res) =>{
    try{

      const data =  req.body

      //get supplier last price list number
      const lastListsNumbers = await pricesListsQueries.lastListsNumbers(data.itemData.id_brunches)
      let supplierListNumber = lastListsNumbers.filter( l => l.id_suppliers == data.itemData.id_suppliers)
      supplierListNumber = supplierListNumber.length == 0 ? 1 : supplierListNumber[0].max_price_list_number
      data.itemData.price_list_number = supplierListNumber

      //create item
      await pricesListsQueries.create([data.itemData])
      
      //register changes
      data.changeData.id_users = req.session.userLogged.id
      await costingChangesQueries.create(data.changeData)      

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editItem: async(req,res) =>{
    try{

      const data =  req.body

      console.log(data)

      
      //edit item
      await pricesListsQueries.edit(data.id, data.itemData)
      
      //register changes
      data.changeData.id_users = req.session.userLogged.id
      await costingChangesQueries.create(data.changeData)      

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  readExcelFile: async(req,res) =>{
    try{
        const file = req.file.filename
        const data = await readXlsFile('public/files/pricesLists/' + file)
        return res.status(200).json(data)
    }catch(error){
        console.log(error)
        return res.send('Ha ocurrido un error')
    }
  },
  uploadExcelFile: async(req,res) =>{
    try{
        const data = req.body
        const userId = req.session.userLogged.id
        const mus = await musQueries.getData()
        const lastListsNumbers = await pricesListsQueries.lastListsNumbers(data.brunchId)
        const supplierListNumber = lastListsNumbers.filter(l => l.id_suppliers == data.supplierId)
        const dataToUpload = []

        data.priceList.forEach( p => {
          dataToUpload.push({
            id_brunches: parseInt(data.brunchId), 
            id_suppliers: parseInt(data.supplierId), 
            id_currencies: parseInt(data.currencyId),
            item: p[0],
            description: p[1],
            id_measurement_units: mus.filter( mu => mu.measurement_unit == p[2])[0].id,
            mu_per_box: p[3],
            weight_kg: p[5],
            volume_m3: p[4],
            fob: p[6],
            brand: p[8],
            has_breaks: p[7] == 'no' ? 0 : 1,
            price_list_number:supplierListNumber.length == 0 ? 1 : supplierListNumber[0].max_price_list_number + 1,
            origin: p[9]
          })
        });

        //create price list
        await pricesListsQueries.create(dataToUpload)

        //create changes
        const changes = {
          id_brunches: data.brunchId, 
          type: 'Listas de precios', 
          description: 'Lista nueva: ' + data.supplier,
          id_users: userId,
          updated_costs: 0
        }

        await costingChangesQueries.create(changes)
        
        return res.status(200).json({ message: "Datos creados exitosamente" })

    }catch(error){
        console.log(error)
        res.status(500).json({ error: error.message || "Error al crear los datos" })
    }
  },
  download: async(req,res) =>{
    try{

      const supplierId = req.body.supplierId
      const brunchId =  req.body.brunchId
      const lastListsNumbers = await pricesListsQueries.lastListsNumbers(brunchId)
      
      //get lists
      const pricesList = []      
      for (let i = 0; i < lastListsNumbers.length; i++) {
        const list = await pricesListsQueries.getSupplierList(brunchId,lastListsNumbers[i].id_suppliers,lastListsNumbers[i].max_price_list_number)
        for (let j = 0; j < list.length; j++) {
          pricesList.push(list[j])
        }
      }
     
      const dataToPrint = supplierId == '' ? pricesList : pricesList.filter( p => p.id_suppliers == supplierId)

      //create excel
      const workbook = new excelJs.Workbook()

      const worksheet = workbook.addWorksheet('Precios')
  
      const columns = [
        { header: 'Proveedor', key: 'supplier', width: 15, style: {alignment:{horizontal: 'center'}}},
        { header: 'Item', key: 'item', width: 10, style: {alignment:{horizontal: 'center'}}},
        { header: 'Descripción', key: 'description', width: 60, style: {alignment:{horizontal: 'center'}}  },
        { header: 'UM', key: 'mu', width: 8, style: {alignment:{horizontal: 'center'}} },
        { header: 'UM por caja', key: 'muPerBox', width: 15, style: {alignment:{horizontal: 'center'}} },
        { header: 'Volumen (m3)', key: 'volume', width: 15, style: {alignment:{horizontal: 'center'}} },
        { header: 'Peso (kg)', key: 'weight', width: 10, style: {alignment:{horizontal: 'center'}} },
        { header: 'FOB', key: 'fob', width: 15, style: {alignment:{horizontal: 'center'}} },
        { header: 'Moneda', key: 'currency', width: 15, style: {alignment:{horizontal: 'center'}} },
        { header: 'Roturas', key: 'hasBreaks', width: 10, style: {alignment:{horizontal: 'center'}} },
        { header: 'Marca', key: 'brand', width: 10, style: {alignment:{horizontal: 'center'}} },
        { header: 'Origen', key: 'origin', width: 10, style: {alignment:{horizontal: 'center'}} },
        { header: 'Lista', key: 'listNumber', width: 10, style: {alignment:{horizontal: 'center'}} }

      ]
  
      worksheet.columns = columns

      dataToPrint.forEach(item => {
          const rowData = {
          'supplier': item.supplier_data.supplier,
          'item': item.item,
          'description': item.description,
          'mu': item.mu_data.measurement_unit,
          'muPerBox': parseFloat(item.mu_per_box,2),
          'volume': parseFloat(item.volume_m3,4).toFixed(4),
          'weight': parseFloat(item.weight_kg,4).toFixed(3),
          'fob': parseFloat(item.fob,3).toFixed(3),
          'currency': item.currency_data.currency,
          'hasBreaks': item.has_breaks == 1 ? "si" : 'no',
          'brand': item.brand,
          'origin': item.origin,
          'listNumber': item.price_list_number
        }
        worksheet.addRow(rowData)
      }) 
  
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=Lista de precios.xlsx')
    
      await workbook.xlsx.write(res)
      
      res.end()
  
    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = pricesListsController

