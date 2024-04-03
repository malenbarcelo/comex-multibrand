import { dominio } from "../../dominio.js"
import globals from "./globals.js"

function receptionGetElements() {

    //data inputs
    const receptionDate = document.getElementById('receptionDate')
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
    const inputs = {receptionDate, currencyExchange,freight,insurance,forwarder,domesticFreight,dispatchExpenses,officeFees,containerCosts,portExpenses,dutiesTarifs,containerInsurance,portContribution,otherExpenses}

    //calculated inputs
    const fobSupplierCurrencyInput = document.getElementById('fobSupplierCurrencyInput')
    const fobLocalCurrencyInput = document.getElementById('fobLocalCurrencyInput')
    const cifInput = document.getElementById('cifInput')
    const totalExpenseInput = document.getElementById('totalExpenseInput')
    const totalCostInput = document.getElementById('totalCostInput')
    const volumeExpenseInput = document.getElementById('volumeExpenseInput')
    const priceExpenseInput = document.getElementById('priceExpenseInput')
    const totalVolumeM3Input = document.getElementById('totalVolumeM3Input')
    const calculations = {fobSupplierCurrencyInput,fobLocalCurrencyInput,cifInput,totalExpenseInput,totalCostInput,volumeExpenseInput,priceExpenseInput,totalVolumeM3Input}

    //other elements
    const supplierReceive = document.getElementById('supplierReceive')
    const purchaseOrderReceive = document.getElementById('purchaseOrderReceive')
    const fobSupplierCurrencyLabel = document.getElementById('fobSupplierCurrencyLabel')
    const fobLocalCurrencyLabel = document.getElementById('fobLocalCurrencyLabel')
    const cifLabel = document.getElementById('cifLabel')
    const totalExpenseLabel = document.getElementById('totalExpenseLabel')
    const totalCostLabel = document.getElementById('totalCostLabel')
    const volumeExpenseLabel = document.getElementById('volumeExpenseLabel')
    const priceExpenseLabel = document.getElementById('priceExpenseLabel')
    const totalVolumeM3Label = document.getElementById('totalVolumeM3Label')
    const receiveImportSubtitle = document.getElementById('receiveImportSubtitle')
    const costCalculationTitle = document.getElementById('costCalculationTitle')
    const elements = {supplierReceive,purchaseOrderReceive, fobSupplierCurrencyLabel, fobLocalCurrencyLabel, cifLabel, totalExpenseLabel, totalCostLabel, volumeExpenseLabel, priceExpenseLabel, totalVolumeM3Label, receiveImportSubtitle,costCalculationTitle}

    return { inputs , calculations , elements}
}

function receptionCompleteInputs(importData,brunchData,formatOptions) {

    //get elements
    const { inputs , calculations, elements } = receptionGetElements()

    //complete elements
    elements.supplierReceive.innerText = importData.purchase_order_supplier.supplier
    elements.purchaseOrderReceive.innerText = importData.purchase_order
    elements.fobSupplierCurrencyLabel.innerHTML = '<b>FOB (' + importData.purchase_order_currency.currency + ')</b>'
    elements.fobLocalCurrencyLabel.innerHTML = '<b>FOB (' + brunchData.brunch_currency.currency + ')</b>'
    elements.cifLabel.innerHTML = '<b>CIF (' + brunchData.brunch_currency.currency + ')</b>'
    elements.totalExpenseLabel.innerHTML = '<b>Gastos totales (' + brunchData.brunch_currency.currency + ')</b>'
    elements.totalCostLabel.innerHTML = '<b>Costos totales (' + brunchData.brunch_currency.currency + ')</b>'
    elements.volumeExpenseLabel.innerHTML = '<b>Gastos por volumen (' + brunchData.brunch_currency.currency + ')</b>'
    elements.priceExpenseLabel.innerHTML = '<b>Gastos por precio (' + brunchData.brunch_currency.currency + ')</b>'
    elements.totalVolumeM3Label.innerHTML = '<b>Volumen total m3 (' + brunchData.brunch_currency.currency + ')</b>'
    elements.receiveImportSubtitle.innerHTML = 'Ingresar valores en moneda local (' + brunchData.brunch_currency.currency + ')'
    elements.costCalculationTitle.innerHTML = importData.cost_calculation == 'Volumen' ? 'Costeo por volumen' : 'Costeo por prorrateo simple'

    //complete inputs data
    inputs.currencyExchange.value = importData.exchange_rate == null ? '' : parseFloat(importData.exchange_rate,2)
    inputs.freight.value = importData.freight_local_currency == null ? '' : parseFloat(importData.freight_local_currency,2)
    inputs.insurance.value = importData.insurance_local_currency == null ? '' : parseFloat(importData.insurance_local_currency,2)
    inputs.forwarder.value = importData.forwarder_local_currency == null ? '' : parseFloat(importData.forwarder_local_currency,2)
    inputs.domesticFreight.value = importData.domestic_freight_local_currency == null ? '' : parseFloat(importData.domestic_freight_local_currency,2)
    inputs.dispatchExpenses.value = importData.dispatch_expenses_local_currency == null ? '' : parseFloat(importData.dispatch_expenses_local_currency,2)
    inputs.officeFees.value = importData.office_fees_local_currency == null ? '' : parseFloat(importData.office_fees_local_currency,2)
    inputs. containerCosts.value = importData.container_costs_local_currency == null ? '' : parseFloat(importData.container_costs_local_currency,2)
    inputs.portExpenses.value = importData.port_expenses_local_currency == null ? '' : parseFloat(importData.port_expenses_local_currency,2)
    inputs.dutiesTarifs.value = importData.duties_tarifs_local_currency == null ? '' : parseFloat(importData.duties_tarifs_local_currency,2)
    inputs.containerInsurance.value = importData.container_insurance_local_currency == null ? '' : parseFloat(importData.container_insurance_local_currency,2)
    inputs.portContribution.value = importData.port_contribution_local_currency == null ? '' : parseFloat(importData.port_contribution_local_currency,2)
    inputs.otherExpenses.value = importData.other_expenses_local_currency == null ? '' : parseFloat(importData.other_expenses_local_currency,2)
    inputs.receptionDate.value = importData.reception_date

     //hide elements if necessary
     if (importData.purchase_order_supplier.cost_calculation == 'Factor') {
        calculations.totalVolumeM3Input.style.display = 'none'
        elements.totalVolumeM3Label.style.display = 'none'
        calculations.volumeExpenseInput.style.display = 'none'
        elements.volumeExpenseLabel.style.display = 'none'
        calculations.priceExpenseInput.style.display = 'none'
        elements.priceExpenseLabel.style.display = 'none'
     }

    return {inputs, calculations, elements}

}

async function receptionCalculateCosts(importData,process,formatOptions) {

    const {inputs, calculations, elements} = receptionGetElements()

    //get inputs data
    const currencyExchangeValue = parseFloat(inputs.currencyExchange.value == '' ? 0 : inputs.currencyExchange.value,2)
    const freightValue = parseFloat(inputs.freight.value == '' ? 0 : inputs.freight.value,2)
    const insuranceValue = parseFloat(inputs.insurance.value == '' ? 0 : inputs.insurance.value,2)
    const forwarderValue = parseFloat(inputs.forwarder.value == '' ? 0 : inputs.forwarder.value,2)
    const domesticFreightValue = parseFloat(inputs.domesticFreight.value == '' ? 0 : inputs.domesticFreight.value,2)
    const dispatchExpensesValue = parseFloat(inputs.dispatchExpenses.value == '' ? 0 : inputs.dispatchExpenses.value,2)
    const officeFeesValue = parseFloat(inputs.officeFees.value == '' ? 0 : inputs.officeFees.value,2)
    const containerCostsValue = parseFloat(inputs.containerCosts.value == '' ? 0 : inputs.containerCosts.value,2)
    const portExpensesValue = parseFloat(inputs.portExpenses.value == '' ? 0 : inputs.portExpenses.value,2)
    const dutiesTarifsValue = parseFloat(inputs.dutiesTarifs.value == '' ? 0 : inputs.dutiesTarifs.value,2)
    const containerInsuranceValue = parseFloat(inputs.containerInsurance.value == '' ? 0 : inputs.containerInsurance.value,2)
    const portContributionValue = parseFloat(inputs.portContribution.value == '' ? 0 : inputs.portContribution.value,2)
    const otherExpensesValue = parseFloat(inputs.otherExpenses.value == '' ? 0 : inputs.otherExpenses.value,2)

    //calculate costs
    const fobLocalCurrency = importData.total_fob_supplier_currency * currencyExchangeValue
    const cif = fobLocalCurrency + freightValue + insuranceValue
    const totalExpense = freightValue + insuranceValue + forwarderValue + domesticFreightValue + dispatchExpensesValue + officeFeesValue + containerCostsValue + portExpensesValue + dutiesTarifsValue + containerInsuranceValue + portContributionValue + otherExpensesValue
    const totalCost = fobLocalCurrency + totalExpense
    const volumeExpense = forwarderValue + domesticFreightValue + portExpensesValue + containerInsuranceValue + portContributionValue+ otherExpensesValue
    const priceExpense = dispatchExpensesValue + officeFeesValue

    //complete inputs
    calculations.fobSupplierCurrencyInput.value = importData.total_fob_supplier_currency.toLocaleString(undefined,formatOptions)
    calculations.fobLocalCurrencyInput.value = fobLocalCurrency.toLocaleString(undefined,formatOptions)
    calculations.cifInput.value = cif.toLocaleString(undefined,formatOptions)
    calculations.totalExpenseInput.value = totalExpense.toLocaleString(undefined,formatOptions)
    calculations.totalCostInput.value = totalCost.toLocaleString(undefined,formatOptions)
    calculations.volumeExpenseInput.value = volumeExpense.toLocaleString(undefined,formatOptions)
    calculations.priceExpenseInput.value = priceExpense.toLocaleString(undefined,formatOptions)
    calculations.totalVolumeM3Input.value = importData.total_volume_m3.toLocaleString(undefined,formatOptions)

    let details = []
    let alertCounter = 0

    /////If process = 'acceptReception' get items details, otherwise only complete purchase order data
    
    if (process == 'acceptReception') {

        //get data to save reception (purchase_orders_details table)
        details = await (await fetch(dominio + 'apis/purchase-order-details/' + importData.purchase_order)).json()

        let cifItemsThatPay = 0
        const totalVolume = importData.total_volume_m3
        const costCalculations = importData.cost_calculation
        let itemProportion = 0

        //if dutiesTarifsValues != 0 display alert
        let itemsThatPay = 0

        details.forEach(item => {
            if (item.pays_duties_tarifs == 'si') {
                itemsThatPay +=1
            }
        })

        if (itemsThatPay == 0 && inputs.dutiesTarifs.value != 0 && inputs.dutiesTarifs.value != '') {

            alertCounter +=1

            globals.alertText.innerHTML = '<div>Debe seleccionar en la orden de compra qué items pagan arancel.</div>'

            globals.alertPopup.style.display = 'block'

            globals.acceptAlertButton.addEventListener("click", async() => {
                globals.alertPopup.style.display = 'none'
            })

        }

        //get item fob, cif and cifItemsThatPay duties_tarfis'
        details.forEach(item => {

            const itemVolume = item.total_volume_m3 
            const itemFobLocalCurrency = item.total_fob_supplier_currency * parseFloat(currencyExchangeValue,2)
            itemProportion = itemFobLocalCurrency / fobLocalCurrency
            const itemFreightAndInsurance = costCalculations == 'Volumen' ? (freightValue + insuranceValue) / totalVolume * itemVolume : itemProportion * (freightValue + insuranceValue)
            const itemCifLocalCurrency = itemFreightAndInsurance + itemFobLocalCurrency
    
            item.total_fob_local_currency = itemFobLocalCurrency
            item.freight_and_insurance_local_currency = itemFreightAndInsurance
            item.cif_local_currency = itemCifLocalCurrency
    
            if (item.pays_duties_tarifs == "si") {
                cifItemsThatPay += itemCifLocalCurrency
            }
        })
    
        //get other item data
        details.forEach(item => {

            itemProportion = item.total_fob_local_currency / fobLocalCurrency
            
            const itemDutiesTarifs = item.pays_duties_tarifs == "si" ? (item.cif_local_currency / cifItemsThatPay) * dutiesTarifsValue : 0
            const itemVolumeExpense = costCalculations == 'Volumen' ? (volumeExpense / totalVolume * item.total_volume_m3) : null
            const itemPriceExpense = costCalculations == 'Volumen' ? (priceExpense / cif * item.cif_local_currency) : null
            const itemTotalExpense = costCalculations == 'Volumen' ? item.freight_and_insurance_local_currency + itemVolumeExpense + itemPriceExpense + itemDutiesTarifs : itemProportion * (totalExpense - dutiesTarifsValue) + itemDutiesTarifs //not every item pay dutiesTarifs
    
            item.fob_local_currency = item.total_fob_local_currency * currencyExchangeValue
            item.duties_tarifs_local_currency = itemDutiesTarifs
            item.total_volume_expense_local_currency = costCalculations == 'Volumen' ? itemVolumeExpense : null
            item.total_price_expense_local_currency =  costCalculations == 'Volumen' ? itemPriceExpense : null
            item.total_expense_local_currency =  itemTotalExpense
            item.total_cost_local_currency = item.total_fob_local_currency + itemTotalExpense
            item.unit_cost_local_currency = item.total_cost_local_currency / item.units_quantity
            item.unit_cost_supplier_currency = item.unit_cost_local_currency / currencyExchangeValue
    
        })
    }

    //get data to save reception (purchase_orders table)
    const data = {
        'purchase_order':elements.purchaseOrderReceive.innerText,
        'reception_date':inputs.receptionDate.value == '' ? null : inputs.receptionDate.value,
        'exchange_rate':currencyExchangeValue,
        'total_fob_local_currency': fobLocalCurrency,
        'freight_local_currency':freightValue,
        'insurance_local_currency':insuranceValue,
        'cif_local_currency':cif,
        'forwarder_local_currency':forwarderValue,
        'domestic_freight_local_currency':domesticFreightValue,
        'dispatch_expenses_local_currency':dispatchExpensesValue,
        'office_fees_local_currency':officeFeesValue,
        'container_costs_local_currency':containerCostsValue,
        'port_expenses_local_currency':portExpensesValue,
        'duties_tarifs_local_currency':dutiesTarifsValue,
        'container_insurance_local_currency':containerInsuranceValue,
        'port_contribution_local_currency':portContributionValue,
        'other_expenses_local_currency':otherExpensesValue,
        'total_expenses_local_currency':totalExpense,
        'total_costs_local_currency':totalCost,
        'total_volume_expense':volumeExpense,
        'total_price_expense':priceExpense,
        'cost_vs_fob':process == 'saveReceptionData' ? null : totalCost / fobLocalCurrency - 1,
        'cost_calculation': importData.cost_calculation,
        'status': process == 'saveReceptionData' ? 'En recepción' : 'Recibida',
        'details': details
    }

    return {data,alertCounter}

}

function receiveIsInvalid(errorLabel, input) {

    errorLabel.classList.add('errorColor')
    input.classList.add('isInvalid')

}

function receiveIsValid(errorText, errorLabel, input) {

    errorText.innerText = ''
    errorLabel.classList.remove('errorColor')
    input.classList.remove('isInvalid')
    
}

export { receptionCompleteInputs, receptionCalculateCosts, receptionGetElements, receiveIsInvalid, receiveIsValid }