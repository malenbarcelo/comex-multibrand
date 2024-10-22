import { dominio } from "../../dominio.js"
import cfg from "./globals.js"
import {clearInputs, isValid} from "../../generalFunctions.js"

async function printCoeficientFactors() {

    bodyCoeficientFactors.innerHTML = ''
    coeficientFactorsLoader.style.display = 'block'
    let html = ''

    cfg.coeficientFactors.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'tBody2 tBodyEven' : 'tBody2 tBodyOdd'

        html += `
            <tr>
                <th class="${rowClass}">${element.factor_supplier.supplier}</th>
                <th class="${rowClass}">${element.factor_supplier.supplier_currency.currency}</th>
                <th class="${rowClass}">${(parseFloat(element.factor)*100).toFixed(2) +'%'}</th>
                <th class="${rowClass}">${(parseFloat(element.sales_margin)*100).toFixed(2) +'%'}</th>

                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            </tr>
            `
    })

    bodyCoeficientFactors.innerHTML = html

    coeficientFactorsEventListeners()

    coeficientFactorsLoader.style.display = 'none'
}

async function coeficientFactorsEventListeners() {

    cfg.coeficientFactors.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)

        //edit
        edit.addEventListener('click',async()=>{
            const inputs = [ccfppSupplier,ccfppFactor,ccfppSalesMargin]
            ccfppTitle.innerText = 'EDITAR FACTOR'
            ccfppCreate.innerText = 'Editar'
            cfg.idElementToEdit = element.id
            clearInputs(inputs)
            isValid(inputs)

            //complete element data
            ccfppSupplier.innerHTML = '<option value="' + element.id_suppliers + '">' + element.factor_supplier.supplier + '</option>'
            ccfppSupplier.value = element.id_suppliers,
            ccfppFactor.value = (parseFloat(element.factor * 100,2)).toFixed(2)
            ccfppSalesMargin.value = (parseFloat(element.sales_margin * 100,2)).toFixed(2)
            ccfpp.style.display = 'block'
        })
    })
}

export {printCoeficientFactors}