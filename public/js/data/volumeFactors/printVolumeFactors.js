import { dominio } from "../../dominio.js"
import vfg from "./globals.js"

async function printVolumeFactors() {

    bodyVolumeFactors.innerHTML = ''
    volumeFactorsLoader.style.display = 'block'
    let html = ''

vfg.volumeFactors.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'tBody2 tBodyEven' : 'tBody2 tBodyOdd'

        html += `
            <tr>
                <th class="${rowClass}">${element.factor_supplier.supplier}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.std_volume)}</th>
                <th class="${rowClass}">${element.volume_mu}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.std_container)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.std_freight)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.freight)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.std_terminal_expenses)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.terminal_expenses)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.std_dispatch_expenses)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.dispatch_expenses)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.std_maritime_agency_expenses)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.maritime_agency_expenses)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.std_domestic_freight)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.domestic_freight)}</th>
                <th class="${rowClass}">${vfg.formatter.format(element.total_volume_expenses)}</th>
                <th class="${rowClass}">${element.volume_expenses_mu}</th>
                <th class="${rowClass}">${parseFloat(element.custom_agent).toFixed(4) * 100 +'%'}</th>
                <th class="${rowClass}">${parseFloat(element.insurance).toFixed(4) * 100 +'%'}</th>
                <th class="${rowClass}">${parseFloat(element.transference).toFixed(4) * 100 +'%'}</th>
                <th class="${rowClass}">${parseFloat(element.import_duty).toFixed(4) * 100 +'%'}</th>
                <th class="${rowClass}">${parseFloat(element.sales_margin).toFixed(4) * 100 +'%'}</th>

                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            </tr>
            `
    })

    bodyVolumeFactors.innerHTML = html

    // await currenciesEventListeners()

    volumeFactorsLoader.style.display = 'none'
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

export {printVolumeFactors}