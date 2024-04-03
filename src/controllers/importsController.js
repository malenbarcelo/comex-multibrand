const db = require('../../database/models')
const brunchesQueries = require('./dbQueries/brunchesQueries')
const purchaseOrdersQueries = require('./dbQueries/purchaseOrdersQueries')
const suppliersQueries = require('./dbQueries/suppliersQueries')
const pricesListsQueries = require('./dbQueries/pricesListsQueries')
const puppeteer = require('puppeteer')
const domain = require('./domain')
const excelJs = require('exceljs')
const path = require('path');

//get DB Data
async function getData(idBrunch){
  const brunches = await brunchesQueries.allData()
  const brunch = await brunchesQueries.brunch(idBrunch)
  const suppliers = await suppliersQueries.allSuppliers()
  const data = {idBrunch,brunches,brunch,suppliers}
  return data
}

const importsController = {
  //APIS
  receiveImport: async(req,res) =>{
    try{

      const data = req.body
        
      await purchaseOrdersQueries.receiveImport(data)      

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },










  imports: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const date =  new Date()
      const year = ((date.getFullYear()).toString()).slice(-2)
      const data = await getData(idBrunch)
      const imports = await purchaseOrdersQueries.filterLast100(idBrunch)

      imports.forEach(item => {
        const date = new Date(item.po_date)
        const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
        item.dateString = dateString
      })

      return res.render('imports/imports',{title:'Importaciones',data,imports})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  importsFiltered: async(req,res) =>{
    try{
      const idBrunch = req.params.idBrunch
      const supplier = req.params.supplier
      const year = req.params.year
      const po = req.params.po
      const item = req.params.item

      const dataToFilter = {
        supplier,
        year,
        po,
        item
      }
      
      const data = await getData(idBrunch)

      let imports = await purchaseOrdersQueries.brunchPos(idBrunch)

      if (supplier != 0) {
        imports = imports.filter(element => element.purchase_order_supplier.supplier == supplier)
      }
      if (year != 0) {
        imports = imports.filter(element => element.po_year == year)
      }
      if (po != 0) {
        imports = imports.filter(element => element.purchase_order == po)
      }
      if (item != 0) {
        let importsDetails = await purchaseOrdersQueries.getPosWithItem(item)
        let pos = []
        importsDetails.forEach(row => {
          pos.push(row.purchase_order_detail_po.purchase_order)
        })
        imports = imports.filter(element => pos.includes(element.purchase_order))
      }

      imports.forEach(item => {
        const date = new Date(item.po_date)
        const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
        item.dateString = dateString
      })

      return res.render('imports/imports',{title:'Importaciones',data,imports,dataToFilter})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  createPo: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const idSupplier = req.params.idSupplier
      const date =  new Date()
      const year = ((date.getFullYear()).toString()).slice(-2)
      const supplier = await suppliersQueries.filterSupplier(idSupplier)
      const lastPo = await purchaseOrdersQueries.lastPo(idBrunch)
      const supplierItems = await pricesListsQueries.supplierPriceList(idBrunch,supplier.id)
      const process = 'create'

      const data = await getData(idBrunch)

      const purchaseOrder = data.brunch.pos_suffix + '.' + (parseInt(lastPo) <= 9 ? '0' : '') + lastPo + '.' + year

      return res.render('imports/createPo',{title:'Crear orden de compra',data,supplier,purchaseOrder,supplierItems,process})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editPo: async(req,res) =>{
    try{

      const idBrunch = req.params.idBrunch
      const purchaseOrder = req.params.purchaseOrder
      const poData = await purchaseOrdersQueries.filterPo(purchaseOrder)
      const supplier = await suppliersQueries.filterSupplier(poData.id_suppliers)
      const data = await getData(idBrunch)
      const process = 'edit'
      const supplierItems = await pricesListsQueries.supplierPriceList(idBrunch,supplier.id)
      
      return res.render('imports/createPo',{title:'Editar orden de compra',data,poData,supplier,purchaseOrder,process,supplierItems})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  viewPurchaseOrder: async(req,res) =>{
    try{

      const idPO = req.params.idPO
      const idBrunch = req.params.idBrunch
      const data = await getData(idBrunch)
      const showPrices = req.params.showPrices

      const purchaseOrder = await purchaseOrdersQueries.filterPoById(idPO)
      const purchaseOrderDetails = await purchaseOrdersQueries.getPoDetails(idPO)

      const date = new Date(purchaseOrder.po_date)
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      const month = (date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)
      const year = date.getFullYear() < 10 ? '0' + date.getFullYear() : date.getFullYear()

      const dateString = day + '/' + month + '/' + year

      console.log(showPrices)

      return res.render('imports/purchaseOrderPdf',{title:'Purchase Order',data,purchaseOrderDetails,purchaseOrder,dateString,showPrices})

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  printPO: async(req,res) =>{
    try{

      const idPO = req.params.idPO
      const idBrunch = req.params.idBrunch
      const showPrices = req.params.showPrices

      const po = await purchaseOrdersQueries.filterPoById(idPO)
      const fileName = po.purchase_order
            
      const url = domain + 'imports/' + idBrunch + '/view-purchase-order/' + idPO + '/' + showPrices
      
      const browser = await puppeteer.launch({
                headless: "new", // to avoid open windows
                printBackground: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // to avoid errors
      })

      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'networkidle0' });

      var cssb = [];
      cssb.push('<style>');
      cssb.push('h1 { font-size:10px; margin-left:30px;margin:auto}');
      cssb.push('.po { font-size:30px;border: red solid 1px; width:100%; text-align:center}');
      cssb.push('</style>');
      var css = cssb.join('');

      
      var route = path.resolve('../public/images/companyLogo.jpg')      

      const headerTemplate = '<div class="po">'+'PO ' + fileName + '<img src=' + route + 'alt="Company Logo" class="poCompanyLogo">'+'</div>'

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: css + headerTemplate,
        footerTemplate: css +'<h1>Page <span class="pageNumber"></span> of <span class="totalPages"></span></h1>',
        margin: { 
          top: "100px", 
          bottom: "200px",
          right: "30px",
          left: "30px",
        }
      });

      await browser.close()

      // Configura las cabeceras de respuesta para descargar el PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=Purchase order - ' + fileName + '.pdf');

      res.send(pdfBuffer);
    
  }catch(error){
        console.log(error)
        return res.send(error)
    }
},
downloadPoExcel: async(req,res) =>{
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
}
  
}
module.exports = importsController

