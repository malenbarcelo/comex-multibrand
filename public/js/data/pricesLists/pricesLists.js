
import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"
import { getData,applyFilters } from "./functions.js"
import { clearInputs, closePopups, closeWithEscape, isValid } from "../../generalFunctions.js"

//popups events listeners
import { aippEventListeners } from "./pricesListsAIPP.js"
import { ulppEventListeners } from "./pricesListsULPP.js"

window.addEventListener('load',async()=>{
    
    loader.style.display = 'block'

    //get data
    await getData()

    //print table
    printTable()

    //popups event listeners
    aippEventListeners() //ADD ITEM POPUP
    ulppEventListeners() //UPLOAD LIST POPUP

    //filters event listeners
    const filters = [supplier, item]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printTable()
        })
    })

    //unfilter event listener
    unfilter.addEventListener("click", async() => {
        clearInputs(filters)
        applyFilters()
        printTable()
    })

    //close popups event listener
    closePopups(g.popups)

    //close with escape
    closeWithEscape(g.popups)

    //general actions
    dgaAddItem.addEventListener("click", async() => {
        clearInputs(g.aippInputs)
        isValid(g.aippInputs)
        aippSupplier.disabled = false
        aippItem.disabled = false
        aippEdit.style.display = 'none'
        aippCreate.style.display = 'block'
        aippTitle.innerText = 'CREAR ITEM'
        aipp.style.display = 'block'
    })

    dgaDownload.addEventListener("click", async() => {
        const data = {
            brunchId:g.idBrunch,
            supplierId: supplier.value,
        }

        const response = await fetch(dominio + 'apis/data/prices-lists/download',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Lista de precios.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            console.error('Error al descargar el archivo:', response.statusText);
        }
    })

    dgaUpload.addEventListener("click", async() => {
        clearInputs([ulppSupplier])
        isValid([ulppSupplier,ulppFile])
        ulpp.style.display = 'block'
    })

    
})