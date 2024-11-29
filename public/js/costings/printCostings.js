import { dominio } from "../dominio.js"
import cg from "./globals.js"
import { isValid,dateToString } from "../generalFunctions.js"


async function printCostings() {

    costingsLoader.style.display = 'block'
    bodyCostings.innerHTML = ''
    let html = ''

    cg.costingsFiltered.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

        html += `
            <tr>
                <th class="${rowClass}">${element.supplier_data.supplier}</th>
                <th class="${rowClass}">${element.item}</th>
                <th class="${rowClass}">${element.description}</th>
                <th class="${rowClass}">${element.mu_data.measurement_unit}</th>
                <th class="${rowClass}">${element.mu_per_box}</th>
                <th class="${rowClass}">${element.currency_data.currency}</th>
                <th class="${rowClass}">${cg.formatter.format(parseFloat(element.fob,2).toFixed(2))}</th>
                <th class="${rowClass}">${!element.unit_cost ? '' : cg.formatter.format(parseFloat(element.unit_cost,2).toFixed(2))}</th>
                <th class="${rowClass}">${dateToString(element.created_at)}</th>
            </tr>
            `
    })

    bodyCostings.innerHTML = html

    //await currenciesEventListeners()
    costingsLoader.style.display = 'none'
}

async function currenciesEventListeners() {

    cg.currencies.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)

        //edit
        edit.addEventListener('click',async()=>{
            cecppTitle.innerText = 'MODIFICAR TASA DE CAMBIO'
            cecppCreate.style.display = 'none'
            cecppEdit.style.display = 'block'
            cecppCurrency.value = element.currency
            cecppExchange.value = element.currency_exchange[0].currency_exchange
            cecppCurrencyError.style.display = 'none'
            cecppExchangeError.style.display = 'none'
            isValid([cecppExchange])
            
            cg.idCurrencyToEdit = element.id
            cecpp.style.display = 'block'
        })
    })
}

export {printCostings}