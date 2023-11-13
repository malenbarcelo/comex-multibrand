import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

    const createPO = document.getElementById('createPO')
    const idBrunch = document.getElementById('idBrunch').innerText
    const filterPo = document.getElementById('filterPo')
    const brunchPos = await (await fetch(dominio + 'apis/' + idBrunch + '/purchase-orders')).json()
    
    //selectPopup
    const selectPopup = document.getElementById('selectPopup')
    const cancelButton = document.getElementById('cancelButton')
    const confirmButton = document.getElementById('confirmButton')
    const selectText = document.getElementById('selectText')
    const selectInputs = document.getElementById('selectInputs')
    const divError = document.getElementById('divError')

    //showPricesPopup
    const showPricesPopup = document.getElementById('showPricesPopup')
    const yesButton = document.getElementById('yesButton')
    const noButton = document.getElementById('noButton')
    const cancelPrintButton = document.getElementById('cancelPrintButton')

    createPO.addEventListener("click",async(e)=>{

        divError.innerText = ''
        selectText.innerHTML ='Seleccione un proveedor'
        const suppliers = await (await fetch(dominio + 'apis/suppliers')).json()
        var options = '<option value="default">---Proveedor---</option>'
        suppliers.forEach(supplier => {
            options += '<option value="' + supplier.id + '">' + supplier.supplier + '</option>'
        });
        selectInputs.innerHTML='<select name="selectSupplier" class="aSelect2" id="supplier">' + options + '</select>'
        
        cancelButton.addEventListener("click", async() => {
            divError.innerText = ''
            selectPopup.style.display = "none"
        })

        confirmButton.addEventListener("click", async() => {

            const idSupplier = document.getElementById('supplier').value

            if (idSupplier == 'default') {
                divError.innerText = 'Seleccione un proveedor'

            }else{
                window.location.href = '/imports/' + idBrunch + '/create-purchase-order/' + idSupplier
            }
        })

        //Show popup
        selectPopup.style.display = "block"        
    })

    for (let i = 0; i < brunchPos.length; i++) {
        const idPO = brunchPos[i].id
        const printPdf = document.getElementById('printPdf_' + idPO)
        const printExcel = document.getElementById('printExcel_' + idPO)
        if (printPdf != null) {
            printPdf.addEventListener("click", async() => {
                showPricesPopup.style.display = "block"
                yesButton.href = '/imports/' + idBrunch + '/print-purchase-order/' + idPO + '/1'
                noButton.href = '/imports/' + idBrunch + '/print-purchase-order/' + idPO + '/0'
            })
        }
        if (printExcel != null) {
            printExcel.addEventListener("click", async() => {
                showPricesPopup.style.display = "block"
                yesButton.href = '/imports/' + idBrunch + '/download-purchase-order/' + idPO + '/1'
                noButton.href = '/imports/' + idBrunch + '/download-purchase-order/' + idPO + '/0'
            })  
        }         
    }

    yesButton.addEventListener("click", async() => {
        showPricesPopup.style.display = "none"
    })

    noButton.addEventListener("click", async() => {
        showPricesPopup.style.display = "none"
    })

    cancelPrintButton.addEventListener("click", async() => {
        showPricesPopup.style.display = "none"
    })

    filterPo.addEventListener("click", async() => {
        const supplier = document.getElementById('selectSupplier').value == 'default' ? 0 : document.getElementById('selectSupplier').value
        const year = document.getElementById('year').value == '' ? 0 : document.getElementById('year').value
        const po = document.getElementById('po').value == '' ? 0 : document.getElementById('po').value
        const item = document.getElementById('item').value == '' ? 0 : document.getElementById('item').value

        if (supplier == 0 && year == 0 && po == 0 && item == 0) {
            window.location.href = dominio + 'imports/' + idBrunch + '/imports-data'
        }else{
            window.location.href = dominio + 'imports/' + idBrunch + '/imports-data/' + supplier + '/' + year + '/' + po + '/' + item
        }
    })
    
})


