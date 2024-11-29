import { dominio } from "../../dominio.js"
import g from "./globals.js"

async function getData() {
    g.idBrunch = idBrunch.innerText
    g.pricesLists = await (await fetch(dominio + 'apis/data/prices-lists/' + g.idBrunch)).json()
    g.pricesListsFiltered = g.pricesLists
    g.suppliers = await (await fetch(dominio + 'apis/data/suppliers/' + g.idBrunch)).json()
    g.currencies = await (await fetch(dominio + 'apis/data/currencies/' + g.idBrunch)).json()
    g.mus = await (await fetch(dominio + 'apis/measurement-units')).json()
}

function applyFilters() {

    g.pricesListsFiltered = g.pricesLists

    //supplier
    g.pricesListsFiltered = supplier.value == '' ? g.pricesListsFiltered : g.pricesListsFiltered.filter(c => c.id_suppliers == supplier.value)

    //item
    g.pricesListsFiltered = item.value == '' ? g.pricesListsFiltered : g.pricesListsFiltered.filter(c => c.item == item.value)

}

export { getData, applyFilters }