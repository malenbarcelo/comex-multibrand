import { dominio } from "../../dominio.js"
import vfg from "./globals.js"
import {clearInputs, isValid} from "../../generalFunctions.js"
import {suppliersSelect, sumVolumeExpenses} from "./functions.js"

async function printVolumeFactors() {

    bodyVolumeFactors.innerHTML = ''
    volumeFactorsLoader.style.display = 'block'
    let html = ''

    vfg.volumeFactors.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'tBody2 tBodyEven' : 'tBody2 tBodyOdd'

        html += `
            <tr>
                <th class="${rowClass}">${element.factor_supplier.supplier}</th>
                <th class="${rowClass}">${element.factor_supplier.supplier_currency.currency}</th>
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
                <th class="${rowClass}">${parseFloat(element.custom_agent).toFixed(2) * 100 +'%'}</th>
                <th class="${rowClass}">${parseFloat(element.insurance).toFixed(2) * 100 +'%'}</th>
                <th class="${rowClass}">${parseFloat(element.transference).toFixed(2) * 100 +'%'}</th>
                <th class="${rowClass}">${parseFloat(element.import_duty).toFixed(2) * 100 +'%'}</th>
                <th class="${rowClass}">${(parseFloat(element.sales_margin)*100).toFixed(2) +'%'}</th>

                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            </tr>
            `
    })

    bodyVolumeFactors.innerHTML = html

    await volumeFactorsEventListeners()

    volumeFactorsLoader.style.display = 'none'
}

async function volumeFactorsEventListeners() {

    vfg.volumeFactors.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)

        //edit
        edit.addEventListener('click',async()=>{
            const inputs = [cvfppSupplier,cvfppStdVolume,cvfppStdVolumeMU,cvfppStdCtn,cvfppStdFreight,cvfppFreight,cvfppStdTerminalExpenses,cvfppTerminalExpenses,cvfppStdDispatchExpenses,cvfppDispatchExpenses,cvfppStdMaritimeAgencyExpenses,cvfppMaritimeAgencyExpenses,cvfppStdDomesticFreight,cvfppDomesticFreight,cvfppCustomAgent,cvfppInsurance,cvfppTransference,cvfppimportDuty,cvfppSalesMargin]
            cvfppTitle.innerText = 'EDITAR FACTOR'
            cvfppCreate.innerText = 'Editar'
            vfg.idElementToEdit = element.id
            clearInputs(inputs)
            isValid(inputs)

            //complete element data
            cvfppSupplier.innerHTML = '<option value="' + element.id_suppliers + '">' + element.factor_supplier.supplier + '</option>'
            cvfppSupplier.value = element.id_suppliers,
            cvfppStdVolume.value = parseFloat(element.std_volume,2).toFixed(2),
            cvfppStdVolumeMU.value = element.volume_mu,
            cvfppStdCtn.value = parseFloat(element.std_container,2).toFixed(2),
            cvfppStdFreight.value = parseFloat(element.std_freight,2).toFixed(2),
            cvfppFreight.value = parseFloat(element.freight,2).toFixed(2),
            cvfppStdTerminalExpenses.value = parseFloat(element.std_terminal_expenses,2).toFixed(2),
            cvfppTerminalExpenses.value = parseFloat(element.terminal_expenses,2).toFixed(2),
            cvfppStdDispatchExpenses.value = parseFloat(element.std_dispatch_expenses,2).toFixed(2),
            cvfppDispatchExpenses.value = parseFloat(element.dispatch_expenses,2).toFixed(2),
            cvfppStdMaritimeAgencyExpenses.value = parseFloat(element.std_maritime_agency_expenses,2).toFixed(2),
            cvfppMaritimeAgencyExpenses.value = parseFloat(element.maritime_agency_expenses,2).toFixed(2),
            cvfppStdDomesticFreight.value = parseFloat(element.std_domestic_freight,2).toFixed(2),
            cvfppDomesticFreight.value = parseFloat(element.domestic_freight,2).toFixed(2),
            cvfppTotalVolumeExpenses.value = parseFloat(element.total_volume_expenses,2).toFixed(2),
            cvfppMU1.innerText = element.volume_expenses_mu,
            cvfppCustomAgent.value = (parseFloat(element.custom_agent * 100,2)).toFixed(2),
            cvfppInsurance.value = (parseFloat(element.insurance * 100,2)).toFixed(2),
            cvfppTransference.value = (parseFloat(element.transference * 100,2)).toFixed(2),
            cvfppimportDuty.value = (parseFloat(element.import_duty * 100,2)).toFixed(2),
            cvfppSalesMargin.value = (parseFloat(element.sales_margin * 100,2)).toFixed(2)
            
            sumVolumeExpenses()
            cvfpp.style.display = 'block'
        })
    })
}

export {printVolumeFactors}