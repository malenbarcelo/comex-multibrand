import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

    const selectSupplier = document.getElementById('selectSupplier')
    const priceListTable = document.getElementById('priceListTable')
    const idBrunch = document.getElementById('idBrunch').innerText
    const brunch = document.getElementById('brunch').innerText
    const addPriceList = document.getElementById('addPriceList')
    const alert = document.getElementById('alert')
    const priceListBody = document.getElementById('priceListBody')
    const hrefCreateItem = document.getElementById('hrefCreateItem')
    const hrefDownloadPriceList = document.getElementById('hrefDownloadPriceList')
    const formUploadList2 = document.getElementById('formUploadList2')
    const priceCurrency = document.getElementById('priceCurrency')
    const uploadPriceList = document.getElementById('uploadPriceList')
    const uploadFirstList = document.getElementById('uploadFirstList')
    const suppliers = await (await fetch(dominio + 'apis/suppliers')).json()

    //confirmPopup
    const confirmPopup = document.getElementById('confirmPopup')
    const cancelButton = document.getElementById('cancelButton')
    const confirmButton = document.getElementById('confirmButton')
    const confirmText = document.getElementById('confirmText')
    const formDeleteItem = document.getElementById('formDeleteItem')

    //newPriceList popup
    const newPriceList = document.getElementById('newPriceList')
    const cancelButton3 = document.getElementById('cancelButton3')

    selectSupplier.addEventListener("change",async(e)=>{

        const supplier = selectSupplier.value

        const supplierData = suppliers.filter(element => element.id == supplier)
        const currency = supplierData[0].supplier_currency.currency

        priceCurrency.innerText = 'Precio UM (' + currency + ')'
        
        const selectedOption = (e.target.options[e.target.selectedIndex]).innerText

        hrefCreateItem.href = '/data/' + idBrunch + '/create-item/' + supplier

        hrefDownloadPriceList.href = '/data/' + idBrunch + '/download-price-list/' + supplier
        
        if (supplier == 'default') {
            priceListTable.classList.add('aNotVisible')
            addPriceList.classList.add('aNotVisible')
        }else{
            const supplierPriceList = await (await fetch(dominio + 'apis/' + idBrunch + '/price-list/' + supplier)).json()

            if (supplierPriceList.length == 0) {
                addPriceList.classList.remove('aNotVisible')
                priceListTable.classList.add('aNotVisible')
                alert.innerHTML = '<div class="divAlertMessage"><i class="fa-solid fa-triangle-exclamation iAlert"></i><div class="textAlert">No existe una lista de precios para el proveedor ' + selectedOption + ' en Multibrand ' + brunch + '</div></div>'


            }else{                
                addPriceList.classList.add('aNotVisible')
                priceListTable.classList.remove('aNotVisible')
                priceListBody.innerHTML = ''
                
                for (let i = 0; i < supplierPriceList.length; i++) {

                    //create table
                    var has_breaks = 'no'

                    if (supplierPriceList[i].has_breaks == 1) {
                        has_breaks = 'si'
                    }

                    const item = '<th class="aTh2">' + supplierPriceList[i].item + '</th>'
                    const description = '<th class="aTh2">' + supplierPriceList[i].description + '</th>'
                    const mu = '<th class="aTh2">' + supplierPriceList[i].price_list_mu.measurement_unit + '</th>'
                    const muPerBox = '<th class="aTh2">' + supplierPriceList[i].mu_per_box + '</th>'
                    let weight = supplierPriceList[i].weight_kg == null ? 0.00 : supplierPriceList[i].weight_kg
                    weight = '<th class="aTh2">' + parseFloat(weight,2) + '</th>'
                    let volume = supplierPriceList[i].volume_m3 == null ? 0.00 : supplierPriceList[i].volume_m3
                    volume = '<th class="aTh2">' + parseFloat(volume,4) + '</th>'
                    const fob = '<th class="aTh2">' + parseFloat(supplierPriceList[i].fob,3) + '</th>'
                    const brand = '<th class="aTh2">' + supplierPriceList[i].brand + '</th>'
                    const origin = '<th class="aTh2">' + supplierPriceList[i].origin + '</th>'
                    const costCalculation = '<th class="aTh2">' + supplierPriceList[i].cost_calculation + '</th>'
                    const hasBreaks = '<th class="aTh2">' + has_breaks + '</th>'
                    const editItem = '<th class="aTh2"><a href="/data/' + idBrunch + '/edit-item/' + supplierPriceList[i].id +'"><i class="fa-regular fa-pen-to-square aEdit1"></a></i></th>'
                    const deleteItem = '<th class="aTh2"><i class="fa-regular fa-trash-can aEdit1" id="deleteItem_' + supplierPriceList[i].id + '"></i></th>'
                    priceListBody.innerHTML += '<tr>' + item + description + mu + muPerBox + weight + volume + fob + brand + origin + costCalculation + hasBreaks + editItem + deleteItem + '</tr>'
                }

                

                supplierPriceList.forEach(item => {

                    const deleteItem = document.getElementById('deleteItem_' + item.id)

                    deleteItem.addEventListener("click",async(e)=>{
                        
                        confirmText.innerHTML ='¿Confirma que desea eliminar el item <b>' + item.item + ' </b>de<b> ' + selectedOption +'</b>?'
                        
                        cancelButton.addEventListener("click", async() => {
                            confirmPopup.style.display = "none"
                        })

                        formDeleteItem.action = '/data/' + idBrunch + '/delete-item/' + supplier + '/' + item.id

                        /*confirmButton.addEventListener("click", async() => {
                            console.log(confirmButton)
                            await fetch(dominio + 'apis/delete-item/' + item.id,{method:'DELETE'})
                            window.location.href = '/data/' + idBrunch + '/prices-lists/' + supplier
                        })*/
                
                        //Show popup
                        confirmPopup.style.display = "block"
                        
                    })
                })
            }
        }
        uploadPriceList.addEventListener("click",async(e)=>{
            const newListSupplier = document.getElementById('newListSupplier')
            newListSupplier.innerText = supplierData[0].supplier
            newPriceList.style.display = "block"
            formUploadList2.action = '/data/' + idBrunch + '/upload-price-list/' + supplier            
        })
        uploadFirstList.addEventListener("click",async(e)=>{
            const newListSupplier = document.getElementById('newListSupplier')
            newListSupplier.innerText = supplierData[0].supplier
            newPriceList.style.display = "block"
            formUploadList2.action = '/data/' + idBrunch + '/upload-price-list/' + supplier            
        })         
    })

    cancelButton3.addEventListener("click",async(e)=>{
        const file3 = document.getElementById('file3') 
        const error3 = document.getElementById('error3')       
        file3.classList.remove('aIsInvalid')
        error3.innerHTML = ''
        newPriceList.style.display = "none"
    })

    //if I already have a supplier selected, show prices list table
    if (selectSupplier.value != 'default') {
        selectSupplier.value = selectSupplier.value
        const changeEvent = new Event("change")
        selectSupplier.dispatchEvent(changeEvent)
    }
})



