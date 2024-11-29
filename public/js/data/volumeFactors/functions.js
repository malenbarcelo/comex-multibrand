import { dominio } from "../../dominio.js"
import vfg from "./globals.js"

async function getData() {
    vfg.idBrunch = document.getElementById('idBrunch').innerText
    vfg.volumeFactors = await (await fetch(dominio + 'apis/data/volume-factors/' + vfg.idBrunch)).json()
    const suppliers = await (await fetch(dominio + 'apis/data/suppliers/' + vfg.idBrunch)).json()
    vfg.suppliers = suppliers.filter(s => s.cost_calculation == 'Volumen')
}

async function suppliersSelect() {
    cvfppSupplier.innerHTML = '<option value=""></option>'
    vfg.suppliers.forEach(supplier => {
        const factors = supplier.supplier_volume_factors.filter(sf => sf.id_brunches == vfg.idBrunch)
        
        if (factors.length == 0) {
            cvfppSupplier.innerHTML += '<option value="' + supplier.id + '">' + supplier.supplier + '</option>'
        }
    })
}

function sumVolumeExpenses() {

    const terminalExpenses = cvfppTerminalExpenses.value == '?' ? 0 : parseFloat(cvfppTerminalExpenses.value,4)
    const dispatchExpenses = cvfppDispatchExpenses.value == '?' ? 0 : parseFloat(cvfppDispatchExpenses.value,4)
    const maritimeAgencyExpenses = cvfppMaritimeAgencyExpenses.value == '?' ? 0 : parseFloat(cvfppMaritimeAgencyExpenses.value,4)
    const domesticFreight = cvfppDomesticFreight.value == '?' ? 0 : parseFloat(cvfppDomesticFreight.value,4)

    cvfppTotalVolumeExpenses.value = (cvfppStdVolume.value == '' || cvfppStdVolume.value == 0) ? 0 : (terminalExpenses + dispatchExpenses + maritimeAgencyExpenses + domesticFreight).toFixed(4)

}



export {getData,suppliersSelect,sumVolumeExpenses}