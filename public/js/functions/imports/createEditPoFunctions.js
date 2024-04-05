import { dominio } from "../../dominio.js"
import globals from "./globals.js"

function getPoNumber(brunchData,brunchPos) {

    const createEditPoNumber = document.getElementById('createEditPoNumber')
    const suffix = brunchData.pos_suffix

    const date =  new Date()
    const year = date.getFullYear()
    const yearSliced = ((date.getFullYear()).toString()).slice(-2)
    const yearPos = brunchPos.filter(pos => pos.po_year == year)
    const lastBrunchPo = yearPos.reduce((max, current) => (current.po_number > max.po_number) ? current : max, yearPos[0])
    console.log(lastBrunchPo)
    let poNumber = lastBrunchPo == undefined ? 1 : parseInt(lastBrunchPo.po_number) + 1

    if (poNumber < 10) {
        poNumber = '0' + poNumber
    }

    const PO = suffix + '.' + poNumber + '.' + yearSliced

    createEditPoNumber.value = PO

    return PO
}

async function completePoData(process,PO,poData,poDetails,idBrunch) {

    const titleCreateEditPo = document.getElementById('titleCreateEditPo')
    const createEditPoNumber = document.getElementById('createEditPoNumber')
    const poSupplier = document.getElementById('poSupplier')
    const selectPoSupplier = document.getElementById('selectPoSupplier')
    const createEditPoTableBody = document.getElementById('createEditPoTableBody')
    const selectItem = document.getElementById('selectItem')
    const createEditItemQty = document.getElementById('createEditItemQty')

    //clear data
    createEditPoTableBody.innerHTML = ''
    selectPoSupplier.value = 0
    selectItem.innerHTML = '<option value="0" selected></option>'
    createEditItemQty.value = ''

    //update poData
    updatePoData(poDetails,poData)

    if (process == 'create') {

        titleCreateEditPo.innerText = 'Crear orden de compra'
        createEditPoNumber.removeAttribute("readonly")
        poSupplier.style.display = "none"
        selectPoSupplier.style.display = "block"

    }else{

        const supplierId = PO.purchase_order_supplier.id
        const supplierPriceList = await (await fetch(dominio + 'apis/' + idBrunch + '/price-list/' + supplierId)).json()

        titleCreateEditPo.innerText = 'Editar orden de compra'
        createEditPoNumber.setAttribute("readonly", "readonly")
        poSupplier.innerText = PO.purchase_order_supplier.supplier
        poSupplier.style.display = "block"
        selectPoSupplier.style.display = "none"

        //complete select item
        supplierPriceList.forEach(item => {
            selectItem.innerHTML += '<option value="' + item.id + '">' + item.item  +'</option>'
        })

    }
}

function printTable(poDetails,poData,formatOptions) {

    const createEditPoTableBody = document.getElementById('createEditPoTableBody')

    //clear table
    createEditPoTableBody.innerHTML = ''

    let counter = 0

    poDetails.forEach(item => {

        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const check = item.pays_duties_tarifs == 'si' ? 'checked' : ''

        const line1 = '<th class="' + rowClass + '">' + item.item + '</th>'
        const line2 = '<th class="' + rowClass + '">' + item.description + '</th>'
        const line3 = '<th class="' + rowClass + '">' + parseFloat(item.mu_quantity,2).toFixed(2) + '</th>'
        const line4 = '<th class="' + rowClass + '">' + item.measurement_unit + '</th>'
        const line5 = '<th class="' + rowClass + '">' + parseFloat(item.fob_supplier_currency,3).toFixed(3) + '</th>'
        const line6 = '<th class="' + rowClass + '">' + item.mu_per_box + '</th>'
        const line7 = '<th class="' + rowClass + '">' + parseFloat(item.volume_m3,2).toFixed(2) + '</th>'
        const line8 = '<th class="' + rowClass + '">' + parseFloat(item.weight_kg,2).toFixed(2) + '</th>'
        const line9 = '<th class="' + rowClass + '">' + parseFloat(item.boxes,2).toFixed(2) + '</th>'
        const line10 = '<th class="' + rowClass + '">' + parseFloat(item.total_fob_supplier_currency,2).toFixed(2) + '</th>'
        const line11 = '<th class="' + rowClass + '">' + parseFloat(item.total_volume_m3,2).toFixed(2) + '</th>'
        const line12 = '<th class="' + rowClass + '">' + parseFloat(item.total_weight_kg,2).toFixed(2) + '</th>'
        const line13 = '<th class=" ' + rowClass + '"><input type="checkbox" id="dutiesTarifs_' + item.rowId + '" ' + check + '></th>'
        const line14 = '<th class=" ' + rowClass + ' thIcon1"><i class="fa-regular fa-pen-to-square" id="edit_' + item.rowId + '"></th>'
        const line15 = '<th class=" ' + rowClass + ' thIcon1"><i class="fa-regular fa-trash-can" id="delete_' + item.rowId + '"></th>'

        createEditPoTableBody.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line12 + line13 + line14 + line15 + '</tr>'

        counter += 1

    })

    tableEventListeners(poDetails,poData,formatOptions)

}

function tableEventListeners(poDetails,poData,formatOptions) {

    //close popup
    globals.acceptCancelClose.addEventListener("click", async() => {
        globals.acceptCancelPopup.style.display = 'none'
    })

    //cancel edition
    globals.cancelEdit.addEventListener("click", async() => {
        globals.acceptCancelPopup.style.display = 'none'
    })

    //edit item event listeners
    poDetails.forEach(row => {

        const editRow = document.getElementById('edit_' + row.rowId)
        const deleteRow = document.getElementById('delete_' + row.rowId)

        editRow.addEventListener("click", async() => {

            globals.editItemFob.value = parseFloat(row.fob_supplier_currency,2).toFixed(2)
            globals.editItemQty.value = parseFloat(row.mu_quantity,2).toFixed(2)
            globals.acceptEditTitle.innerText = 'Item ' + row.item
            globals.editItemRow = row.id

            globals.acceptCancelPopup.style.display = 'block'
        })

        deleteRow.addEventListener("click", async() => {
            const index = poDetails.findIndex(item => item.rowId === row.rowId);
            if (index !== -1) {
                poDetails.splice(index, 1)

                //updatePoData
                updatePoData(poDetails,poData,formatOptions)

                //print table
                printTable(poDetails,poData,formatOptions)
            }

        })
    })

}

function updatePoData(poDetails,poData,formatOptions) {

    const totalFob = document.getElementById('totalFob')
    const totalBoxes = document.getElementById('totalBoxes')
    const totalVolume = document.getElementById('totalVolume')
    const totalWeight = document.getElementById('totalWeight')

    var newFob = 0
    var newWeight = 0
    var newBoxes = 0
    var newVolume = 0

    poDetails.forEach(item => {
        newFob += parseFloat(item.total_fob_supplier_currency,2)
        newWeight += parseFloat(item.total_weight_kg,2)
        newBoxes += parseFloat(item.boxes,2)
        newVolume += parseFloat(item.total_volume_m3,2)
    })

    //update po data
    poData.fob = newFob
    poData.weight = newWeight
    poData.volume = newVolume
    poData.boxes = newBoxes

    //update inputs
    totalFob.value = (poData.fob).toLocaleString(undefined,formatOptions)
    totalBoxes.value = poData.boxes.toLocaleString(undefined,formatOptions)
    totalVolume.value = poData.volume.toLocaleString(undefined,formatOptions)
    totalWeight.value = poData.weight.toLocaleString(undefined,formatOptions)

}

function isInvalid(label, input, error) {

    label.classList.add('errorColor')
    input.classList.add('isInvalid')
    error.style.color = 'rgb(221, 7, 7)'
}

function isValid(label, input, error) {
    divPoErrors.innerHTML = ''
    input.classList.remove('isInvalid')
    label.classList.remove('errorColor')
    error.style.color = '#F5F5F5'
    error.style.display = 'none'
    squarePlusError.style.display = 'none'
}

async function getPoDataToEdit(divPoErrors,brunchPos,idPO,createEditPoNumber,idBrunch,formatOptions,createEditPoPopup) {

    const processEdit = 'edit'
    const POEdit = brunchPos.filter(po => po.id == idPO)[0]
    const poNumber = POEdit.purchase_order
    const editPoDetails = await (await fetch(dominio + 'apis/purchase-order-details/' + poNumber)).json()
    const supplierIdEdit = POEdit.id_suppliers
    const supplierData = await (await fetch(dominio + 'apis/' + idBrunch + '/filter-supplier/' + supplierIdEdit)).json()
    const supplierCostCalculation = supplierData.cost_calculation

    let poDataEdit = {'fob':0,'volume':0,'boxes':0,'weight':0,'costCalculation':supplierCostCalculation}
    let poDetailsEdit = []
    let counter = 0

    divPoErrors.innerHTML = ''
    createEditPoNumber.value = poNumber

    //complete poData and poDetails
    editPoDetails.forEach(item => {

        const rowId = counter

        const newRow = {
            'rowId':rowId,
            'id':item.id,
            'item':item.item,
            'description':item.description,
            'id_measurement_units':item.id_measurement_units,
            'mu_quantity':item.mu_quantity,
            'units_quantity':item.units_quantity,
            'mu_per_box':item.mu_per_box,
            'boxes':item.boxes,
            'weight_kg':item.weight_kg,
            'total_weight_kg':item.total_weight_kg,
            'volume_m3':item.volume_m3,
            'total_volume_m3':item.total_volume_m3,
            'fob_supplier_currency':item.fob_supplier_currency,
            'id_currencies':item.id_currencies,
            'brand':item.brand,
            'pays_duties_tarifs':item.pays_duties_tarifs,
            'measurement_unit':item.purchase_order_detail_mu.measurement_unit,
            'total_fob_supplier_currency':item.total_fob_supplier_currency
        }

        counter += 1

        poDetailsEdit.push(newRow)

    })

    //complete PO data
    completePoData(processEdit,POEdit,poDataEdit,poDetailsEdit,idBrunch)

    //update PoData
    updatePoData(poDetailsEdit,poDataEdit,formatOptions)

    //print table and update poData
    printTable(poDetailsEdit,poDataEdit,formatOptions)

    //show popup
    createEditPoPopup.style.display = "block"

    return {processEdit, poDataEdit, poDetailsEdit, POEdit, supplierIdEdit}

}

export {getPoNumber,updatePoData,printTable,tableEventListeners,completePoData,isInvalid,isValid,getPoDataToEdit}