import { dominio } from "../../dominio.js"
import cfg from "./globals.js"

async function getData() {
    cfg.idBrunch = document.getElementById('idBrunch').innerText
    cfg.coeficientFactors = await (await fetch(dominio + 'apis/data/coeficient-factors/' + cfg.idBrunch)).json()
    const suppliers = await (await fetch(dominio + 'apis/data/suppliers/' + cfg.idBrunch)).json()
    cfg.suppliers = suppliers.filter(s => s.cost_calculation == 'Factor')
}

async function suppliersSelect() {
    ccfppSupplier.innerHTML = '<option value=""></option>'
    cfg.suppliers.forEach(supplier => {
        const factors = supplier.supplier_coeficient_factors.filter(sf => sf.id_brunches == cfg.idBrunch)
        
        if (factors.length == 0) {
            ccfppSupplier.innerHTML += '<option value="' + supplier.id + '">' + supplier.supplier + '</option>'
        }
    })
}

export {getData,suppliersSelect}