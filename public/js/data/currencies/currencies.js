
import { dominio } from "../dominio.js"
import cg from "./globals.js"
import { closePopupsEventListeners, isInvalid, showOkPopup } from "../generalFunctions.js"
import { printCurrencies } from "./printCurrencies.js"

window.addEventListener('load',async()=>{

    //get data
    cg.idBrunch = document.getElementById('idBrunch').innerText
    cg.currencies = await (await fetch(dominio + 'data/apis/currencies/' + cg.idBrunch + '/brunch-currencies')).json()

    //print table
    printCurrencies()

    //close popups
    let closePopups = [cecppClose]
    closePopupsEventListeners(closePopups)

    //edit currency
    cecppEdit.addEventListener('click',async()=>{

        //validations
        let errors = 0
        
        //not empty
        if (cecppExchange.value == '') {
            errors +=1
            cecppExchangeError.innerText = 'Debe ungresar una tasa del cambio'
            isInvalid([cecppExchange])
        }

        if (errors == 0) {

            const data = {
                id_currencies: cg.idCurrencyToEdit,
                currency_exchange: cecppExchange.value
            }

            await fetch(dominio + 'data/apis/currencies/' + cg.idBrunch + '/create-exchange-rate',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //get data
            cg.currencies = await (await fetch(dominio + 'data/apis/currencies/' + cg.idBrunch + '/brunch-currencies')).json()

            //print table
            printCurrencies()

            cecpp.style.display = 'none'

            showOkPopup(cecppOk)
        }
    })
})