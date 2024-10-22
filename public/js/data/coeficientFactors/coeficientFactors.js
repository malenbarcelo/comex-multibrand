
import { dominio } from "../../dominio.js"
import cfg from "./globals.js"
import { closePopupsEventListeners,clearInputs, isValid } from "../../generalFunctions.js"
import { printCoeficientFactors } from "./printCoeficientFactors.js"
import { getData,suppliersSelect } from "./functions.js"

//popups event listeners
import { ccfppEventListeners} from "./coeficientFactorsCCFPP.js"

window.addEventListener('load',async()=>{

    //show popup
    coeficientFactorsLoader.style.display = 'block'

    //get data
    await getData()

    //print table
    printCoeficientFactors()

    //popups event listeners
    ccfppEventListeners()

    //close popups
    let closePopups = [ccfppClose]
    closePopupsEventListeners(closePopups)

    //create factor
    createCoeficientFactor.addEventListener('click',async()=>{
        const inputs = [ccfppSupplier,ccfppFactor,ccfppSalesMargin]
        ccfppTitle.innerText = 'CREAR FACTOR'
        ccfppCreate.innerText = 'Crear'
        clearInputs(inputs)
        isValid(inputs)
        suppliersSelect()
        ccfpp.style.display = 'block'
    })

})