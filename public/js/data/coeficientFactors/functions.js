import { dominio } from "../../dominio.js"
import cfg from "./globals.js"

async function getData() {
    cfg.idBrunch = document.getElementById('idBrunch').innerText
    cfg.coeficientFactors = await (await fetch(dominio + 'data/apis/factors/' + cfg.idBrunch + '/coeficient-factors')).json()
    const suppliers = await (await fetch(dominio + 'data/apis/suppliers')).json()
    cfg.suppliers = suppliers.filter(s => s.cost_calculation == 'Factor' && s.supplier_brunches.some(b => b.id_brunches == cfg.idBrunch))
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