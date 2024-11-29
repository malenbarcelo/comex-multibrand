import { dominio } from "../../dominio.js"
import cfg from "./globals.js"
import { getData } from "./functions.js"
import { inputsValidation, showOkPopup } from "../../generalFunctions.js"
import { printCoeficientFactors} from "./printCoeficientFactors.js"

//CREATE COEFICIENT FACTOR POPUP (CCFPP)
async function ccfppEventListeners() {

    ccfppCreate.addEventListener('click',async()=>{

        const inputs = [ccfppSupplier,ccfppFactor,ccfppSalesMargin]
        const errors = inputsValidation(inputs)

        if (errors == 0) {
            const data = {
                create: {
                    id_brunches:parseInt(cfg.idBrunch),
                    id_suppliers:parseInt(ccfppSupplier.value),
                    factor:parseFloat(ccfppFactor.value,2)/100,
                    sales_margin:parseFloat(ccfppSalesMargin.value,3)/100,
                    enabled:1,
                    supplier: cfg.suppliers.filter( s => s.id == parseInt(ccfppSupplier.value))[0].supplier
                },
                action: cfg.action
                
            }

            await fetch(dominio + 'data/apis/coeficient-factors/create',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            bodyCoeficientFactors.innerHTML = ''

            //show loader
            coeficientFactorsLoader.style.display = 'block'

            ccfpp.style.display = 'none'

            //get data
            await getData()

            //print table
            printCoeficientFactors()

            //edit header
            itemsMenu5Text.classList.add('itemHeaderMenuError')
            itemsMenu5Text.classList.remove('itemHeaderMenu')

            //show popup
            okppText.innerText = 'Coeficiente creado con éxito'
            showOkPopup(okpp)
            
        }
    })

    
}

export {ccfppEventListeners}