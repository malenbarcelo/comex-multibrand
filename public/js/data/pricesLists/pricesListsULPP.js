import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { isInvalid, isValid,showOkPopup } from "../../generalFunctions.js"
import { applyFilters } from "./functions.js"
import { printTable } from "./printTable.js"

//UPLOAD LIST POPUP (ULPP)
async function ulppEventListeners() {

    ulppTemplate.addEventListener("click", async() => {
        const fileUrl = '/files/pricesListsTemplate.xlsx'
        const link = document.createElement('a')
        link.href = fileUrl
        link.download = 'Listas de precios - Template.xlsx'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    })

    ulppAccept.addEventListener("click", async() => {

        const {data,errors} = await validations()

        if (errors == 0) {

            const supplierData = g.suppliers.filter( s => s.id == ulppSupplier.value)
            const currencyId = supplierData[0].id_currencies

            const dataToUpload = {
                brunchId: g.idBrunch,
                supplierId:ulppSupplier.value,
                supplier: supplierData[0].supplier,
                currencyId: currencyId,
                priceList:data
            }

            const response = await fetch(dominio + 'data/apis/prices-lists/upload-excel-file',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(dataToUpload)
            })

            //show loader
            loader.style.display = 'block'
            bodyPricesLists.innerHTML = ''

            //hide input
            ulpp.style.display = 'none'

            if (response.ok) {
                //get data
                g.pricesLists = await (await fetch(dominio + 'apis/data/prices-lists/' + g.idBrunch)).json()
                //edit header
                itemsMenu5Text.classList.add('itemHeaderMenuError')
                itemsMenu5Text.classList.remove('itemHeaderMenu')
                //show popup
                okppText.innerText = 'Lista subida con éxito'
                showOkPopup(okpp)
            }else{
                //show popup
                errorppText.innerText = 'Error al cargar la lista'
                showOkPopup(errorpp)
            }
            
            applyFilters()

            //print table
            printTable()
            
        }
    })
}

async function validations() {

    let errors = 0
    let data = []

    if (ulppSupplier.value == "") {
        errors += 1
        isInvalid([ulppSupplier],'Debe seleccionar un proveedor')
    }else{
        isValid([ulppSupplier])
    }

    const file = ulppFile.files[0]

    if (!file) {
        errors += 1
        isInvalid([ulppFile],'Debe seleccionar un archivo')
    }else{

        const fileName = file.name;
        const fileExtension = fileName.split('.').pop()

        if (fileExtension != 'xlsx' && fileExtension != 'xls') {
            errors +=1
            isInvalid([ulppFile],'Las extensiones permitidas son ".xlsx" y ".xls"')
        }else{
            const formData = new FormData()
            formData.append('ulppFile', ulppFile.files[0])

            const response = await fetch('/apis/data/prices-lists/read-excel-file', {
                method: 'POST',
                body: formData
                })

            data = await response.json()
            data.shift()

            //find errors
            const supplierData = g.suppliers.filter( s => s.id == ulppSupplier.value)
            const costCalculation = supplierData[0].cost_calculation

            if (data.filter(d => d.includes(null)).length > 0) {
                errors += 1
                isInvalid([ulppFile], 'Todos los datos deben estar completos')
            }else{
                if (costCalculation == 'Volumen' && data.filter(d => d[4] == 0).length > 0) {
                    errors += 1
                    isInvalid([ulppFile], 'Los volúmenes no pueden ser 0')
                }else{
                    const mus = g.mus.map( mu => mu.measurement_unit)
                    const notFoundMus = data.filter( d => !mus.includes(d[2]))
                    if (notFoundMus.length > 0) {
                        errors += 1
                        isInvalid([ulppFile], 'Se detectan unidades de medida inexistentes')
                    }
                }
            }
        }
    }

    return {data,errors}
}

export {ulppEventListeners}