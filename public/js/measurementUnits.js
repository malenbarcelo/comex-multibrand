import { dominio } from "./dominio.js"
import { clearData } from "./functions/generalDataFuntions.js"

window.addEventListener('load',async()=>{

    //general
    const idBrunch = document.getElementById('idBrunch').innerText
    const create = document.getElementById('create')
    const popup = document.getElementById('popup')
    const close = document.getElementById('close')
    const acceptCreate = document.getElementById('acceptCreate')
    let process = ''

    //inputs
    const measurementUnit = document.getElementById('measurementUnit')
    const unitsPerMU = document.getElementById('unitsPerMU')
    const inputs = [measurementUnit, unitsPerMU]

    //errors
    const muErrorText = document.getElementById('muErrorText')
    const unitsPerMUerrorText = document.getElementById('unitsPerMUerrorText')
    const errors = [muErrorText, unitsPerMUerrorText]

    //labels
    const muLabel = document.getElementById('muLabel')    
    const unitsPerMUlabel = document.getElementById('unitsPerMUlabel')
    const labels = [muLabel, unitsPerMUlabel]

    //title
    const title = document.getElementById('title')

    //data
    const mus = await (await fetch(dominio + 'apis/measurement-units')).json()

    /*---------------measurementUnits.ejs---------------*/
    create.addEventListener("click", () => {

        process = 'create'

        //clear data
        clearData(inputs,errors,labels)

        //complete title
        title.innerText = 'Crear unidad de medida'

        //change input
        measurementUnit.removeAttribute("readonly")

        //show popup
        popup.style.display = 'block'
    })

    

    /*---------------createMU.ejs---------------*/
    close.addEventListener("click", () => {
        popup.style.display = "none"
    })

    acceptCreate.addEventListener("click", (event) => {

        let muErrors = ''
        let unitsPerMuErrors = ''
        const findMu = mus.filter( mu => mu.measurement_unit == measurementUnit.value )
        
        //measurementUnit validation        
        if (measurementUnit.value == '') {
            muErrors = 'Ingrese una unidad de medida'
            muErrorText.innerText = muErrors
            measurementUnit.classList.add('isInvalid')
            muLabel.classList.add('errorColor')
        }else{
            if (findMu.length > 0) {
                muErrors = 'La unidad de medida ingresada ya existe'
                muErrorText.innerText = muErrors
                measurementUnit.classList.add('isInvalid')
                muLabel.classList.add('errorColor')
            }else{
                muErrorText.innerText = ''
                measurementUnit.classList.remove('isInvalid')
                muLabel.classList.remove('errorColor')
            }
        }           

        //unitsPerMU validation
        if (unitsPerMU.value == '') {
            unitsPerMuErrors = 'Ingrese la tasa de cambio'
            unitsPerMUerrorText.innerText = unitsPerMuErrors
            unitsPerMU.classList.add('isInvalid')
            unitsPerMUlabel.classList.add('errorColor')
        }else{
            if (isNaN(unitsPerMU.value)) {
                unitsPerMuErrors = 'El valor debe ser numérico. Utilice "." como separador de decimales.'
                unitsPerMUerrorText.innerText = unitsPerMuErrors
                unitsPerMU.classList.add('isInvalid')
                unitsPerMUlabel.classList.add('errorColor')
            }else{
                unitsPerMUerrorText.innerText = ''
                unitsPerMU.classList.remove('isInvalid')
                unitsPerMUlabel.classList.remove('errorColor')
            }
        }

        if (muErrors != '' || unitsPerMuErrors != '') {            
            event.preventDefault()
        }
    })

})