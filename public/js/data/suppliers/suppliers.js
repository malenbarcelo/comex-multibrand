
import { loadData } from "./functions.js"
import { closePopupsEventListeners,clearInputs,isValid,inputsValidation, uncheckInputs } from "../../generalFunctions.js"
import sg from "./globals.js"

//popups event listeners
import { csppEventListeners} from "./suppliersCSPP.js"

window.addEventListener('load',async()=>{

    suppliersLoader.style.display = 'block'

    //load data
    await loadData()

    //popups event listeners
    csppEventListeners() //CREATE SUPPLIER POPUP

    //close popups
    let closePopups = [csppClose]
    closePopupsEventListeners(closePopups)

    //create supplier
    createSupplier.addEventListener('click',async()=>{
        const inputs = [csppSupplier,csppBusinessName,csppAddress,csppCountry,csppCurrency,csppCostCalculation]
        csppTitle.innerText = 'CREAR PROVEEDOR'
        csppCreate.style.display = 'block'
        csppEdit.style.display = 'none'
        clearInputs(inputs)
        isValid(inputs)
        uncheckInputs([csppArgentina, csppChile])
        csppBrunchError.style.display = 'none'
        csppSupplierError2.style.display = 'none'
        sg.selectedBrunches=[]
        sg.action = 'create'
        cspp.style.display = 'block'
    })
})