
import g from "./globals.js"
import { clearInputs, isValid } from "../../generalFunctions.js"

async function printTable() {

    bodyPricesLists.innerHTML = ''
    let html = ''

    g.pricesListsFiltered.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

        html += `
            <tr>
                <th class="${rowClass}">${element.supplier_data.supplier}</th>
                <th class="${rowClass}">${element.item}</th>
                <th class="${rowClass}">${element.description}</th>
                <th class="${rowClass}">${element.mu_data.measurement_unit}</th>
                <th class="${rowClass}">${element.mu_per_box}</th>
                <th class="${rowClass}">${parseFloat(element.weight_kg,2).toFixed(2)}</th>
                <th class="${rowClass}">${parseFloat(element.volume_m3,2).toFixed(2)}</th>
                <th class="${rowClass}">${g.formatter.format(parseFloat(element.fob,2).toFixed(2))}</th>
                <th class="${rowClass}">${element.currency_data.currency}</th>
                <th class="${rowClass}">${element.brand}</th>
                <th class="${rowClass}">${element.origin}</th>
                <th class="${rowClass}">${element.has_breaks == 0 ? 'no' : 'si'}</th>
                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            </tr>
            `
    })

    bodyPricesLists.innerHTML = html

    eventListeners()

    loader.style.display = 'none'
}

function eventListeners() {

    g.pricesListsFiltered.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)

        //edit
        edit.addEventListener('click',async()=>{
            clearInputs(g.aippInputs)
            isValid(g.aippInputs)
            g.itemId = element.id
            aippSupplier.value = element.id_suppliers
            aippItem.value = element.item
            aippDescription.value = element.description
            aippFob.value = parseFloat(element.fob,2).toFixed(3)
            aippMu.value = element.id_currencies
            aippMaster.value = element.mu_per_box
            aippWeight. value = parseFloat(element.weight_kg,2).toFixed(3)
            aippVolume. value = parseFloat(element.volume_m3,2).toFixed(4)
            aippBrand. value = element.brand
            aippOrigin. value = element.origin
            aippBreaks. value = element.has_breaks
            
            
            aippSupplier.disabled = true
            aippItem.disabled = true

            aippEdit.style.display = 'block'
            aippCreate.style.display = 'none'
            aippTitle.innerText = 'EDITAR ITEM'
            aipp.style.display = 'block'
        })
    })
}

export {printTable}