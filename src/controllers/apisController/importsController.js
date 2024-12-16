const purchaseOrdersQueries = require("../dbQueries/purchaseOrdersQueries")
const purchaseOrdersDetailsQueries = require("../dbQueries/purchaseOrdersDetailsQueries")
const costingsQueries = require("../dbQueries/costingsQueries")

const coeficientFactorsController = {
    imports: async(req,res) =>{
        try{

          const idBrunch = req.params.idBrunch

          const brunchPos = await purchaseOrdersQueries.brunchPos(idBrunch)

          brunchPos.forEach(po => {
            const date = new Date(po.po_date)
            const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
            po.dateString = dateString
          })

          res.status(200).json(brunchPos)

        }catch(error){
          console.group(error)
          return res.send('Ha ocurrido un error')
        }
    },
    downloadPo: async(req,res) =>{
      try{
    
        const idPO = req.params.idPO
        const showPrices = req.params.showPrices
    
        const purchaseOrder = await purchaseOrdersQueries.filterPoById(idPO)
        const purchaseOrderDetails = await purchaseOrdersQueries.getPoDetails(idPO)
    
        const workbook = new excelJs.Workbook()
        const worksheet = workbook.addWorksheet(purchaseOrder.purchase_order)
    
        const columns = [
          { header: 'Item', key: 'item', width: 20, style: {alignment:{horizontal: 'center'}}},
          { header: 'Description', key: 'description', width: 60 },
          { header: 'Item QTY', key: 'itemQty', width: 10, style: {alignment:{horizontal: 'center'}} },
          { header: 'MU', key: 'mu', width: 10, style: {alignment:{horizontal: 'center'}} }
        ]
    
        if (showPrices == 1) {
          columns.push({ header: 'Unit price', key: 'unitPrice', width: 10, style: {alignment:{horizontal: 'center'}} },{ header: 'Etended price', key: 'extendedPrice', width: 15, style: {alignment:{horizontal: 'center'}} })      
        }
    
        worksheet.columns = columns
    
        const data = []
    
        purchaseOrderDetails.forEach(detail => {
          data.push({
            'item': detail.item,
            'description': detail.description,
            'itemQty': parseFloat(detail.mu_quantity,2).toFixed(2),
            'mu': detail.purchase_order_detail_mu.measurement_unit,
            'unitPrice': parseFloat(detail.fob_supplier_currency,2).toFixed(2),
            'extendedPrice': parseFloat(detail.total_fob_supplier_currency,2).toFixed(2)
          })
        })
    
        data.forEach(row => {
          const rowData = {}
          columns.forEach((column) => {
            rowData[column.key] = row[column.key];
          })
          worksheet.addRow(rowData)      
        })
    
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', 'attachment; filename=PO - ' + purchaseOrder.purchase_order + ' - ' + purchaseOrder.purchase_order_supplier.supplier + '.xlsx')
      
        await workbook.xlsx.write(res)
        
        res.end()
    
      }catch(error){
        console.log(error)
        return res.send('Ha ocurrido un error')
      }
    },
    addEstimatedCosts: async(req,res) =>{
      try{

        const idBrunch = req.params.idBrunch
        const data = req.body

        //get orders details items
        const items = req.body.details.map(d => d.item)
        
        //get items estimated costs
        const estimatedCosts = await costingsQueries.filter(idBrunch, data.idSupplier,items)

        //get orders details data
        const detailsToEdit = req.body.details.map(d => {

          const estimated_cost_supplier_currency = estimatedCosts.filter(ec => ec.item == d.item)[0].unit_cost

          return {
            id: d.id,
            item: d.item,
            estimated_cost_supplier_currency: d.total_cost_local_currency == 0 ? 0 : parseFloat(estimated_cost_supplier_currency,2) || null 
          }
        })

        //edit orders details
        await purchaseOrdersDetailsQueries.updateEstimatedCosts(detailsToEdit)

        
        

        //const brunchPos = await purchaseOrdersQueries.brunchPos(idBrunch)

        

        res.status(200).json()

      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
  },
}
module.exports = coeficientFactorsController

