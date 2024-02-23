import { dominio } from "./dominio.js"
import { getPoNumber, updatePoData, completePoData, printTable, isInvalid, isValid, getpoDataToEdit} from "./functions/imports/createEditPoFunctions.js"
import { receptionCompleteInputs, receptionCalculateCosts } from "./functions/imports/receiveImportFunctions.js"

window.addEventListener('load',async()=>{

    const idBrunch = document.getElementById('idBrunch').innerText
    const createPo = document.getElementById('createPo')
    const createEditPoPopup = document.getElementById('createEditPoPopup')
    const formatOptions = { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 3 }
    const brunchPos = await (await fetch(dominio + 'apis/' + idBrunch + '/purchase-orders')).json()
    const brunchData = await (await fetch(dominio + 'apis/' + idBrunch + '/filter-brunch')).json()

    /*-------------CREATE AND EDIT POPUP DATA AND EVENT LISTENERS--------------*/
    const closeCreateEditPoPopup = document.getElementById('closeCreateEditPoPopup')
    const selectPoSupplier = document.getElementById('selectPoSupplier')
    const selectItem = document.getElementById('selectItem')
    const addItem = document.getElementById('addItem')
    const createEditItemQty = document.getElementById('createEditItemQty')
    const totalFobLabel = document.getElementById('totalFobLabel')
    const cancelCreateEditPo = document.getElementById('cancelCreateEditPo')
    const saveCreateEditPo = document.getElementById('saveCreateEditPo')
    const itemError = document.getElementById('itemError')
    const quantityError = document.getElementById('quantityError')
    const squarePlusError = document.getElementById('squarePlusError')
    const itemLabel = document.getElementById('itemLabel')
    const quantityLabel = document.getElementById('quantityLabel')
    const divPoErrors = document.getElementById('divPoErrors')
    const createEditPoNumber = document.getElementById('createEditPoNumber')
    const cbxDutiesTarifs = document.getElementById('cbxDutiesTarifs')
    let process = ''
    let poData = {'fob':0,'volume':0,'boxes':0,'weight':0}
    let poDetails = []
    let PO = ''
    let supplierId = 0
    let editFrom = ''

    //close create edit popup event listener
    closeCreateEditPoPopup.addEventListener("click", async() => {
        createEditPoPopup.style.display = "none"
    })

    //cancel create edit po listener
    cancelCreateEditPo.addEventListener("click", async() => {
        createEditPoPopup.style.display = "none"
    })

    //select supplier event listener
    selectPoSupplier.addEventListener("change", async() => {

        divPoErrors.innerHTML = ''

        itemError.style.display = 'none'
        quantityError.style.display = 'none'
        squarePlusError.style.display = 'none'
        isValid(itemLabel,selectItem, itemError)
        isValid(quantityLabel,createEditItemQty, quantityError)

        supplierId = selectPoSupplier.value
        const supplierPriceList = await (await fetch(dominio + 'apis/' + brunchData.id + '/price-list/' + supplierId)).json()
        const supplierData = await (await fetch(dominio + 'apis/' + brunchData.id + '/filter-supplier/' + supplierId)).json()
        const supplierCostCalculation = supplierData.cost_calculation

        poData = {'fob':0,'volume':0,'boxes':0,'weight':0,'costCalculation':supplierCostCalculation}
        poDetails = []

        //print table
        printTable(poDetails,poData,formatOptions)

        //complete fob label
        totalFobLabel.innerText = 'FOB ('  + supplierData.supplier_currency.currency + '): '

        //complete select item
        selectItem.innerHTML = '<option value="0" selected></option>'

        supplierPriceList.forEach(item => {
            selectItem.innerHTML += '<option value="' + item.id + '">' + item.item  +'</option>'
        })

        //delete quantity input
        createEditItemQty.value = ''
    })

    //confirm add item event listener
    addItem.addEventListener("click", async() => {

        divPoErrors.innerHTML = ''

        const supplierPriceList = await (await fetch(dominio + 'apis/' + brunchData.id + '/price-list/' + supplierId)).json()

        const itemToAdd = selectItem.value
        const qtyToAdd = createEditItemQty.value

        if (itemToAdd == 0 || qtyToAdd == 0) {
            itemError.style.display = 'block'
            quantityError.style.display = 'block'
            squarePlusError.style.display = 'block'
            if (itemToAdd == 0) {
                isInvalid(itemLabel,selectItem, itemError)
            }else{
                isValid(itemLabel,selectItem, itemError)
            }
            if (qtyToAdd == 0) {
                isInvalid(quantityLabel,createEditItemQty, quantityError)
            }else{
                isValid(quantityLabel,createEditItemQty, quantityError)
            }
        } else{
            itemError.style.display = 'none'
            quantityError.style.display = 'none'
            squarePlusError.style.display = 'none'
            isValid(itemLabel,selectItem, itemError)
            isValid(quantityLabel,createEditItemQty, quantityError)

            const item = supplierPriceList.filter(supplierItem => supplierItem.id == itemToAdd)[0]
            const rowId = poDetails.length + 1

            const boxes = parseFloat(qtyToAdd / item.mu_per_box,2)
            const totalWeightKg = parseFloat(item.weight_kg * boxes,2)
            const totalVolumeM3 = parseFloat(item.volume_m3 * boxes,2)
            const totalfob = parseFloat(item.fob * qtyToAdd,2)

            selectItem.value = ''
            createEditItemQty.value = ''

            const newRow = {
                'rowId':rowId,
                'id':item.id,
                'item':item.item,
                'description':item.description,
                'id_measurement_units':item.id_measurement_units,
                'mu_quantity':qtyToAdd,
                'units_quantity':0,
                'mu_per_box':item.mu_per_box,
                'boxes':boxes,
                'weight_kg':parseFloat(item.weight_kg,2),
                'total_weight_kg':totalWeightKg,
                'volume_m3':parseFloat(item.volume_m3,2),
                'total_volume_m3':totalVolumeM3,
                'fob_supplier_currency':parseFloat(item.fob,2),
                'id_currencies':item.id_currencies,
                'brand':item.brand,
                'measurement_unit':item.price_list_mu.measurement_unit,
                'total_fob_supplier_currency':totalfob
            }

            //add item to poDetails
            poDetails.push(newRow)

            //updatePoData
            updatePoData(poDetails,poData,formatOptions)

            //print table
            printTable(poDetails,poData,formatOptions)
        }

    })

    //press enter in item quantity
    createEditItemQty.addEventListener("keydown", function(e) {
        if (e.key === 'Enter') {
            addItem.click()
        }
    })

    //check all pays duties tarifs
    cbxDutiesTarifs.addEventListener("click", function(e) {
        poDetails.forEach(element => {
            const dutiesTarifs= document.getElementById('dutiesTarifs_' + element.rowId)
            if (cbxDutiesTarifs.checked == true) {
                dutiesTarifs.checked = true
            }else{
                dutiesTarifs.checked = false
            }
        })
    })

    //save po
    saveCreateEditPo.addEventListener("click", async function(e) {

        divPoErrors.innerHTML = ''

        const findPo = brunchPos.filter(po => po.purchase_order == createEditPoNumber.value)

        if (findPo.length != 0 && process != 'edit') {
            divPoErrors.innerHTML += '<div class="divPoError"><i class="fa-solid fa-circle-exclamation"></i>La order de compra ' + findPo[0].purchase_order + ' ya existe</div>'
        }

        if (poDetails.length == 0) {
            divPoErrors.innerHTML += '<div class="divPoError"><i class="fa-solid fa-circle-exclamation"></i>Debe agregar al menos un ítem a la orden de compra</div>'
        }

        if ((findPo.length == 0 && process == 'create' || process == 'edit') && poDetails.length != 0) {
            const supplierData = await (await fetch(dominio + 'apis/' + brunchData.id + '/filter-supplier/' + supplierId)).json()

            //find if each item pays duties tarifs
            poDetails.forEach(element => {
                const dutiesTarifs= document.getElementById('dutiesTarifs_' + element.rowId)
                element.pays_duties_tarifs = dutiesTarifs.checked ? 'si' : 'no'
            })
            
            const data = {
                'purchaseOrder':createEditPoNumber.value,
                'poNumber':parseInt(createEditPoNumber.value.split('.')[1]),
                'date':new Date(),
                'idBrunch':parseInt(idBrunch),
                'idSupplier':supplierId,
                'idCurrency':supplierData.id_currencies,
                'poFobSupplierCurrency':parseFloat(poData.fob,2),
                'poWeight':parseFloat(poData.weight,2),
                'poVolume':parseFloat(poData.volume,2),
                'poBoxes':parseFloat(poData.boxes,2),
                'costCalculation':poData.costCalculation,
                'poData':poDetails
            }

            await fetch(dominio + 'apis/create-purchase-order',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            if (editFrom == 'receiveImport') {

                //get updated import data
                importData = await (await fetch(dominio + 'apis/filter-purchase-order/' + findPo[0].purchase_order)).json()

                //get and complete import data
                const {inputs, calculations} = receptionCompleteInputs(importData,brunchData,formatOptions)

                //complete inputs data
                receptionCalculateCosts(importData,formatOptions)

                createEditPoPopup.style.display = 'none'

            }else{

                window.location.href = '/imports/' + idBrunch + '/imports-data'

            }
        }
    })

    /*-------------CREATE PO EVENT LISTENERS--------------*/
    createPo.addEventListener("click", async() => {

        process = 'create'
        poData = {'fob':0,'volume':0,'boxes':0,'weight':0}
        poDetails = []

        //get and complete import data
        PO = getPoNumber(brunchData,brunchPos)

        completePoData(process,PO,poData,poDetails,idBrunch)

        //show popup
        createEditPoPopup.style.display = "block"

    })

    /*-------------EDIT PO AND RECEIVE IMPORT EVENT LISTENERS--------------*/
    const cancelReception = document.getElementById('cancelReception')
    const receiveImportClosePopup = document.getElementById('receiveImportClosePopup')
    const saveReception = document.getElementById('saveReception')
    let importData = ''
    
    //cancel reception event listener
    cancelReception.addEventListener("click", async() => {
        window.location.href = '/imports/' + idBrunch + '/imports-data'
    })

    //close popup event listener
    receiveImportClosePopup.addEventListener("click", async() => {
        window.location.href = '/imports/' + idBrunch + '/imports-data'
    })

    //save reception data
    saveReception.addEventListener("click", async() => {

        //complete inputs data
        const {data, details} = receptionCalculateCosts(importData,formatOptions)

        //console.log(details)

        await fetch(dominio + 'apis/receive-po',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })
        
        //window.location.href = '/imports/' + idBrunch + '/imports-data'

    })
    
    for (let i = 0; i < brunchPos.length; i++) {

        const idPO = brunchPos[i].id
        importData = brunchPos[i]

        //EDIT PO
        const editPo = document.getElementById('editPo_' + idPO)
        
        if (editPo != null) {

            editPo.addEventListener("click", async() => {

                const {processEdit, poDataEdit, poDetailsEdit, POEdit, supplierIdEdit} = await getpoDataToEdit(divPoErrors,brunchPos,idPO,createEditPoNumber,idBrunch,formatOptions,createEditPoPopup)

                editFrom = 'imports'
                process = processEdit
                poData = poDataEdit
                poDetails = poDetailsEdit
                PO = POEdit
                supplierId = supplierIdEdit

            })
        }

        //RECEIVE IMPORT
        const receiveImport = document.getElementById('receiveImport_' + idPO)
        const receiveImportPopup = document.getElementById('receiveImportPopup')
        const pencilEditPo = document.getElementById('pencilEditPo')
        
        if (receiveImport != null) {

            receiveImport.addEventListener("click", async() => {

                const idPO = brunchPos[i].id
                importData = brunchPos[i]

                //get and complete import data
                const {inputs, calculations, elements} = receptionCompleteInputs(importData,brunchData,formatOptions)

                //complete inputs data
                receptionCalculateCosts(importData,formatOptions)

                //add event listeners
                pencilEditPo.addEventListener("click", async() => {

                    const {processEdit, poDataEdit, poDetailsEdit, POEdit, supplierIdEdit} = await getpoDataToEdit(divPoErrors,brunchPos,idPO,createEditPoNumber,idBrunch,formatOptions,createEditPoPopup)

                    editFrom = 'receiveImport'
                    process = processEdit
                    poData = poDataEdit
                    poDetails = poDetailsEdit
                    PO = POEdit
                    supplierId = supplierIdEdit

                })

                //add event listeners to every input
                for (const key in inputs) {
                    const inputElement = inputs[key]
                    inputElement.addEventListener("change", async() => {
                        
                        receptionCalculateCosts(importData,formatOptions)

                    })
                }

                //show popup
                receiveImportPopup.style.display = "block"
                receiveImportPopup.scrollTop = 0

            })
        }

        //PRINT EXCEL
        /*const printExcel = document.getElementById('printExcel_' + idPO)

        if (printExcel != null) {
            printExcel.addEventListener("click", async() => {
                showPricesPopup.style.display = "block"
                yesButton.href = '/imports/' + idBrunch + '/download-purchase-order/' + idPO + '/1'
                noButton.href = '/imports/' + idBrunch + '/download-purchase-order/' + idPO + '/0'
            })
        }*/

    }



})




