import { dominio } from "../../dominio.js"
import cfg from "./globals.js"
import { getData } from "./functions.js"
import { inputsValidation } from "../../generalFunctions.js"
import { printCoeficientFactors} from "./printCoeficientFactors.js"

//CREATECOEFICIENT FACTOR POPUP (CCFPP)
async function ccfppEventListeners() {

    ccfppCreate.addEventListener('click',async()=>{

        const inputs = [ccfppSupplier,ccfppFactor,ccfppSalesMargin]
        const errors = inputsValidation(inputs)

        if (errors == 0) {
            const data = {
                id_brunches:parseInt(cfg.idBrunch),
                id_suppliers:parseInt(ccfppSupplier.value),
                factor:parseFloat(ccfppFactor.value,2)/100,
                sales_margin:parseFloat(ccfppSalesMargin.value,3)/100,
                enabled:1
            }

            console.log(data)

            await fetch(dominio + 'data/apis/factors/create-coeficient-factor',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //show popup
            coeficientFactorsLoader.style.display = 'block'

            //get data
            await getData()

            //print table
            printCoeficientFactors()

            ccfpp.style.display = 'none'
            
        }
    })

    
}

export {ccfppEventListeners}