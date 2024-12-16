import { dominio } from "../../dominio.js"
import { isInvalid } from "../../generalFunctions.js"
import sg from "./globals.js"

// async function loadData() {

//     await getData()

//     //print table
//     let data = []
//     sg.suppliers.forEach(supplier => {
//         data.push([supplier.supplier,supplier.business_name,supplier.address,supplier.supplier_country.country,supplier.supplier_currency.currency,supplier.cost_calculation])
//     })

//     const tableManager = new TableManager('bodySuppliers')
//     tableManager.loadTable(data)
//     suppliersLoader.style.display = 'none'

// }

async function getData() {
    sg.idBrunch = document.getElementById('idBrunch').innerText
    sg.suppliers = await (await fetch(dominio + 'apis/data/suppliers')).json()
    sg.suppliersFiltered = sg.suppliers
}

function csppValidations(startErrors) {

    let errors = startErrors

    //existing supplier
    if (sg.action == 'create' || (sg.action == 'edit' && csppSupplier.value != sg.supplierToEdit)) {
        const findSupplier = sg.suppliers.filter(s => (s.supplier).toLowerCase() == (csppSupplier.value).toLowerCase())

        if (findSupplier.length > 0) {
            errors += 1
            isInvalid([csppSupplier])
            csppSupplierError.style.display = 'none'
            csppSupplierError2.style.display = 'block'    
        }else{
            csppSupplierError2.style.display = 'none'
        }
    }

    //selected brunches
    if (sg.selectedBrunches.length == 0) {
        errors += 1
        csppBrunchError.style.display = 'block'
    }else{
        csppBrunchError.style.display = 'none'
    }

    return errors

}

export {csppValidations, getData}