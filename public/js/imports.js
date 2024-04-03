import { dominio } from "./dominio.js"
import globals from "./functions/imports/globals.js"
import { getPoNumber, updatePoData, completePoData, printTable, isInvalid, isValid} from "./functions/imports/createEditPoFunctions.js"
import { receptionCompleteInputs, receptionCalculateCosts, receptionGetElements, receiveIsInvalid, receiveIsValid } from "./functions/imports/receiveImportFunctions.js"
import { printImportsTable, filterPos } from "./functions/imports/importsFunctions.js"

window.addEventListener('load',async()=>{

    /*-----------------IMPORTS DATA-----------------*/
    const idBrunch = document.getElementById('idBrunch').innerText
    const createPo = document.getElementById('createPo')
    const filterSupplier= document.getElementById('filterSupplier')
    const filterYear= document.getElementById('filterYear')
    const filterPurchaseOrder= document.getElementById('filterPurchaseOrder')
    const unfilterPo= document.getElementById('unfilterPo')
    const filterItem= document.getElementById('filterItem')
    const createEditPoPopup = document.getElementById('createEditPoPopup')
    const formatOptions = { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }
    const brunchPos = await (await fetch(dominio + 'apis/' + idBrunch + '/purchase-orders')).json()
    const brunchData = await (await fetch(dominio + 'apis/' + idBrunch + '/filter-brunch')).json()

    /*-----------------CREATE EDIT PO DATA-----------------*/
    const closeCreateEditPoPopup= document.getElementById('closeCreateEditPoPopup')
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

    /*-----------------RECEIVE IMPORT DATA-----------------*/
    const cancelReception = document.getElementById('cancelReception')
    const receiveImportClosePopup = document.getElementById('receiveImportClosePopup')
    const saveReception = document.getElementById('saveReception')
    const acceptReception = document.getElementById('acceptReception')

    /*---------------------------------------IMPORTS.EJS---------------------------------------*/
    /*------IMPORTS.EJS: First load------*/
    printImportsTable(brunchPos,formatOptions,divPoErrors,createEditPoNumber,idBrunch,createEditPoPopup,brunchData)

    /*------IMPORTS.EJS: Filters------*/
    /*---select supplier---*/
    filterSupplier.addEventListener("change", async() => {
        await filterPos(brunchPos,filterSupplier,filterYear,filterPurchaseOrder,filterItem,formatOptions,idBrunch,divPoErrors,brunchData)
    })

    /*---select year---*/
    filterYear.addEventListener("change", async() => {
        await filterPos(brunchPos,filterSupplier,filterYear,filterPurchaseOrder,filterItem,formatOptions,idBrunch,divPoErrors,brunchData)
    })

    /*---select purchase order---*/
    filterPurchaseOrder.addEventListener("change", async() => {
        await filterPos(brunchPos,filterSupplier,filterYear,filterPurchaseOrder,filterItem,formatOptions,idBrunch,divPoErrors,brunchData)
    })

    /*---select item---*/
    filterItem.addEventListener("change", async() => {
        await filterPos(brunchPos,filterSupplier,filterYear,filterPurchaseOrder,filterItem,formatOptions,idBrunch,divPoErrors,brunchData)
    })

    unfilterPo.addEventListener("click", async() => {
        filterItem.value = ''
        filterSupplier.value = ''
        filterPurchaseOrder.value = ''
        filterYear.value = ''
        printImportsTable(brunchPos,formatOptions,divPoErrors,createEditPoNumber,idBrunch,createEditPoPopup,brunchData)
    })

    /*-------------CREATE AND EDIT POPUP EVENT LISTENERS--------------*/

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

        isValid(itemLabel,selectItem, itemError)
        isValid(quantityLabel,createEditItemQty, quantityError)

        globals.supplierId = selectPoSupplier.value
        const supplierPriceList = await (await fetch(dominio + 'apis/' + brunchData.id + '/price-list/' + globals.supplierId)).json()
        const supplierData = await (await fetch(dominio + 'apis/' + brunchData.id + '/filter-supplier/' + globals.supplierId)).json()
        const supplierCostCalculation = supplierData.cost_calculation

        globals.poData = {'fob':0,'volume':0,'boxes':0,'weight':0,'costCalculation':supplierCostCalculation}
        globals.poDetails = []

        //print table
        printTable(globals.poDetails,globals.poData,formatOptions)

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

        const supplierPriceList = await (await fetch(dominio + 'apis/' + brunchData.id + '/price-list/' + globals.supplierId)).json()

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
            isValid(itemLabel,selectItem, itemError)
            isValid(quantityLabel,createEditItemQty, quantityError)

            const item = supplierPriceList.filter(supplierItem => supplierItem.id == itemToAdd)[0]
            const rowId = globals.poDetails.length + 1

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
                'units_quantity':qtyToAdd * item.price_list_mu.units_per_um,
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
            globals.poDetails.push(newRow)

            //updatePoData
            updatePoData(globals.poDetails,globals.poData,formatOptions)

            //print table
            printTable(globals.poDetails,globals.poData,formatOptions)
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
        globals.poDetails.forEach(element => {
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

        if (findPo.length != 0 && globals.process != 'edit') {
            divPoErrors.innerHTML += '<div class="divPoError"><i class="fa-solid fa-circle-exclamation"></i>La order de compra ' + findPo[0].purchase_order + ' ya existe</div>'
        }

        if (globals.poDetails.length == 0) {
            divPoErrors.innerHTML += '<div class="divPoError"><i class="fa-solid fa-circle-exclamation"></i>Debe agregar al menos un ítem a la orden de compra</div>'
        }

        if ((findPo.length == 0 && globals.process == 'create' || globals.process == 'edit') && globals.poDetails.length != 0) {
            const supplierData = await (await fetch(dominio + 'apis/' + brunchData.id + '/filter-supplier/' + globals.supplierId)).json()

            //find if each item pays duties tarifs
            globals.poDetails.forEach(element => {
                const dutiesTarifs= document.getElementById('dutiesTarifs_' + element.rowId)
                element.pays_duties_tarifs = dutiesTarifs.checked ? 'si' : 'no'
            })

            const data = {
                'purchaseOrder':createEditPoNumber.value,
                'poNumber':parseInt(createEditPoNumber.value.split('.')[1]),
                'date':new Date(),
                'idBrunch':parseInt(idBrunch),
                'idSupplier':globals.supplierId,
                'idCurrency':supplierData.id_currencies,
                'poFobSupplierCurrency':parseFloat(globals.poData.fob,2),
                'poWeight':parseFloat(globals.poData.weight,2),
                'poVolume':parseFloat(globals.poData.volume,2),
                'poBoxes':parseFloat(globals.poData.boxes,2),
                'costCalculation':globals.poData.costCalculation,
                'poData':globals.poDetails
            }

            await fetch(dominio + 'apis/create-purchase-order',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            if (globals.editFrom == 'receiveImport') {

                //get updated import data
                globals.importData = await (await fetch(dominio + 'apis/filter-purchase-order/' + findPo[0].purchase_order)).json()

                //get and complete import data
                const {inputs, calculations} = receptionCompleteInputs(globals.importData,brunchData,formatOptions)

                //complete temporal data
                inputs.currencyExchange.value = globals.inputCurrencyExchange
                inputs.receptionDate.value = globals.inputReceptionDate
                inputs.freight.value = globals.inputFreight
                inputs.insurance.value = globals.inputInsurance
                inputs.forwarder.value = globals.inputForwarder
                inputs.domesticFreight.value = globals.inputDomesticFreight
                inputs.dispatchExpenses.value = globals.inputDispatchExpenses
                inputs.officeFees.value = globals.inputOfficeFees
                inputs.containerCosts.value = globals.inputContainerCosts
                inputs.portExpenses.value = globals.inputPortExpenses
                inputs.dutiesTarifs.value = globals.inputDutiesTarifs
                inputs.containerInsurance.value = globals.inputContainerInsurance
                inputs.portContribution.value = globals.inputPortContribution
                inputs.otherExpenses.value = globals.inputOtherExpenses

                //complete inputs data
                receptionCalculateCosts(globals.importData,formatOptions)

                createEditPoPopup.style.display = 'none'

            }else{

                window.location.href = '/imports/' + idBrunch + '/imports-data'

            }
        }
    })

    //change po data
    //accept edition event listener
    globals.acceptEdit.addEventListener("click", async() => {

        const idRow = globals.editItemRow
        const newFob = parseFloat(globals.editItemFob.value,3)
        const newQty = parseFloat(globals.editItemQty.value,3)
        const newTotalFob = newFob * newQty

        let rowData = globals.poDetails.find(item => item.id == idRow)

        if (rowData) {

            rowData.fob_supplier_currency = newFob
            rowData.mu_quantity = newQty
            rowData.boxes = newQty / rowData.mu_per_box
            rowData.total_fob_supplier_currency = newTotalFob
            rowData.total_weight_kg = (newQty / rowData.mu_per_box) * rowData.weight_kg
            rowData.total_volume_m3 = (newQty / rowData.mu_per_box) * rowData.volume_m3
        }

        //updatePoData
        updatePoData(globals.poDetails,globals.poData,formatOptions)

        //print table
        printTable(globals.poDetails,globals.poData,formatOptions)

        globals.acceptCancelPopup.style.display = 'none'

    })

    /*-------------CREATE PO EVENT LISTENERS--------------*/
    createPo.addEventListener("click", async() => {

        //clear data
        isValid(itemLabel,selectItem, itemError)
        isValid(quantityLabel,createEditItemQty, quantityError)

        globals.process = 'create'
        globals.poData = {'fob':0,'volume':0,'boxes':0,'weight':0}
        globals.poDetails = []

        //get and complete import data
        globals.PO = getPoNumber(brunchData,brunchPos)

        completePoData(globals.process,globals.PO,globals.poData,globals.poDetails,idBrunch)

        //show popup
        createEditPoPopup.style.display = "block"

    })

    /*-------------EDIT PO AND RECEIVE IMPORT EVENT LISTENERS--------------*/

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
        
        globals.process = 'saveReceptionData'

        //complete inputs data
        const {data,alertCounter} = await receptionCalculateCosts(globals.importData,globals.process,formatOptions)

        await fetch(dominio + 'apis/receive-import',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        window.location.href = '/imports/' + idBrunch + '/imports-data'

    })

    //accept reception
    acceptReception.addEventListener("click", async() => {

        globals.process = 'acceptReception'
        let errors = 0

        const {inputs} = receptionGetElements()

        const textsToValidate = [inputs.receptionDate,inputs.currencyExchange,inputs.freight,inputs.insurance,inputs.forwarder,inputs.domesticFreight,inputs.dispatchExpenses,inputs.officeFees]
        const valuesToValidate = [inputs.currencyExchange,inputs.freight,inputs.insurance,inputs.forwarder,inputs.domesticFreight,inputs.dispatchExpenses,inputs.officeFees]

        //not empty validations
        textsToValidate.forEach(input => {
            const inputName = input.name
            const errorText = document.querySelector(`#${inputName}ErrorText`)
            const errorLabel = document.querySelector(`#${inputName}Label`)
            if (input.value == '' || input.value == 0) {
                errors += 1
                errorText.innerText = 'El campo no puede estar vacío'
                receiveIsInvalid(errorLabel, input)
            }else{
                //number validations
                if (valuesToValidate.includes(input)) {
                    if (isNaN(input.value)) {
                        errors += 1
                        errorText.innerText = 'El valor debe ser numérico. Utilice "." como separador de decimales.'
                        receiveIsInvalid(errorLabel, input)
                    }else{
                        receiveIsValid(errorText,errorLabel, input)
                    }                    
                }else{
                    receiveIsValid(errorText,errorLabel, input)
                }
            }
        })

        //complete inputs data
        const {data, alertCounter} = await receptionCalculateCosts(globals.importData,globals.process,formatOptions)

        if (alertCounter == 0 && errors == 0) {
            await fetch(dominio + 'apis/receive-import',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
    
            window.location.href = '/imports/' + idBrunch + '/imports-data'
            
        }
        
    })
    
})





