
import sg from "./globals.js"
import { clearInputs, isValid, uncheckInputs } from "../../generalFunctions.js"

async function printTable() {

    bodySuppliers.innerHTML = ''
    let html = ''

    sg.suppliersFiltered.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

        html += `
            <tr>
                <th class="${rowClass}">${element.supplier}</th>
                <th class="${rowClass}">${element.business_name}</th>
                <th class="${rowClass}">${element.address}</th>
                <th class="${rowClass}">${element.supplier_country.country}</th>
                <th class="${rowClass}">${element.supplier_currency.currency}</th>
                <th class="${rowClass}">${element.cost_calculation}</th>
                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            </tr>
            `
    })

    bodySuppliers.innerHTML = html

    eventListeners()

    suppliersLoader.style.display = 'none'
}

function eventListeners() {

    sg.suppliersFiltered.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)

        //edit
        edit.addEventListener('click',async()=>{
            const inputs = [csppSupplier,csppBusinessName,csppAddress,csppCountry,csppCurrency,csppCostCalculation]
            csppTitle.innerText = 'EDITAR PROVEEDOR'
            csppCreate.style.display = 'none'
            csppEdit.style.display = 'block'
            isValid(inputs)
            
            //complete data
            csppSupplier.value = element.supplier
            csppBusinessName.value = element.business_name
            csppAddress.value = element.address
            csppCountry.value = element.id_countries
            csppCurrency.value = element.id_currencies
            csppCostCalculation.value = element.cost_calculation == 'Volumen' ? 'volume' : 'factor'
            sg.selectedBrunches = element.supplier_brunches.map( sb => sb.id_brunches)

            if (element.supplier_brunches.filter(b => b.id_brunches == 1).length > 0) {
                csppArgentina.checked = true
            }else{
                csppArgentina.checked = false
            }

            if (element.supplier_brunches.filter(b => b.id_brunches == 2).length > 0) {
                csppChile.checked = true
            }else{
                csppChile.checked = false
            }            
            
            csppBrunchError.style.display = 'none'
            csppSupplierError2.style.display = 'none'
            sg.supplierToEdit = element.supplier
            sg.supplierId = element.id
            sg.action = 'edit'
            cspp.style.display = 'block'
        })
    })
}

export {printTable}