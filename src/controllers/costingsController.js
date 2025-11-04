const brunchesQueries = require('./dbQueries/brunchesQueries')
const costingsChangesQueries = require('./dbQueries/costingsChangesQueries')
const costingsQueries = require('./dbQueries/costingsQueries')
const pricesListsQueries = require('./dbQueries/pricesListsQueries')
const suppliersQueries = require('./dbQueries/suppliersQueries')
const suppliersCoeficientFactorsQueries = require('./dbQueries/suppliersCoeficientFactorsQueries')
const suppliersVolumeFactorsQueries = require('./dbQueries/suppliersVolumeFactorsQueries')
const excelJs = require('exceljs')

const costsController = {
  //BACKEND
  costings: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const brunchData = await brunchesQueries.brunch(idBrunch)
      const changes = await costingsChangesQueries.getData(idBrunch)
      const suppliers = await suppliersQueries.brunchSuppliers(idBrunch)
      const selectedItem = 'costings'

      console.log(suppliers)

      return res.render('costings/costings',{title:'Costos estimados',brunchData,changes,suppliers,selectedItem})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //APIS
  costingsData: async(req,res) =>{
    try{

      const idBrunch =  req.params.idBrunch
      const maxListNumber = await costingsQueries.maxListNumber(idBrunch)
      const costings = await costingsQueries.getData(idBrunch,maxListNumber)

      res.status(200).json(costings)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  changes: async(req,res) =>{
    try{

      const idBrunch =  req.params.idBrunch
      const changes = await costingsChangesQueries.getData(idBrunch)

      res.status(200).json(changes)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  update: async(req,res) =>{
    try{

      const idBrunch =  req.params.idBrunch
      const pricesLists = await pricesListsQueries.allData(idBrunch)
      const uniqueItems = await pricesListsQueries.uniqueItems(idBrunch)
      const lastListsNumbers = await pricesListsQueries.lastListsNumbers(idBrunch)
      const costingsNumber = await costingsQueries.maxListNumber(idBrunch)
      const coeficientFactors = await suppliersCoeficientFactorsQueries.get({filters:{id_brunches: idBrunch,order:[["id","DESC"]]}})
      const volumeFactors = await suppliersVolumeFactorsQueries.get({filters:{id_brunches: idBrunch,order:[["id","DESC"]]}})
      let suppliers = await suppliersQueries.brunchSuppliers(idBrunch)
      suppliers = suppliers.map(s => s.get({ plain: true }))

      const costing = uniqueItems.map(i => {

        const filteredItem = pricesLists.filter(p => p.item === i.item)
        const itemData = filteredItem.length === 0 ? {} : filteredItem[0]
        const supplierLastList = lastListsNumbers.filter( l => l.id_suppliers == itemData.id_suppliers)[0]
        let supplierData = suppliers.filter(s => s.id == itemData.id_suppliers)
        let unitCost

        if (supplierData.length > 0 && supplierData[0].cost_calculation == 'Factor') {
          const coefData = coeficientFactors.filter( cf => cf.id_suppliers == supplierData[0].id)
          if (coefData.length > 0) {
            unitCost = itemData.fob * (1 + parseFloat(coefData[0].factor,2))
          }else{
            unitCost = null
          }
          
        }else if(supplierData.length > 0 && supplierData[0].cost_calculation == 'Volumen'){
          const coefData = volumeFactors.filter( vf => vf.id_suppliers == supplierData[0].id)
          
          if (coefData.length > 0) {
            const volume = coefData[0].volume_mu == 'ft3' ? parseFloat(itemData.volume_m3,2) * 35.3147 : parseFloat(itemData.volume_m3,2)
            const freight = (volume * parseFloat(coefData[0].freight,2)) / parseFloat(itemData.mu_per_box,2)
            const cif = (freight + parseFloat(itemData.fob)) * (1 + parseFloat(coefData[0].insurance,2))
            const importDuty = cif * parseFloat(coefData[0].import_duty,2)
            const volumeExpenses = parseFloat(coefData[0].total_volume_expenses,2) * volume / parseFloat(itemData.mu_per_box,2)
            const priceExpenses = cif * (parseFloat(coefData[0].custom_agent,2) + parseFloat(coefData[0].transference,2))
            
            unitCost = (cif + importDuty + volumeExpenses + priceExpenses) / itemData.mu_data.units_per_um
            
          }else{
            unitCost = null
          }
        }        
        
        return {
          ...i,
          costing_number: costingsNumber + 1 || 1,
          id_brunches: parseInt(idBrunch),
          id_suppliers: itemData.id_suppliers || '',
          description: itemData.description || '',
          id_measurement_units: itemData.id_measurement_units || '',
          mu_per_box: parseFloat(itemData.mu_per_box,2) || 0,
          id_currencies: itemData.id_currencies || '',
          fob: parseFloat(itemData.fob,2) || '',
          unit_cost: unitCost,
          notes: '',
          price_list_number: itemData.price_list_number || '',
          discontinued: itemData.price_list_number == supplierLastList.max_price_list_number ? 0 : 1
        }
      })

      //save data
      await costingsQueries.bulkCreate(costing)

      res.status(200).json({ message: "Datos creados exitosamente" })

    }catch(error){
      console.log(error)
      res.status(500).json({ error: error.message || "Error al crear los datos" })
      
    }
  },
  updateChanges: async(req,res) =>{
    try{

      const idBrunch =  req.params.idBrunch
      await costingsChangesQueries.updateChanges(idBrunch)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  download: async(req,res) =>{
    try{

      const supplierId = req.body.supplierId
      const idBrunch =  req.body.brunchId
      const maxListNumber = await costingsQueries.maxListNumber(idBrunch)
      const costings = await costingsQueries.getData(idBrunch,maxListNumber)
      
      const dataToPrint = supplierId == '' ? costings : costings.filter( c => c.id_suppliers == supplierId)

      const workbook = new excelJs.Workbook()

      const worksheet = workbook.addWorksheet('Costeo')
  
      const columns = [
        { header: 'Proveedor', key: 'supplier', width: 15 },
        { header: 'Item', key: 'item', width: 10, style: {alignment:{horizontal: 'center'}}},
        { header: 'Descripción', key: 'description', width: 60 },
        { header: 'UM', key: 'mu', width: 8, style: {alignment:{horizontal: 'center'}} },
        { header: 'UM por caja', key: 'muPerBox', width: 15, style: {alignment:{horizontal: 'center'}} },
        { header: 'Moneda', key: 'currency', width: 15, style: {alignment:{horizontal: 'center'}} },
        { header: 'FOB', key: 'fob', width: 15, style: {alignment:{horizontal: 'center'}} },
        { header: 'Costo unitario', key: 'unitCost', width: 15, style: {alignment:{horizontal: 'center'}} }
      ]
  
      worksheet.columns = columns

      dataToPrint.forEach(element => {
        const rowData = {
          'supplier': element.supplier_data.supplier,
          'item': element.item,
          'description': element.description,
          'mu': element.mu_data.measurement_unit,
          'muPerBox': element.mu_per_box,
          'currency': element.currency_data.currency,
          'fob': parseFloat(element.fob,3),
          'unitCost': isNaN(parseFloat(element.unit_cost,3)) ? '' : parseFloat(element.unit_cost,3)
        }

        worksheet.addRow(rowData)
        
      }) 
  
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=Costeo.xlsx')
    
      await workbook.xlsx.write(res)
      
      res.end()
  
    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  
}
module.exports = costsController

