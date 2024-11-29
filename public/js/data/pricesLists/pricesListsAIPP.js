import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { notEmptyValidations, isInvalid, showOkPopup } from "../../generalFunctions.js"
import { applyFilters } from "./functions.js"
import { printTable } from "./printTable.js"

//ADD ITEM POPUP (AIPP)
async function aippEventListeners() {

    aippCreate.addEventListener('click',async()=>{

        const notEmptyErrors = notEmptyValidations(g.aippInputs)
        const aippValidationsErrors = aippValidations()

        if (notEmptyErrors + aippValidationsErrors == 0) {
            // get data
            const data = {
                itemData: {
                    id_brunches: parseInt(g.idBrunch), 
                    id_suppliers: parseInt(aippSupplier.value),
                    id_currencies: parseInt(g.suppliers.filter(s => s.id == aippSupplier.value)[0].id_currencies),
                    item: aippItem.value, 
                    description: aippDescription.value,
                    id_measurement_units: parseInt(aippMu.value),
                    mu_per_box: parseFloat(aippMaster.value,2),
                    weight_kg: parseFloat(aippWeight.value,4),
                    volume_m3: parseFloat(aippVolume.value,4),
                    fob: parseFloat(aippFob.value,4),
                    brand: aippBrand.value,
                    has_breaks: parseInt(aippBreaks.value),
                    origin: aippOrigin.value
                },
                changeData: {
                    id_brunches: g.idBrunch,
                    updated_costs:0,
                    type: 'Listas de precios',
                    description: 'Item nuevo: ' + aippItem.value + ', ' + g.suppliers.filter(s => s.id == aippSupplier.value)[0].supplier
                }
            }

            //create item
            await fetch(dominio + 'data/apis/prices-lists/add-item',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //show loader
            loader.style.display = 'block'
            bodyPricesLists.innerHTML = ''

            //hide input
            aipp.style.display = 'none'

            //get data
            g.pricesLists = await (await fetch(dominio + 'apis/data/prices-lists/' + g.idBrunch)).json()
            applyFilters()

            //print table
            printTable()

            //edit header
            itemsMenu5Text.classList.add('itemHeaderMenuError')
            itemsMenu5Text.classList.remove('itemHeaderMenu')

            //show popup
            okppText.innerText = 'Item agregado con éxito'
            showOkPopup(okpp)
            
        }
    })

    aippEdit.addEventListener('click',async()=>{

        const notEmptyErrors = notEmptyValidations(g.aippInputs)

        if (notEmptyErrors == 0) {
            // get data
            const data = {
                id:g.itemId,
                itemData: {
                    id_brunches: parseInt(g.idBrunch), 
                    id_currencies: parseInt(g.suppliers.filter(s => s.id == aippSupplier.value)[0].id_currencies),
                    description: aippDescription.value,
                    id_measurement_units: parseInt(aippMu.value),
                    mu_per_box: parseFloat(aippMaster.value,2),
                    weight_kg: parseFloat(aippWeight.value,4),
                    volume_m3: parseFloat(aippVolume.value,4),
                    fob: parseFloat(aippFob.value,4),
                    brand: aippBrand.value,
                    has_breaks: parseInt(aippBreaks.value),
                    origin: aippOrigin.value
                },
                changeData: {
                    id_brunches: g.idBrunch,
                    updated_costs:0,
                    type: 'Listas de precios',
                    description: 'Item editado: ' + aippItem.value + ', ' + g.suppliers.filter(s => s.id == aippSupplier.value)[0].supplier
                }
            }

            //edit item
            await fetch(dominio + 'data/apis/prices-lists/edit-item',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //show loader
            loader.style.display = 'block'
            bodyPricesLists.innerHTML = ''

            //hide input
            aipp.style.display = 'none'

            //get data
            g.pricesLists = await (await fetch(dominio + 'apis/data/prices-lists/' + g.idBrunch)).json()
            applyFilters()

            //print table
            printTable()

            //edit header
            itemsMenu5Text.classList.add('itemHeaderMenuError')
            itemsMenu5Text.classList.remove('itemHeaderMenu')

            //show popup
            okppText.innerText = 'Item editado con éxito'
            showOkPopup(okpp)
            
        }
    })

    
}

function aippValidations(){

    let errors = 0

    //find item
    const findItem = g.pricesLists.filter(pl => (pl.item).toLowerCase() == (aippItem.value).toLowerCase() && pl.id_suppliers == aippSupplier.value)
    if (findItem.length > 0) {
        errors += 1
        isInvalid([aippItem],'El item ingresado ya existe para el proveedor seleccionado')
    }

    return errors
}

export {aippEventListeners}