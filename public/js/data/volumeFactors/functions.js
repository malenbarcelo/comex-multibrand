import { dominio } from "../../dominio.js"
import vfg from "./globals.js"

async function getData() {
    vfg.idBrunch = document.getElementById('idBrunch').innerText
    vfg.volumeFactors = await (await fetch(dominio + 'data/apis/factors/' + vfg.idBrunch + '/volume-factors')).json()
    const suppliers = await (await fetch(dominio + 'data/apis/suppliers')).json()
    vfg.suppliers = suppliers.filter(s => s.supplier_brunches.some(b => b.id_brunches == vfg.idBrunch))
}

async function suppliersSelect() {
    cvfppSupplier.innerHTML = '<option value=""></option>'
    vfg.suppliers.forEach(supplier => {
        const factors = supplier.supplier_factors.filter(sf => sf.id_brunches == vfg.idBrunch)
        
        if (factors.length == 0) {
            cvfppSupplier.innerHTML += '<option value="' + supplier.id + '">' + supplier.supplier + '</option>'
        }
    })
}

export {getData,suppliersSelect}