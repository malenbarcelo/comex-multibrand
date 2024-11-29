import { dominio } from "../dominio.js"
import g from "../functions/imports/globals.js"

async function getData() {
    g.idBrunch = document.getElementById('idBrunch').innerText
    g.imports = await (await fetch(dominio + 'apis/data/imports/' + g.idBrunch)).json()
    g.importsFiltered = g.imports
}

function applyFilters() {

    // g.costingsFiltered = g.costings

    // //supplier
    // g.costingsFiltered = supplier.value == '' ? g.costingsFiltered : g.costingsFiltered.filter(c => c.id_suppliers == supplier.value)

    // //item
    // g.costingsFiltered = item.value == '' ? g.costingsFiltered : g.costingsFiltered.filter(c => c.item == item.value)

}

export {getData, applyFilters}