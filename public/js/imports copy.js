import { dominio } from "./dominio.js"
import { calculateCosts } from "./functions/imports/receiveImportCalculateCosts.js"

window.addEventListener('load',async()=>{

    const createPO = document.getElementById('createPO')
    const idBrunch = document.getElementById('idBrunch').innerText
    const filterPo = document.getElementById('filterPo')
    const closeImportsPopupReceive = document.getElementById('closeImportsPopupReceive')
    const closeImportsPopupEdit = document.getElementById('closeImportsPopupEdit')
    const brunchPos = await (await fetch(dominio + 'apis/' + idBrunch + '/purchase-orders')).json()
    const brunchData = await (await fetch(dominio + 'apis/' + idBrunch + '/filter-brunch')).json()

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
        const receiveImport = document.getElementById('receiveImport_' + idPO)
        const receiveImportPopup = document.getElementById('receiveImportPopup')

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
        if (receiveImport != null) {

            receiveImport.addEventListener("click", async() => {
                //general
                const receptionDate = document.getElementById('receptionDate')
                const cancelReception = document.getElementById('cancelReception')

                //complete PO data
                const supplierReceive = document.getElementById('supplierReceive')
                const purchaseOrderReceive = document.getElementById('purchaseOrderReceive')
                const pencilEditPo =  document.getElementById('pencilEditPo')
                const fobSupplierCurrencyLabel = document.getElementById('fobSupplierCurrencyLabel')
                const fobLocalCurrencyLabel = document.getElementById('fobLocalCurrencyLabel')
                const cifLabel = document.getElementById('cifLabel')
                const totalExpenseLabel = document.getElementById('totalExpenseLabel')
                const totalCostLabel = document.getElementById('totalCostLabel')
                const volumeExpenseLabel = document.getElementById('volumeExpenseLabel')
                const priceExpenseLabel = document.getElementById('priceExpenseLabel')
                const totalVolumeM3Label = document.getElementById('totalVolumeM3Label')
                const receiveImportSubtitle = document.getElementById('receiveImportSubtitle')

                supplierReceive.innerText = brunchPos[i].purchase_order_supplier.supplier
                purchaseOrderReceive.innerText = brunchPos[i].purchase_order
                fobSupplierCurrencyLabel.innerHTML = '<b>FOB (' + brunchPos[i].purchase_order_currency.currency + ')</b>'
                fobLocalCurrencyLabel.innerHTML = '<b>FOB (' + brunchData.brunch_currency.currency + ')</b>'
                cifLabel.innerHTML = '<b>CIF (' + brunchData.brunch_currency.currency + ')</b>'
                totalExpenseLabel.innerHTML = '<b>Gastos por volumen (' + brunchData.brunch_currency.currency + ')</b>'
                totalCostLabel.innerHTML = '<b>Gastos por volumen (' + brunchData.brunch_currency.currency + ')</b>'                
                volumeExpenseLabel.innerHTML = '<b>Gastos por volumen (' + brunchData.brunch_currency.currency + ')</b>'
                priceExpenseLabel.innerHTML = '<b>Gastos por precio (' + brunchData.brunch_currency.currency + ')</b>'
                totalVolumeM3Label.innerHTML = '<b>Volumen total m3 (' + brunchData.brunch_currency.currency + ')</b>'
                receiveImportSubtitle.innerHTML = 'Ingresar valores en moneda local (' + brunchData.brunch_currency.currency + ')'

                //inputs
                const currencyExchange = document.getElementById('currencyExchange')
                const freight = document.getElementById('freight')
                const insurance = document.getElementById('insurance')
                const forwarder = document.getElementById('forwarder')
                const domesticFreight = document.getElementById('domesticFreight')
                const dispatchExpenses = document.getElementById('dispatchExpenses')
                const officeFees = document.getElementById('officeFees')
                const containerCosts = document.getElementById('containerCosts')
                const portExpenses = document.getElementById('portExpenses')
                const dutiesTarifs = document.getElementById('dutiesTarifs')
                const containerInsurance = document.getElementById('containerInsurance')
                const portContribution = document.getElementById('portContribution')
                const otherExpenses = document.getElementById('otherExpenses')
                const inputs = {currencyExchange,freight,insurance,forwarder,domesticFreight,dispatchExpenses,officeFees,containerCosts,portExpenses,dutiesTarifs,containerInsurance,portContribution,otherExpenses}

                //calculated imputs
                const fobSupplierCurrencyInput = document.getElementById('fobSupplierCurrencyInput')
                const fobLocalCurrencyInput = document.getElementById('fobLocalCurrencyInput')
                const cifInput = document.getElementById('cifInput')
                const totalExpenseInput = document.getElementById('totalExpenseInput')
                const totalCostInput = document.getElementById('totalCostInput')
                const volumeExpenseInput = document.getElementById('volumeExpenseInput')
                const priceExpenseInput = document.getElementById('priceExpenseInput')
                const totalVolumeM3Input = document.getElementById('totalVolumeM3Input')
                const calculations = {fobSupplierCurrencyInput,fobLocalCurrencyInput,cifInput,totalExpenseInput,totalCostInput,volumeExpenseInput,priceExpenseInput,totalVolumeM3Input}

                //import data
                const totalFob = brunchPos[i].total_fob_supplier_currency
                const supplierCurrency = brunchPos[i].purchase_order_currency.currency
                const brunchCurrency = brunchData.brunch_currency.currency
                const importData = {totalFob,supplierCurrency,brunchCurrency}

                //complete data
                calculateCosts(inputs,calculations,importData)

                //show popup
                receiveImportPopup.scrollTop = 0
                receiveImportPopup.style.display = "block"

                //add event listeners to every input
                for (const key in inputs) {
                    const inputElement = inputs[key]
                    inputElement.addEventListener("change", async() => {
                        calculateCosts(inputs,calculations,importData)
                    })
                }

                //add event listeners to edit PO
                pencilEditPo.addEventListener("click", async() => {
                    editImportPopup.style.display = "block"
                })

                //cancel reception
                cancelReception.addEventListener("click", async() => {
                    receiveImportPopup.style.display = "none"
                })



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

    closeImportsPopupReceive.addEventListener("click", async() => {
        receiveImportPopup.style.display = "none"
    })

    closeImportsPopupEdit.addEventListener("click", async() => {
        editImportPopup.style.display = "none"
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




