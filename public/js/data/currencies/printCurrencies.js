import cg from "./globals.js"
import { isValid } from "../../generalFunctions.js"


async function printCurrencies() {

    bodyCurrencies.innerHTML = ''
    let html = ''

    cg.currencies.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

        html += `
            <tr>
                <th class="${rowClass}">${element.currency}</th>
                <th class="${rowClass}">${element.currency_exchange[0].currency_exchange}</th>
                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            </tr>
            `
    })

    bodyCurrencies.innerHTML = html

    await currenciesEventListeners()
}

async function currenciesEventListeners() {

    cg.currencies.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)

        //edit
        edit.addEventListener('click',async()=>{
            cecppTitle.innerText = 'MODIFICAR TASA DE CAMBIO'
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

export {printCurrencies}