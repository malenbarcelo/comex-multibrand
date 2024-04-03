import { dominio } from "./dominio.js"
import { clearData, isValid, isInvalid } from "./functions/generalDataFuntions.js"

window.addEventListener('load',async()=>{

    ///*----------------------pricesLists.js--------------------------------------------------*///
    const selectSupplier = document.getElementById('selectSupplier')
    const divPricesList = document.getElementById('divPricesList')
    const priceListBody = document.getElementById('priceListBody')
    const listNotFound = document.getElementById('listNotFound')
    const idBrunch = document.getElementById('idBrunch').innerText
    const idUserCategory = document.getElementById('idUserCategory').innerText
    const hrefDownloadPriceList = document.getElementById('hrefDownloadPriceList')
    const uploadPriceList = document.getElementById('uploadPriceList')
    const uploadFirstList = document.getElementById('uploadFirstList')
    const upload = [uploadFirstList, uploadPriceList]
    const suppliers = await (await fetch(dominio + 'apis/suppliers')).json()
    const newPriceList = document.getElementById('newPriceList')
    const newListClosePopup = document.getElementById('newListClosePopup')
    const deleteItemPopup = document.getElementById('deleteItemPopup')
    const deleteItemText = document.getElementById('deleteItemText')
    const deleteItemClose = document.getElementById('deleteItemClose')
    const formDeleteItem = document.getElementById('formDeleteItem')

    let supplierData = []
    let supplierPriceList = []

    //general
    const create = document.getElementById('create')
    const popup = document.getElementById('popup')
    const close = document.getElementById('close')
    const acceptCreate = document.getElementById('acceptCreate')
    let process = ''

    //inputs
    const supplierName = document.getElementById('supplierName')
    const item = document.getElementById('item')
    const description = document.getElementById('description')
    const fob = document.getElementById('fob')
    const muPerBox = document.getElementById('muPerBox')
    const weight = document.getElementById('weight')
    const volume = document.getElementById('volume')
    const brand = document.getElementById('brand')
    const origin = document.getElementById('origin')
    const inputs = [supplierName,item,description,fob,muPerBox,weight,volume,brand,origin]

    //selects
    const selectMU = document.getElementById('selectMU')
    const hasBreaks = document.getElementById('hasBreaks')
    const selects = [selectMU,hasBreaks]

    ///errors
    const itemErrorText = document.getElementById('itemErrorText')
    const descriptionErrorText = document.getElementById('descriptionErrorText')
    const fobErrorText = document.getElementById('fobErrorText')
    const selectMUErrorText = document.getElementById('selectMUErrorText')
    const muPerBoxErrorText = document.getElementById('muPerBoxErrorText')
    const weightErrorText = document.getElementById('weightErrorText')
    const volumeErrorText = document.getElementById('volumeErrorText')
    const brandErrorText = document.getElementById('brandErrorText')
    const originErrorText = document.getElementById('originErrorText')
    const hasBreaksErrorText = document.getElementById('hasBreaksErrorText')
    const errors = [itemErrorText,descriptionErrorText,fobErrorText,selectMUErrorText,muPerBoxErrorText,weightErrorText,volumeErrorText,brandErrorText,originErrorText,hasBreaksErrorText]

    //labels
    const itemLabel = document.getElementById('itemLabel')
    const descriptionLabel = document.getElementById('descriptionLabel')
    const fobLabel = document.getElementById('fobLabel')
    const selectMULabel = document.getElementById('selectMULabel')
    const muPerBoxLabel = document.getElementById('muPerBoxLabel')
    const weightLabel = document.getElementById('weightLabel')
    const volumeLabel = document.getElementById('volumeLabel')
    const brandLabel = document.getElementById('brandLabel')
    const originLabel = document.getElementById('originLabel')
    const hasBreaksLabel = document.getElementById('hasBreaksLabel')
    const labels = [itemLabel,descriptionLabel,fobLabel,selectMULabel,muPerBoxLabel,weightLabel,volumeLabel,brandLabel,originLabel,hasBreaksLabel]

    //title
    const title = document.getElementById('title')

    //select supplier event listeenr
    selectSupplier.addEventListener("change",async(e)=>{

        const supplier = selectSupplier.value
        let currency = ''

        supplierData = suppliers.filter(element => element.id == supplier)

        if (supplierData.length != 0) {
            currency = supplierData[0].supplier_currency.currency
            priceCurrency.innerText = 'Precio UM (' + currency + ')'
            hrefDownloadPriceList.href = '/data/' + idBrunch + '/download-price-list/' + supplier
        }

        if (supplier == 'default') {

            divPricesList.style.display = 'none'
            listNotFound.classList.add('notVisible')

        }else{

            supplierPriceList = await (await fetch(dominio + 'apis/' + idBrunch + '/price-list/' + supplier)).json()

            if (supplierPriceList.length == 0) {

                divPricesList.style.display = 'none'
                listNotFound.classList.remove('notVisible')

            }else{

                divPricesList.style.display = 'flex'
                listNotFound.classList.add('notVisible')

                priceListBody.innerHTML = ''

                //create table
                for (let i = 0; i < supplierPriceList.length; i++) {

                    var has_breaks = 'no'

                    if (supplierPriceList[i].has_breaks == 1) {
                        has_breaks = 'si'
                    }

                    const rowClass = i % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

                    const item = '<th class="' + rowClass + '">'  + supplierPriceList[i].item + '</th>'
                    const description = '<th class="' + rowClass + '">'  + supplierPriceList[i].description + '</th>'
                    const mu = '<th class="' + rowClass + '">'  + supplierPriceList[i].price_list_mu.measurement_unit + '</th>'
                    const muPerBox = '<th class="' + rowClass + '">'  + supplierPriceList[i].mu_per_box + '</th>'
                    let weight = supplierPriceList[i].weight_kg == null ? 0.00 : supplierPriceList[i].weight_kg
                    weight = '<th class="' + rowClass + '">'  + parseFloat(weight,2) + '</th>'
                    let volume = supplierPriceList[i].volume_m3 == null ? 0.00 : supplierPriceList[i].volume_m3
                    volume = '<th class="' + rowClass + '">'  + parseFloat(volume,4) + '</th>'
                    const fob = '<th class="' + rowClass + '">'  + parseFloat(supplierPriceList[i].fob,3) + '</th>'
                    const brand = '<th class="' + rowClass + '">'  + supplierPriceList[i].brand + '</th>'
                    const origin = '<th class="' + rowClass + '">'  + supplierPriceList[i].origin + '</th>'
                    const hasBreaks = '<th class="' + rowClass + '">'  + has_breaks + '</th>'
                    const editItem = '<th class="' + rowClass + '" id="edit_' + supplierPriceList[i].id + '"><i class="fa-regular fa-pen-to-square thIcon1"></a></i></th>'
                    const deleteItem = '<th class="' + rowClass + '" id="delete_' + supplierPriceList[i].id + '"><i class="fa-regular fa-trash-can thIcon1"></a></i></th>'

                    priceListBody.innerHTML += '<tr>' + item + description + mu + muPerBox + weight + volume + fob + brand + origin + hasBreaks + (idUserCategory == 1 ? deleteItem : '') + editItem + '</tr>'
                }

                //add event listeners to edit and delete item
                supplierPriceList.forEach(element => {

                    const edit = document.getElementById('edit_' + element.id)
                    const deleteItem = document.getElementById('delete_' + element.id)

                    edit.addEventListener("click", () => {

                        process = 'edit'
    
                        //clear data
                        clearData(inputs,errors,labels)
    
                        //compelte title
                        title.innerText = 'Editar item'
    
                        //complete inputs
                        supplierName.value = supplierData[0].supplier
                        item.value = element.item
                        item.setAttribute("readonly", "readonly")
                        description.value = element.description
                        fob.value = parseFloat(element.fob,2).toFixed(3)
                        muPerBox.value = parseFloat(element.mu_per_box,2).toFixed(3)
                        weight.value = parseFloat(element.weight_kg,2).toFixed(3)
                        volume.value = parseFloat(element.volume_m3,2).toFixed(3)
                        brand.value = element.brand
                        origin.value = element.origin
                        hasBreaks.value = element.has_breaks

                        //selects
                        const elementMu = element.id_measurement_units
                        const muToSelect = document.getElementById('mu_' + elementMu)
                        muToSelect.setAttribute("selected", "selected")

                        const elementHasBreaks = element.has_breaks
                        const hasBreaksToSelect = document.getElementById('hasBreaks_' + elementHasBreaks)
                        hasBreaksToSelect.setAttribute("selected", "selected")
    
                        //show popup
                        popup.style.display = 'block'
                    })

                    deleteItem.addEventListener("click", () => {

                        formDeleteItem.action = '/data/' + idBrunch + '/delete-item/' + supplier + '/' + element.id

                        //complete text
                        deleteItemText.innerHTML = 'Confirma que desea eliminar el item <b>' + element.item + '</b> ?'
    
                        //show popup
                        deleteItemPopup.style.display = 'block'
                    })
                    
                })
            }
        }

        upload.forEach(element => {
            element.addEventListener("click",async(e)=>{
                const newListSupplier = document.getElementById('newListSupplier')
                newListSupplier.innerText = supplierData[0].supplier

                //delete errors
                const newListFile = document.getElementById('newListFile')
                const newListError = document.getElementById('newListError')
                newListFile.classList.remove('isInvalid')
                newListError.innerHTML = ''

                //show popup
                newPriceList.style.display = "block"
                formUploadList2.action = '/data/' + idBrunch + '/upload-price-list/' + supplier
            })
        })

    })

    newListClosePopup.addEventListener("click",async(e)=>{
        newPriceList.style.display = "none"
    })

    deleteItemClose.addEventListener("click",async(e)=>{
        deleteItemPopup.style.display = "none"
    })

    //if I already have a supplier selected, show prices list table
    if (selectSupplier.value != 'default') {
        selectSupplier.value = selectSupplier.value
        const changeEvent = new Event("change")
        selectSupplier.dispatchEvent(changeEvent)
    }

    ///*----------------------CREATE ITEM POPUP--------------------------------------------------*///
    

    //------------------create item------------------//
    create.addEventListener("click", () => {

        process = 'create'

        //clear data
        clearData(inputs,errors,labels,selects)

        //complete title
        title.innerText = 'Crear item'

        //Complete supplier
        supplierName.value = supplierData[0].supplier

        //change input
        item.removeAttribute("readonly")

        //show popup
        popup.style.display = 'block'
    })

    


    //------------------close popup------------------//
    close.addEventListener("click", () => {
        popup.style.display = "none"
    })

    //------------------create-edit item popup------------------//

    acceptCreate.addEventListener("click", (event) => {

        const textsToValidate = [item,description,fob,muPerBox,weight,volume,brand,origin]
        const valuesToValidate = [fob,muPerBox,weight,volume]
        const selectsToValidate = selects

        let errors = 0

        //not empty validations
        textsToValidate.forEach(input => {
            const inputName = input.name
            const errorText = document.querySelector(`#${inputName}ErrorText`)
            const errorLabel = document.querySelector(`#${inputName}Label`)
            if (input.value == '') {
                errors += 1
                errorText.innerText = 'El campo no puede estar vacío'
                isInvalid(errorLabel, input)
            }else{
                //number validations
                if (valuesToValidate.includes(input)) {
                    if (isNaN(input.value)) {
                        errors += 1
                        errorText.innerText = 'El valor debe ser numérico. Utilice "." como separador de decimales.'
                        isInvalid(errorLabel, input)
                    }else{
                        isValid(errorText,errorLabel, input)
                    }                    
                }else{
                    //specific validations
                    const findItem = supplierPriceList.filter(element => element.item == item.value)

                    if (process == 'create') {
                        if (findItem.length > 0) {
                            errors += 1
                            itemErrorText.innerText = 'El item ingresado ya existe'
                            isInvalid(errorLabel, input)
                        }else{
                            isValid(errorText,errorLabel, input)
                            }            
                    }else{
                        isValid(errorText,errorLabel, input)
                    }                    
                }
            }
        })

        //selects validations
        selectsToValidate.forEach(input => {
            const inputName = input.name
            const errorText = document.querySelector(`#${inputName}ErrorText`)
            const errorLabel = document.querySelector(`#${inputName}Label`)
            if (input.value == 'default') {                
                errors += 1
                errorText.innerText = 'Debe seleccionar un elemento'
                isInvalid(errorLabel, input)    
            }else{
                isValid(errorText,errorLabel, input)
            }
        })

        if (errors > 0) {
            event.preventDefault()
        }
    })

})



