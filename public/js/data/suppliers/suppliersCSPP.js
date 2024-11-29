import { dominio } from "../../dominio.js"
import sg from "./globals.js"
import { inputsValidation, notEmptyValidations, showOkPopup } from "../../generalFunctions.js"
import { csppValidations,loadData } from "./functions.js"

//CREATE SUPPLEIR POPUP (CSPP)
async function csppEventListeners() {
    
    //select brunch
    const checks = [csppArgentina, csppChile]
    checks.forEach(check => {
        check.addEventListener('click',async()=>{
            if (check.checked) {
                sg.selectedBrunches.push(parseInt(check.value))
            }else{
                sg.selectedBrunches = sg.selectedBrunches.filter( sb => sb != check.value)
            }
        })
    })

    //create supplier
    csppCreate.addEventListener('click',async()=>{

        const inputs = [csppSupplier,csppBusinessName,csppAddress,csppCountry,csppCurrency,csppCostCalculation]
        let errors = notEmptyValidations(inputs)

        //create supplier validations
        errors = csppValidations(errors)

        if (errors == 0) {
            const data = {
                supplierData:{
                    supplier:csppSupplier.value,
                    business_name:csppBusinessName.value,
                    address:csppAddress.value,
                    id_countries:csppCountry.value,
                    id_currencies:csppCurrency.value,
                    cost_calculation:csppCostCalculation.value,
                },
                brunches:sg.selectedBrunches
            }

            await fetch(dominio + 'apis/data/suppliers/create',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            suppliersLoader.style.display = 'block'
            await loadData()
            cspp.style.display = 'none'
            okppText.innerText = 'Proveedor creado con éxito'
            showOkPopup(okpp)
            
        }
    })

    

    
}

export {csppEventListeners}