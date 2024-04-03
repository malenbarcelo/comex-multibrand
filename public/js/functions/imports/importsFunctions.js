import { dominio } from "../../dominio.js"
import { getPoDataToEdit, isValid } from "./createEditPoFunctions.js"
import { receptionCompleteInputs, receptionCalculateCosts } from "./receiveImportFunctions.js"
import globals from "./globals.js"

function printImportsTable(posToPrint,formatOptions,divPoErrors,createEditPoNumber,idBrunch,createEditPoPopup,brunchData) {

    const fob = posToPrint.reduce((fob, po) => fob + parseFloat(po.total_fob_supplier_currency,2), 0);
    const qty = posToPrint.length
    const totalFilteredFob = document.getElementById('totalFilteredFob')
    const totalFilteredQty = document.getElementById('totalFilteredQty')

    if (posToPrint.length == 0) {
        totalFilteredFob.innerHTML = '<b>Importe: </b>USD 0'
        totalFilteredQty.innerHTML = '<b>Cantidad: </b>0'
    }else{
        totalFilteredFob.innerHTML = '<b>Importe: </b>' + posToPrint[0].purchase_order_currency.currency + ' ' + fob.toLocaleString(undefined,formatOptions)
        totalFilteredQty.innerHTML = '<b>Cantidad: </b>' + qty
    }

    const tBody= document.getElementById('tBody')

    //clear table
    tBody.innerHTML = ''

    let counter = 0

    posToPrint.forEach(po => {

        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const statusClass = po.status == 'Recibir' ? 'actionRequired' : null
        const statusLine = po.status == 'Recibir' ? '<div class="receiveStatus">' + po.status + '<i class="fa-regular fa-circle-question questionIcon" id="questionIcon_' + po.id + '"></i></div>' : po.status
        
        const totalFob = parseFloat(po.total_fob_supplier_currency,2)
        const totalVolumeM3 = parseFloat(po.total_volume_m3,2)
        const totalBoxes = parseFloat(po.total_boxes,2)
        const receptionDateAsDate = po.reception_date == null ? '' : new Date(po.reception_date)
        const receptionDate = po.reception_date == null ? '' : (receptionDateAsDate.getDate() + '/' + (receptionDateAsDate.getMonth()+1) + '/' + receptionDateAsDate.getFullYear())
        const costVsFob = po.cost_vs_fob == null ? '' : parseFloat(po.cost_vs_fob * 100,2).toFixed(2) + '%'
        const costRealVsEstimated = po.cost_real_vs_estimated == null ? '' : parseFloat(po.cost_real_vs_estimated * 100,2).toFixed(2) + '%'
        
        const line1 = '<th class="' + rowClass + '">' + po.purchase_order + '</th>'
        const line2 = '<th class="' + rowClass + '">' + po.purchase_order_supplier.supplier + '</th>'  
        const line3 = '<th class="' + rowClass + '">' + po.dateString + '</th>'
        const line4 = '<th class="' + rowClass + '">' + totalFob.toLocaleString(undefined,formatOptions) + '</th>'
        const line5 = '<th class="' + rowClass + '">' + po.purchase_order_currency.currency + '</th>'
        const line6 = '<th class="' + rowClass + '">' + totalVolumeM3.toLocaleString(undefined,formatOptions) + '</th>'
        const line7 = '<th class="' + rowClass + '">' + totalBoxes.toLocaleString(undefined,formatOptions) + '</th>'
        const line8 = '<th class="' + rowClass + '">' + receptionDate + '</th>'
        const line9 = '<th class="' + rowClass + '">' + costVsFob + '</th>'
        const line10 = '<th class="' + rowClass + '">' + costRealVsEstimated + '</th>'
        const line11 = '<th class="' + rowClass + ' ' + statusClass + '">' + statusLine + '</th>'
        const line12 = '<th class="' + rowClass + ' thIcon1"><i class="fa-regular fa-pen-to-square" id="editPo_' + po.id + '"></i></th>'
        const line13 = '<th class="' + rowClass + ' thIcon1"><i class="fa-regular fa-file-excel" id="printExcel_' + po.id + '"></i></th>'
        const line14 = '<th class="' + rowClass + ' thIcon1"><i class="fa-solid fa-truck-ramp-box" id="receiveImport_' + po.id + '"></i></th>'
        const line15 = '<th class="' + rowClass + ' thIcon1"><i class="fa-solid fa-circle-info" id="info_' + po.id + '"></th>'
        const line16 = '<th class="' + rowClass + ' thIcon1"><i class="fa-solid fa-xmark" id="cancelImport_' + po.id + '"></i></th>'        

        tBody.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line12 + line13 + line14 + line15 + line16 + '</tr>'

        counter += 1

    })

    importsEventListeners(divPoErrors,posToPrint,createEditPoNumber,idBrunch,formatOptions,createEditPoPopup,brunchData)    

}

function importsEventListeners(divPoErrors,posToPrint,createEditPoNumber,idBrunch,formatOptions,createEditPoPopup,brunchData) {

    for (let i = 0; i < posToPrint.length; i++) {

        const idPO = posToPrint[i].id
        globals.importData = posToPrint[i]

        //EDIT PO
        const editPo = document.getElementById('editPo_' + idPO)
        
        if (editPo != null) {

            editPo.addEventListener("click", async() => {

                //clear popup data
                isValid(itemLabel,selectItem, itemError)
                isValid(quantityLabel,createEditItemQty, quantityError)

                const {processEdit, poDataEdit, poDetailsEdit, POEdit, supplierIdEdit} = await getPoDataToEdit(divPoErrors,posToPrint,idPO,createEditPoNumber,idBrunch,formatOptions,createEditPoPopup)

                globals.editFrom = 'imports'
                globals.process = processEdit
                globals.poData = poDataEdit
                globals.poDetails = poDetailsEdit
                globals.PO = POEdit
                globals.supplierId = supplierIdEdit

            })
        }

        //RECEIVE IMPORT
        const receiveImport = document.getElementById('receiveImport_' + idPO)
        const receiveImportPopup = document.getElementById('receiveImportPopup')
        const pencilEditPo = document.getElementById('pencilEditPo')
        
        if (receiveImport != null) {

            receiveImport.addEventListener("click", async() => {

                const idPO = posToPrint[i].id
                globals.importData = posToPrint[i]
                
                //get and complete import data
                
                const {inputs, calculations, elements} = receptionCompleteInputs(globals.importData,brunchData,formatOptions)

                //complete inputs data
                receptionCalculateCosts(globals.importData,formatOptions)

                //add event listeners
                pencilEditPo.addEventListener("click", async() => {

                    isValid(itemLabel,selectItem, itemError)
                    isValid(quantityLabel,createEditItemQty, quantityError)

                    const {processEdit, poDataEdit, poDetailsEdit, POEdit, supplierIdEdit} = await getPoDataToEdit(divPoErrors,posToPrint,idPO,createEditPoNumber,idBrunch,formatOptions,createEditPoPopup)

                    globals.editFrom = 'receiveImport'
                    globals.process = processEdit
                    globals.poData = poDataEdit
                    globals.poDetails = poDetailsEdit
                    globals.PO = POEdit
                    globals.supplierId = supplierIdEdit
                    globals.inputCurrencyExchange = inputs.currencyExchange.value
                    globals.inputReceptionDate = inputs.receptionDate.value
                    globals.inputFreight = inputs.freight.value
                    globals.inputInsurance = inputs.insurance.value
                    globals.inputForwarder = inputs.forwarder.value
                    globals.inputDomesticFreight = inputs.domesticFreight.value
                    globals.inputDispatchExpenses = inputs.dispatchExpenses.value
                    globals.inputOfficeFees = inputs.officeFees.value
                    globals.inputContainerCosts = inputs.containerCosts.value
                    globals.inputPortExpenses = inputs.portExpenses.value
                    globals.inputDutiesTarifs = inputs.dutiesTarifs.value
                    globals.inputContainerInsurance = inputs.containerInsurance.value
                    globals.inputPortContribution = inputs.portContribution.value
                    globals.inputOtherExpenses = inputs.otherExpenses.value
                    
                })

                //add event listeners to every input
                for (const key in inputs) {
                    const inputElement = inputs[key]
                    inputElement.addEventListener("change", async() => {
                        
                        receptionCalculateCosts(globals.importData,formatOptions)

                    })
                }

                //show popup
                receiveImportPopup.style.display = "block"
                receiveImportPopup.scrollTop = 0

            })
        }

        //PRINT EXCEL
        const printExcel = document.getElementById('printExcel_' + idPO)

        if (printExcel != null) {
            printExcel.addEventListener("click", async() => {

                globals.yesNoClosePopup.addEventListener("click", async() => {
                    showPricesPopup.style.display = "none"
                })

                globals.yesButton.addEventListener("click", async() => {
                    window.location.href = '/imports/' + idBrunch + '/download-purchase-order/' + idPO + '/1'
                    showPricesPopup.style.display = "none"
                })

                globals.noButton.addEventListener("click", async() => {
                    window.location.href = '/imports/' + idBrunch + '/download-purchase-order/' + idPO + '/0'
                    showPricesPopup.style.display = "none"
                })

                globals.yesNoText.innerText = '¿Desea imprimir precios?'
                showPricesPopup.style.display = "block"

            })
        }

        //CANCEL IMPO
        const cancelImport = document.getElementById('cancelImport_' + idPO)

        if (cancelImport != null) {
            cancelImport.addEventListener("click", async() => {

                console.log(cancelImport)

            })
        }

        //INFO ICON
        const question = document.getElementById('questionIcon_' + idPO)

        if (question != null) {
            question.addEventListener("mouseover",async(e)=>{

                const questionRect = question.getBoundingClientRect()

                const x = questionRect.left
                const y = questionRect.top

                globals.infoPopup.style.left = (x + 25) + 'px'
                globals.infoPopup.style.top = (y - 35) + 'px'
                
                
                globals.infoPopup.style.display = "block"
            })

            question.addEventListener("mouseleave",async()=>{
                
                globals.infoPopup.style.display = "none"
            })
        }

        //IMPORT INFO
        const info = document.getElementById('info_' + idPO)
        const importDetailsPopup = document.getElementById('importDetailsPopup')
        const title = document.getElementById('titleImportDetail')
        const importDetailsSupplier = document.getElementById('importDetailsSupplier')
        const importDetailsBody = document.getElementById('importDetailsBody')
        const closeImportDetailPopup = document.getElementById('closeImportDetailPopup')
        const reception = document.getElementById('reception')
        const status = document.getElementById('status')
        const fob = document.getElementById('fob')
        const cif = document.getElementById('cif')
        const expense = document.getElementById('expense')
        const cost = document.getElementById('cost')
        const tc = document.getElementById('tc')
        const costVsFob = document.getElementById('costVsFob')

        if (info != null) {
            info.addEventListener("click", async() => {

                globals.importData = posToPrint[i]

                title.innerText = 'Importación ' + globals.importData.purchase_order
                importDetailsSupplier.innerText = globals.importData.purchase_order_supplier.supplier

                //close popup add event listener
                closeImportDetailPopup.addEventListener("click", async() => {
                    importDetailsPopup.style.display = 'none'
                })

                //complete import data
                const receptionDateString = (posToPrint[i].reception_date  == '' || posToPrint[i].reception_date == null) ? 'Pendiente' : posToPrint[i].reception_date
                const receptionDate = receptionDateString == 'Pendiente' ? 'Pendiente' : receptionDateString.split('-')[2] + '/' + receptionDateString.split('-')[1] + '/' + receptionDateString.split('-')[0]
                const currency = posToPrint[i].purchase_order_currency.currency
                const fobValue = parseFloat(posToPrint[i].total_fob_supplier_currency,2)
                const cifValue = posToPrint[i].status != 'Recibida' ? 'Pendiente' : parseFloat(posToPrint[i].cif_local_currency,2) / parseFloat(posToPrint[i].exchange_rate,2)
                const expenseValue = posToPrint[i].status != 'Recibida' ? 'Pendiente' : parseFloat(posToPrint[i].total_expenses_local_currency,2) / parseFloat(posToPrint[i].exchange_rate,2)
                const costValue = posToPrint[i].status != 'Recibida' ? 'Pendiente' : parseFloat(posToPrint[i].total_costs_local_currency,2) / parseFloat(posToPrint[i].exchange_rate,2)
                const tcValue = posToPrint[i].status != 'Recibida' ? 'Pendiente' : parseFloat(posToPrint[i].exchange_rate,2)
                const costVsFobValue = posToPrint[i].status != 'Recibida' ? 'Pendiente' : (parseFloat(posToPrint[i].cost_vs_fob * 100,2).toFixed(2) + '%')

                status.innerHTML = '<b>Estado: </b>' + posToPrint[i].status
                reception.innerHTML = '<b>Recepción: </b>' + receptionDate
                fob.innerHTML = '<b>FOB: </b>' + currency + ' ' + fobValue.toLocaleString(undefined,formatOptions)
                cif.innerHTML = '<b>CIF: </b>' + (cifValue == 'Pendiente' ? 'Pendiente' : currency + ' ' + cifValue.toLocaleString(undefined,formatOptions))
                expense.innerHTML = '<b>GASTOS: </b>' + (expenseValue == 'Pendiente' ? 'Pendiente' : currency + ' ' + expenseValue.toLocaleString(undefined,formatOptions))
                cost.innerHTML = '<b>COSTOS: </b>'+ (costValue == 'Pendiente' ? 'Pendiente' : currency + ' ' + costValue.toLocaleString(undefined,formatOptions))
                costVsFob.innerHTML = '<b>COSTO (%): </b>'+ costVsFobValue
                tc.innerHTML = '<b>TC: </b>'+ tcValue.toLocaleString(undefined,formatOptions)
                

                //print import details
                importDetailsBody.innerHTML = ''
                
                const importDetails = await (await fetch(dominio + 'apis/purchase-order-details/' + posToPrint[i].purchase_order)).json()
                let counter = 0

                importDetails.forEach(item => {

                    const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
                    const unitCost = parseFloat(item.unit_cost_supplier_currency,2)
                    const unitPrice = item.total_fob_supplier_currency / item.units_quantity
                    const costVsFob = (unitCost / unitPrice - 1) * 100
                    
                    const line1 = '<th class="' + rowClass + '">' + item.item + '</th>'
                    const line2 = '<th class="' + rowClass + '">' + item.description + '</th>'  
                    const line3 = '<th class="' + rowClass + '">' + item.units_quantity + '</th>'
                    const line4 = '<th class="' + rowClass + '">' + unitPrice.toFixed(3) + '</th>'
                    const line5 = '<th class="' + rowClass + '">' + (isNaN(unitCost) ? '?': parseFloat(unitCost,3).toFixed(3)) + '</th>'
                    const line6 = '<th class="' + rowClass + '">' + (isNaN(costVsFob) ? '?' : (costVsFob.toLocaleString(undefined,formatOptions)) + ' %') + '</th>'
                    const line7 = '<th class="' + rowClass + '">' + '' + '</th>'                    
            
                    importDetailsBody.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + '</tr>'
            
                    counter += 1
            
                })

                importDetailsPopup.style.display = 'block'

            })
        }
    }
}

async function filterPos(brunchPos,filterSupplier,filterYear,filterPurchaseOrder,filterItem,formatOptions,idBrunch,divPoErrors,brunchData) {

    let filteredPos = brunchPos

    const supplierId = filterSupplier.value == 'default' ? 0 :  filterSupplier.value
    const year = filterYear.value == '' ? 0 :  filterYear.value
    const purchaseOrder = filterPurchaseOrder.value == '' ? 0 :  filterPurchaseOrder.value
    const item = filterItem.value == '' ? 0 :  filterItem.value

    if (supplierId != 0) {
        filteredPos = filteredPos.filter(po => po.id_suppliers == supplierId)        
    }

    if (year != 0) {
        filteredPos = filteredPos.filter(po => po.po_year == year)        
    }

    if (purchaseOrder != 0) {
        filteredPos = filteredPos.filter(po => po.purchase_order == purchaseOrder)        
    }

    if (item != 0) {
        const filteredPosDetails = await (await fetch(dominio + 'apis/' + idBrunch + '/filter-pos-details/' + item.replace(/#/g, "%23"))).json() //because some items include '#' and it has to be replaced by %23
        filteredPos = filteredPos.filter(item => filteredPosDetails.includes(item.id))
    }

    printImportsTable(filteredPos,formatOptions,divPoErrors,createEditPoNumber,idBrunch,createEditPoPopup,brunchData)    

}



export {printImportsTable,importsEventListeners,filterPos}