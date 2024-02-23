import { dominio } from "./dominio.js"
import { createPoTable } from "./functions/createPoTable.js"
import { createPoListeners } from "./functions/createPoListeners.js"
import { createPoInputsData } from "./functions/createPoInputsData.js"
import { createPoItemData } from "./functions/createPoItemData.js"

window.addEventListener('load',async()=>{

    const addItem = document.getElementById('addItem')
    const purchaseOrder = document.getElementById('purchaseOrder')
    const divErrorPoNumber = document.getElementById('divErrorPoNumber')
    const savePo = document.getElementById('savePo')
    const idSupplier = document.getElementById('idSupplier').innerText
    const idBrunch = document.getElementById('idBrunch').innerHTML
    const process = document.getElementById('process').innerText
    const supplierItems = await (await fetch(dominio + 'apis/' + idBrunch + '/price-list/' + idSupplier)).json()
    const supplier = await (await fetch(dominio + 'apis/' + idBrunch + '/filter-supplier/' + idSupplier)).json()
    const brunch = await (await fetch(dominio + 'apis/' + idBrunch + '/filter-brunch')).json()

    const currency = supplier.supplier_currency.currency
    var poData = []
    var counter = 0

    //addPopup
    const addPopup = document.getElementById('addPopup')
    const cancelAddButton = document.getElementById('cancelAddButton')
    const confirmAddButton = document.getElementById('confirmAddButton')
    const divErrorSelect = document.getElementById('divErrorSelect')
    const divErrorQty = document.getElementById('divErrorQty')

    //deletePopup
    const deletePopup = document.getElementById('deletePopup')
    const itemToDeleteInput = document.getElementById('itemToDelete')
    const cancelDeleteButton = document.getElementById('cancelDeleteButton')
    const confirmDeleteButton = document.getElementById('confirmDeleteButton')
    const rowToDelete = document.getElementById('rowToDelete')

    //editPopup
    const editPopup = document.getElementById('editPopup')
    const cancelEditButton = document.getElementById('cancelEditButton')
    const confirmEditButton = document.getElementById('confirmEditButton')
    const divErrorItemQty = document.getElementById('divErrorItemQty')
    const divErrorItemFob = document.getElementById('divErrorItemFob')

    //confirmPopup
    const confirmPopup = document.getElementById('confirmPopup')
    const confirmText = document.getElementById('confirmText')
    const confirmButton = document.getElementById('confirmButton')
    const cancelConfirmButton = document.getElementById('cancelConfirmButton')

    //if process = edit get PO data
    if (process == 'edit') {
        const purchaseOrder = document.getElementById('purchaseOrder').value
        const poDetails = await (await fetch(dominio + 'apis/purchase-order-details/' + purchaseOrder)).json()

        poDetails.forEach(item => {
            counter += 1
            const itemData = {
                'counter':counter,
                'id':item.id,
                'item':item.item,
                'description':item.description,
                'id_measurement_units':item.id_measurement_units,
                'measurement_unit':item.purchase_order_detail_mu.measurement_unit,
                'mu_quantity':parseFloat(item.mu_quantity,2),
                'units_quantity':item.units_quantity,
                'mu_per_box':item.mu_per_box,
                'boxes':item.boxes,
                'weight_kg':parseFloat(item.weight_kg,2),
                'total_weight_kg':parseFloat(item.total_weight_kg,2),
                'volume_m3':parseFloat(item.volume_m3,2),
                'total_volume_m3':parseFloat(item.total_volume_m3,2),
                'fob_supplier_currency':parseFloat(item.fob_supplier_currency,2),
                'total_fob_supplier_currency':parseFloat(item.total_fob_supplier_currency,2),
                'brand':item.brand,
                'currency':currency
            }

            poData.push(itemData)

            //create table with data
            createPoTable(itemData)

            //add delete and edit listeners
            createPoListeners(poData)

            //complete data inputs
            createPoInputsData(poData,currency)
        })
    }

    addItem.addEventListener("click",async(e)=>{
        addPopup.style.display = "block"
    })

    cancelAddButton.addEventListener("click", async() => {
        divErrorSelect.innerText = ''
        divErrorQty.innerText = ''
        addPopup.style.display = "none"
    })

    cancelDeleteButton.addEventListener("click", async() => {
        deletePopup.style.display = "none"
    })

    cancelEditButton.addEventListener("click", async() => {
        editPopup.style.display = "none"
        divErrorItemQty.innerText = ''
        divErrorItemFob.innerText = ''
    })

    cancelConfirmButton.addEventListener("click", async() => {
        confirmPopup.style.display = "none"
    })

    confirmAddButton.addEventListener("click", async() => {
        
        counter += 1

        var idItem = document.getElementById('item')
        var inputQuantity = document.getElementById('quantity')

        if (idItem.value == 'default') {
            divErrorSelect.innerText = 'Seleccione un item'
        }else{
            divErrorSelect.innerText = ''
        }

        if (inputQuantity.value == '') {
            divErrorQty.innerText = 'Complete la cantidad'
        }else{
            divErrorQty.innerText = ''
        }

        if (inputQuantity.value!= '' && idItem.value != 'default') {
            const filterItem = supplierItems.filter(item => item.id == idItem.value)
            const item = filterItem[0]
            const muQuantity = document.getElementById('quantity').value
            const fobSupplierCurrency = (parseFloat(item.fob_supplier_currency,4)).toFixed(3)
            
            //new item data
            const newItem = createPoItemData(item,counter,muQuantity,fobSupplierCurrency)

            poData.push(newItem)

            //create table with data
            createPoTable(newItem)

            //add delete and edit listeners
            createPoListeners(poData)

            //complete data inputs
            createPoInputsData(poData,currency)

            addPopup.style.display = "none"
            idItem.value = 'default'
            inputQuantity.value = ''
            divErrorSelect.innerText = ''
            divErrorQty.innerText = ''
        }
    })

    confirmDeleteButton.addEventListener("click", async() => {
        const rowToDelete = document.getElementById('rowToDelete').value
        poData = poData.filter(item => item.counter != rowToDelete)
        body.innerHTML = ''

        //create table with data
        poData.forEach(item => {
            createPoTable(item)
        })

        //add delete and edit listeners
        createPoListeners(poData,rowToDelete,itemToDeleteInput,deletePopup)

        //complete data inputs
        createPoInputsData(poData,currency)

        deletePopup.style.display = "none"
    })

    confirmEditButton.addEventListener("click", async() => {

        const itemToEdit = document.getElementById('editInputItem').value        
        const rowToEdit = document.getElementById('rowToEdit').value

        if (document.getElementById('editInputQuantity').value == '') {
            divErrorItemQty.innerText = 'Complete cantidad'
        }else{
            divErrorItemQty.innerText = ''
        }

        if (document.getElementById('editInputFob').value == '') {
            divErrorItemFob.innerText = 'Complete Fob'
        }else{
            divErrorItemFob.innerText = ''
        }

        if (document.getElementById('editInputQuantity').value != '' && document.getElementById('editInputFob').value != '') {
            const filterItem = supplierItems.filter(item => item.item == itemToEdit)
            const item = filterItem[0]        

            //editItem
            for (let i = 0; i < poData.length; i++) {
                if (poData[i].counter == rowToEdit) {
                    const muQuantity = parseFloat(document.getElementById('editInputQuantity').value,2)
                    const fobSupplierCurrency = parseFloat(document.getElementById('editInputFob').value,2)
                    const unitsQuantity = item.price_list_mu.units_per_um * muQuantity
                    poData[i].mu_quantity = muQuantity
                    poData[i].units_quantity = unitsQuantity
                    poData[i].boxes = (parseFloat(muQuantity / poData[i].mu_per_box,2)).toFixed(2)
                    poData[i].total_weight_kg = (parseFloat(item.weight_kg * (muQuantity / poData[i].mu_per_box),2)).toFixed(2)
                    poData[i].total_volume_m3 = (parseFloat(item.volume_m3 * (muQuantity / poData[i].mu_per_box),2)).toFixed(2)
                    poData[i].fob_supplier_currency = parseFloat(fobSupplierCurrency,2)
                    poData[i].total_fob_supplier_currency = (parseFloat(fobSupplierCurrency * muQuantity,2)).toFixed(2)
                    break 
                }            
            }

            body.innerHTML = ''

            //create table with data
            poData.forEach(item => {
                createPoTable(item)
            })

            //add delete and edit listeners
            createPoListeners(poData)

            //complete data inputs
            createPoInputsData(poData,currency)

            editPopup.style.display = "none"
        }

        
    })

    savePo.addEventListener("click", async() => {

        const purchaseOrder = document.getElementById('purchaseOrder').value

        if (process == 'edit') {
            confirmText.innerHTML = "¿Confirma que desea guardar los cambios en la OC <b>" + purchaseOrder + '</b>?'
        }else{
            confirmText.innerHTML = "¿Confirma que desea guardar la OC <b>" + purchaseOrder + '</b>?'
        }        
        confirmPopup.style.display = "block"
    })

    confirmButton.addEventListener("click", async() => {

        const purchaseOrder = document.getElementById('purchaseOrder').value
        const poNumber = parseInt(purchaseOrder.split('.')[1])
        const date = new Date()
        const idCurrency = supplier.supplier_currency.id

        const poInfo = createPoInputsData(poData,currency)

        const data = {
            'purchaseOrder':purchaseOrder,
            'poNumber':poNumber,
            'date':date,
            'idBrunch':idBrunch,
            'idSupplier':idSupplier,
            'idCurrency':idCurrency,
            'poFobSupplierCurrency':parseFloat(poInfo.poFobSupplierCurrency,2),
            'poWeight':parseFloat(poInfo.poWeight,2),
            'poVolume':parseFloat(poInfo.poVolume,2),
            'poBoxes':parseFloat(poInfo.poBoxes,2),
            'poData':poData
        }

        await fetch(dominio + 'apis/create-purchase-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        window.location.href = '/imports/' + idBrunch + '/imports-data'

    })

    addPopup.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.code === "Enter") {
          confirmAddButton.click()
        }
    })

    purchaseOrder.addEventListener("change", async(e) => {
        const po = purchaseOrder.value
        const error1 = po.substring(0, 3) != (brunch.pos_suffix + '.')
        const error2 = po.length != 8
        const error3 = po[5] != '.'
        const error4 = await (await fetch(dominio + 'apis/filter-purchase-order/' + po)).json() != null

        if (error1) {
            divErrorPoNumber.innerText = 'El número de OC debe comenzar con "' + brunch.pos_suffix + '."'    
            purchaseOrder.classList.add('aIsInvalid')
        }else{
            if (error2) {
                divErrorPoNumber.innerText = 'El número de OC debe tener 8 caracteres'    
                purchaseOrder.classList.add('aIsInvalid')
            }else{
                if (error3) {
                    divErrorPoNumber.innerText = 'Formato de OC incorrecto (XX.XX.XX)'    
                    purchaseOrder.classList.add('aIsInvalid')
                }else{
                    if (error4) {
                        divErrorPoNumber.innerText = 'Ya existe la OC ' + po    
                        purchaseOrder.classList.add('aIsInvalid')
                    }else{
                        if (!(error1||error2||error3||error4)) {
                            divErrorPoNumber.innerText = ''    
                            purchaseOrder.classList.remove('aIsInvalid')
                        }
                    }
                }
            }
            savePo.addEventListener("click", async() => {

                const purchaseOrder = document.getElementById('purchaseOrder').value

                if(error1||error2||error3||error4){                    
                    confirmPopup.style.display = "none"
                }else{
                    if (process == 'edit') {
                        confirmText.innerHTML = "¿Confirma que desea guardar los cambios en la OC <b>" + purchaseOrder + '</b>?'
                    }else{
                        confirmText.innerHTML = "¿Confirma que desea guardar la OC <b>" + purchaseOrder + '</b>?'
                    }        
                    confirmPopup.style.display = "block"
                }
            })
        }
    })

    purchaseOrder.addEventListener("keydown", function(event) {
        if (event.key === "Enter" || event.code === "Enter") {
          event.preventDefault()
        }
    })
})


