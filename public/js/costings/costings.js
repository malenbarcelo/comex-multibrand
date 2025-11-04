import { dominio } from "../dominio.js"
import cg from "./globals.js"
import { dateToString, closePopups, closeWithEscape, showOkPopup,clearInputs } from "../generalFunctions.js"
import { printCostings } from "./printCostings.js"
import { getData, applyFilters } from "./functions.js"

window.addEventListener('load',async()=>{

    costingsLoader.style.display = 'block'

    //get data
    await getData()

    //print table
    printCostings()

    //filters event listeners
    const filters = [supplier, item]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printCostings()
        })
    })

    //unfilter event listener
    unfilter.addEventListener("click", async() => {
        clearInputs(filters)
        applyFilters()
        printCostings()
    })

    //close popups event listener
    closePopups(cg.popups)

    //close with escape
    closeWithEscape(cg.popups)

    //show update alert
    if (cg.changes.length > 0) {

        costingAlert.style.display = 'block'
        updateDiv.style.display = 'flex'

        costingAlertInfo.addEventListener('click',async()=>{
            lcppLastChanges.innerHTML = ''
            cg.changes.forEach(c => {
                lcppLastChanges.innerHTML += '<div> - <b>' + c.type + '</b> -- ' + c.description + ' (' + c.user_data.user_name + ' - '  + dateToString(c.created_at) + ')</div>'
            })
            lcpp.style.display = 'block'
        })

    }else{
        costingAlert.style.display = 'none'
        updateDiv.style.display = 'none'
    }

    //update costings
    updateCostings.addEventListener('click',async()=>{
        coppQuestion.innerText = '¿Confirma que desea actualizar costos?'
        copp.style.display = 'block'
    })

    //update costings confirm
    coppAccept.addEventListener('click',async()=>{

        // update costs
        const updateResponse = await fetch(dominio + 'costings/apis/' + cg.idBrunch + '/update',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify()
        })

        let changesResponse = false
        if (updateResponse.ok == true) {
            // update changes
            changesResponse = await fetch(dominio + 'costings/apis/' + cg.idBrunch + '/update-changes',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify()
            })  
        }

        if (changesResponse.ok == true) {
            costingsLoader.style.display = 'block'
            bodyCostings.innerHTML = ''

            //get data
            await getData()

            //print table
            printCostings()

            copp.style.display = 'none'
            costingAlert.style.display = 'none'
            updateDiv.style.display = 'none'
            itemsMenu5Text.classList.remove('itemHeaderMenuError')
            itemsMenu5Text.classList.add('itemHeaderMenu')

            okppText.innerText = 'Costos actualizados con éxito'
            showOkPopup(okpp)
        }else{
            copp.style.display = 'none'
            errorppText.innerText = 'Ha ocurrido un error al guardar los datos'
            showOkPopup(errorpp)
        }
    })

    //download data
    download.addEventListener('click',async()=>{

        const data = {
            brunchId:cg.idBrunch,
            supplierId: supplier.value,
        }

        const response = await fetch(dominio + 'costings/apis/download',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Costeo.xlsx';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            console.error('Error al descargar el archivo:', response.statusText);
        }
    })

})