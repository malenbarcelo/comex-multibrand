
import { dominio } from "../../dominio.js"
import cg from "./globals.js"
import { closePopups, closeWithEscape, isInvalid, showOkPopup,isValid, clearInputs } from "../../generalFunctions.js"
import { printCurrencies } from "./printCurrencies.js"

window.addEventListener('load',async()=>{

    //get data
    cg.idBrunch = document.getElementById('idBrunch').innerText
    cg.currencies = await (await fetch(dominio + 'data/apis/currencies/' + cg.idBrunch)).json()

    //print table
    printCurrencies()

    //close popups event listener
    closePopups(cg.popups)

    //close with escape
    closeWithEscape(cg.popups)

    //edit currency
    cecppEdit.addEventListener('click',async()=>{

        //validations
        let errors = 0
        
        //not empty
        if (cecppExchange.value == '') {
            errors +=1
            isInvalid([cecppExchange],'Debe ingresar una tasa de cambio')
        }

        if (errors == 0) {

            const data = {
                id_brunches: parseInt(cg.idBrunch),
                id_currencies: cg.idCurrencyToEdit,
                currency_exchange: parseFloat(cecppExchange.value,2)
            }

            await fetch(dominio + 'data/apis/currencies/create-exchange-rate',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //get data
            cg.currencies = await (await fetch(dominio + 'data/apis/currencies/' + cg.idBrunch)).json()

            //print table
            printCurrencies()
            cecpp.style.display = 'none'

            //edit header
            itemsMenu5Text.classList.add('itemHeaderMenuError')
            itemsMenu5Text.classList.remove('itemHeaderMenu')
            
            okppText.innerText = 'Tasa de cambio editada con éxito'
            showOkPopup(okpp)
        }
    })
})