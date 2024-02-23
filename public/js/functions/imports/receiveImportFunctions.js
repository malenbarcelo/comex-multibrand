import { dominio } from "../../dominio.js"

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

    return {inputs, calculations, elements}

}

async function receptionCalculateCosts(importData,formatOptions) {

    const {inputs, calculations, elements} = receptionGetElements()

    //get inputs data
    const currencyExchangeValue = inputs.currencyExchange.value == '' ? 0 : inputs.currencyExchange.value
    const freightValue = inputs.freight.value == '' ? 0 : inputs.freight.value
    const insuranceValue = inputs.insurance.value == '' ? 0 : inputs.insurance.value
    const forwarderValue = inputs.forwarder.value == '' ? 0 : inputs.forwarder.value
    const domesticFreightValue = inputs.domesticFreight.value == '' ? 0 : inputs.domesticFreight.value
    const dispatchExpensesValue = inputs.dispatchExpenses.value == '' ? 0 : inputs.dispatchExpenses.value
    const officeFeesValue = inputs.officeFees.value == '' ? 0 : inputs.officeFees.value
    const containerCostsValue = inputs.containerCosts.value == '' ? 0 : inputs.containerCosts.value
    const portExpensesValue = inputs.portExpenses.value == '' ? 0 : inputs.portExpenses.value
    const dutiesTarifsValue = inputs.dutiesTarifs.value == '' ? 0 : inputs.dutiesTarifs.value
    const containerInsuranceValue = inputs.containerInsurance.value == '' ? 0 : inputs.containerInsurance.value
    const portContributionValue = inputs.portContribution.value == '' ? 0 : inputs.portContribution.value
    const otherExpensesValue = inputs.otherExpenses.value == '' ? 0 : inputs.otherExpenses.value
    
    //calculate costs
    const fobLocalCurrency = parseFloat(importData.total_fob_supplier_currency,2) * currencyExchangeValue    
    const cif = parseFloat(fobLocalCurrency) + parseFloat(freightValue) + parseFloat(insuranceValue)
    const totalExpense = parseFloat(freightValue,2) + parseFloat(insuranceValue,2) + parseFloat(forwarderValue,2) + parseFloat(domesticFreightValue,2) + parseFloat(dispatchExpensesValue,2) + parseFloat(officeFeesValue,2) + parseFloat(containerCostsValue,2) + parseFloat(portExpensesValue,2) + parseFloat(dutiesTarifsValue,2) + parseFloat(containerInsuranceValue,2) + parseFloat(portContributionValue,2) + parseFloat(otherExpensesValue,2)
    const totalCost = parseFloat(fobLocalCurrency,2) + parseFloat(totalExpense,2)
    const volumeExpense = parseFloat(forwarderValue,2) + parseFloat(domesticFreightValue,2) + parseFloat(portExpensesValue,2) + parseFloat(containerInsuranceValue,2) + parseFloat(portContributionValue,2)+ parseFloat(otherExpensesValue,2)
    const priceExpense = parseFloat(dispatchExpensesValue,2) + parseFloat(officeFeesValue,2)
    
    //complete inputs
    calculations.fobSupplierCurrencyInput.value = parseFloat(importData.total_fob_supplier_currency,2).toLocaleString(undefined,formatOptions)
    calculations.fobLocalCurrencyInput.value = parseFloat(fobLocalCurrency,2).toLocaleString(undefined,formatOptions)
    calculations.cifInput.value = parseFloat(cif,2).toLocaleString(undefined,formatOptions)
    calculations.totalExpenseInput.value = parseFloat(totalExpense,2).toLocaleString(undefined,formatOptions)
    calculations.totalCostInput.value = parseFloat(totalCost,2).toLocaleString(undefined,formatOptions)
    calculations.volumeExpenseInput.value = parseFloat(volumeExpense,2).toLocaleString(undefined,formatOptions)
    calculations.priceExpenseInput.value = parseFloat(priceExpense,2).toLocaleString(undefined,formatOptions)
    calculations.totalVolumeM3Input.value = parseFloat(importData.total_volume_m3,3).toLocaleString(undefined,formatOptions)

    //get data to save reception (purchase_orders table)
    const data = {
        'purchase_order':elements.purchaseOrderReceive.innerText,
        'reception_date':inputs.receptionDate.value,
        'exchange_rate':parseFloat(currencyExchangeValue,2),
        'total_fob_local_currency': fobLocalCurrency,
        'freight_local_currency':parseFloat(freightValue,2),
        'insurance_local_currency':parseFloat(insuranceValue,2),
        'cif_local_currency':cif,
        'forwarder_local_currency':parseFloat(forwarderValue,2),
        'domestic_freight_local_currency':parseFloat(domesticFreightValue,2),
        'dispatch_expenses_local_currency':parseFloat(dispatchExpensesValue,2),
        'office_fees_local_currency':parseFloat(officeFeesValue,2),
        'container_costs_local_currency':parseFloat(containerCostsValue,2),
        'port_expenses_local_currency':parseFloat(portExpensesValue,2),
        'duties_tarifs_local_currency':parseFloat(dutiesTarifsValue,2),
        'container_insurance_local_currency':parseFloat(containerInsuranceValue,2),
        'port_contribution_local_currency':parseFloat(portContributionValue,2),
        'other_expenses_local_currency':parseFloat(otherExpensesValue,2),
        'total_expenses_local_currency':totalExpense,
        'total_costs_local_currency':totalCost,
        'total_volume_expense':volumeExpense,
        'total_price_expense':priceExpense,
        'cost':totalCost / fobLocalCurrency - 1
    }

    //get data to save reception (purchase_orders_details table)
    const details = await (await fetch(dominio + 'apis/purchase-order-details/' + importData.purchase_order)).json()

    let itemsThatPay = 0

    details.forEach(item => {
        const totalVolume = importData.total_volume_m3
        const itemVolume = item.total_volume_m3        
        const itemFreightAndInsurance = (parseFloat(freightValue,2) + parseFloat(insuranceValue,2)) / totalVolume * itemVolume
        const cif = itemFreightAndInsurance + item.total_fob_supplier_currency * parseFloat(currencyExchangeValue,2)
        
        item.freight_and_insurance_local_currency = parseFloat(itemFreightAndInsurance,2)
        item.cif_local_currency = parseFloat(cif,2)

        //find out how many items pay duties_tarifs
        if (item.pays_duties_tarifs == "si"){
            itemsThatPay +=1
        }
    })

    //add duties_tarifs data
    details.forEach(item => {
        
        //find out how many items pay duties_tarifs
        if (item.pays_duties_tarifs == "si"){
            item.duties_tarifs_local_currency = item.cif_local_currency / itemsThatPay * parseFloat(dutiesTarifsValue,2)
        }
    })

    console.log(details)

    return {data,details}

}

export { receptionCompleteInputs, receptionCalculateCosts }