import { dominio } from "../dominio.js"
import cg from "./globals.js"

async function getData() {
    cg.idBrunch = document.getElementById('idBrunch').innerText
    cg.changes = await (await fetch(dominio + 'costings/apis/' + cg.idBrunch + '/changes')).json()
    cg.costings = await (await fetch(dominio + 'costings/apis/' + cg.idBrunch + '/all-data')).json()
    cg.costingsFiltered = cg.costings
}

function applyFilters() {

    cg.costingsFiltered = cg.costings

    //supplier
    cg.costingsFiltered = supplier.value == '' ? cg.costingsFiltered : cg.costingsFiltered.filter(c => c.id_suppliers == supplier.value)

    //item
    cg.costingsFiltered = item.value == '' ? cg.costingsFiltered : cg.costingsFiltered.filter(c => c.item == item.value)

}

export {getData, applyFilters}