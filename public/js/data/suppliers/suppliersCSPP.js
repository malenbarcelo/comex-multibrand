import { dominio } from "../../dominio.js"
import sg from "./globals.js"
import { inputsValidation, notEmptyValidations, showOkPopup } from "../../generalFunctions.js"
import { csppValidations, getData } from "./functions.js"
import { printTable } from "./printTable.js"

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
                    cost_calculation:csppCostCalculation.value == 'volume' ? 'Volumen' : 'Factor',
                },
                brunches:sg.selectedBrunches
            }

            await fetch(dominio + 'apis/data/suppliers/create',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            suppliersLoader.style.display = 'block'
            await getData()
            await printTable()
            cspp.style.display = 'none'
            okppText.innerText = 'Proveedor creado con éxito'
            showOkPopup(okpp)
            
        }
    })

    //edit supplier
    csppEdit.addEventListener('click',async()=>{

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
                    cost_calculation:csppCostCalculation.value == 'volume' ? 'Volumen' : 'Factor',
                },
                brunches:sg.selectedBrunches,
                supplierId:sg.supplierId
            }

            const response = await fetch(dominio + 'apis/data/suppliers/edit',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            suppliersLoader.style.display = 'block'

            if (!response.ok) {
                errorppText.innerText = 'Error al editar el proveedor'
                showOkPopup(errorpp)
                suppliersLoader.style.display = 'none'
            }else{
                await getData()
                await printTable()
                
                okppText.innerText = 'Proveedor editado con éxito'
                showOkPopup(okpp)
            }

            cspp.style.display = 'none'
            
            
        }
    })

    

    
}

export {csppEventListeners}