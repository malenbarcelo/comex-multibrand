import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

    //general data
    const idBrunch = document.getElementById('idBrunch').innerText
    const brunchImports = await (await fetch(dominio + 'apis/' + idBrunch + '/purchase-orders')).json()
    const receivedImports = brunchImports.filter(imports => imports.status == 'Recibida')
    const importsBySupplier = await (await fetch(dominio + 'apis/' + idBrunch + '/imports-by-supplier')).json()

    //imports by supplier
    const importsBody1 = document.getElementById('importsBody1')
    const filterSupplier1 = document.getElementById('filterSupplier1')
    const filterYear1 = document.getElementById('filterYear1')
    const deleteFilters1 = document.getElementById('deleteFilters1')
    const importFilters1 = [filterSupplier1,filterYear1]

    //imports details
    const importsBody2 = document.getElementById('importsBody2')
    const filterSupplier2 = document.getElementById('filterSupplier2')
    const filterYear2 = document.getElementById('filterYear2')
    const deleteFilters2 = document.getElementById('deleteFilters2')
    const importFilters2 = [filterSupplier2,filterYear2]
    
    //////////////////////////////IMPORTS HISTORY//////////////////////////////

    //////////////////////////////PRINT DATA
    //print imports details
    printResumedImports(importsBySupplier)

    //print imports details
    printImportsDetails(receivedImports)

    //////////////////////////////FILTERS EVENT LISTENERS
    //resumed import event listeners
    importFilters1.forEach(filter => {
        filter.addEventListener('change',async()=>{

            const idSupplier = filterSupplier1.value
            const year = filterYear1.value
            let filteredImports = []
    
            //get filtered imports
            if (year == '') {
                filteredImports = importsBySupplier
            }else{
                filteredImports = await (await fetch(dominio + 'apis/' + idBrunch + '/imports-by-supplier-and-year/' + year)).json()
            }
    
            if (idSupplier != 'default') {
                filteredImports = filteredImports.filter(imports => imports.id_suppliers == idSupplier)                
            }
    
            if (year != '') {
                filteredImports = filteredImports.filter(imports => imports.po_year == year)                
            }
    
            printResumedImports(filteredImports)
            
        })
    })
    

    //import details event listeners
    importFilters2.forEach(filter => {
        filter.addEventListener('change',async()=>{

            let filteredImports = receivedImports
            
            const idSupplier = filterSupplier2.value
            const year = filterYear2.value

            if (idSupplier != 'default') {
                filteredImports = filteredImports.filter(imports => imports.id_suppliers == idSupplier)                
            }

            if (year != '') {
                filteredImports = filteredImports.filter(imports => imports.po_year == year)                
            }

            printImportsDetails(filteredImports)
            
        })
    })

    //////////////////////////////DELETE FILTERS EVENT LISTENERS
    deleteFilters1.addEventListener('click',async()=>{
        filterSupplier1.value = ''
        filterYear1.value = ''
        printResumedImports(importsBySupplier)
    })

    deleteFilters2.addEventListener('click',async()=>{
        filterSupplier2.value = ''
        filterYear2.value = ''
        printImportsDetails(receivedImports)
    })
})

//////////////////////////////FUNCTIONS//////////////////////////////
function printResumedImports(importsToPrint) {

    const formatOptions = { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }

    //get and complete resumed data
    const totalFob1 = document.getElementById('totalFob1')

    const fobToPrint = importsToPrint.reduce((accumulator, importData) => {
        return accumulator + parseFloat(importData.total_fob,4)
    }, 0)

    totalFob1.innerHTML = '<b>FOB:</b> ' + fobToPrint.toLocaleString(undefined,formatOptions)

    //print table
    let counter = 0

    importsBody1.innerHTML = ''

    importsToPrint.forEach(element => {
        
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
        const line1 = '<th class="' + rowClass + '">' + element.purchase_order_supplier.supplier + '</th>'  
        const line2 = '<th class="' + rowClass + '">' + parseFloat(element.total_fob,2).toLocaleString(undefined,formatOptions) + '</th>'
        const line3 = '<th class="' + rowClass + '">' + element.purchase_order_currency.currency + '</th>'

        importsBody1.innerHTML += '<tr>' + line1 + line2 + line3 + '</tr>'

        counter += 1

    })
    
}

function printImportsDetails(importsToPrint) {

    const formatOptions = { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }

    //get and complete resumed data
    const totalFob2 = document.getElementById('totalFob2')
    const totalQty2 = document.getElementById('totalQty2')

    const fobToPrint = importsToPrint.reduce((accumulator, importData) => {
        return accumulator + parseFloat(importData.total_fob_supplier_currency,4)
    }, 0)

    totalFob2.innerHTML = '<b>FOB:</b> ' + fobToPrint.toLocaleString(undefined,formatOptions)
    totalQty2.innerHTML = '<b>Cantidad:</b> ' + importsToPrint.length 

    //print table
    let counter = 0

    importsBody2.innerHTML = ''

    importsToPrint.forEach(element => {
        
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
        const line1 = '<th class="' + rowClass + '">' + element.purchase_order + '</th>'
        const line2 = '<th class="' + rowClass + '">' + element.dateString + '</th>'
        const line3 = '<th class="' + rowClass + '">' + element.purchase_order_supplier.supplier + '</th>'  
        const line4 = '<th class="' + rowClass + '">' + parseFloat(element.total_fob_supplier_currency,2).toLocaleString(undefined,formatOptions) + '</th>'
        const line5 = '<th class="' + rowClass + '">' + element.purchase_order_currency.currency + '</th>'
        const line6 = '<th class="' + rowClass + '">' + (element.cost_vs_fob * 100).toFixed(2) + '%' + '</th>'

        importsBody2.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + '</tr>'

        counter += 1

    })    
}

