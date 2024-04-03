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
    const currencyName = document.getElementById('currencyName')
    const currencyExchange = document.getElementById('currencyExchange')
    const inputs = [currencyName, currencyExchange]

    //errors
    const currencyNameErrorText = document.getElementById('currencyNameErrorText')
    const currencyExchangeErrorText = document.getElementById('currencyExchangeErrorText')
    const errors = [currencyNameErrorText, currencyExchangeErrorText]

    //labels
    const currencyLabel = document.getElementById('currencyLabel')    
    const exchangeLabel = document.getElementById('exchangeLabel')
    const labels = [currencyLabel, exchangeLabel]

    //title
    const title = document.getElementById('title')

    //data
    const brunchCurrencies = await (await fetch(dominio + 'apis/' + idBrunch + '/brunch-currencies')).json()

    /*---------------currencies.ejs---------------*/
    create.addEventListener("click", () => {

        process = 'create'

        //clear data
        clearData(inputs,errors,labels)

        //complete title
        title.innerText = 'Crear moneda'

        //change input
        currencyName.removeAttribute("readonly")

        //show popup
        popup.style.display = 'block'
    })

    brunchCurrencies.forEach(currency => {

        const edit = document.getElementById('edit_' + currency.id)
        const currencyValue = brunchCurrencies.filter(element => element.id == currency.id)[0]

        edit.addEventListener("click", () => {

            process = 'edit'

            //clear data
            clearData(inputs,errors,labels)

            //compelte title
            title.innerText = 'Editar moneda'

            //complete inputs
            currencyName.value = currencyValue.currency_exchange_currency.currency
            currencyExchange.value = currencyValue.currency_exchange
            currencyName.classList.add('enabledInput')
            currencyName.setAttribute("readonly", "readonly")

            //show popup
            popup.style.display = 'block'
        })

    })

    /*---------------createEditCurrency.ejs---------------*/
    close.addEventListener("click", () => {
        popup.style.display = "none"
    })

    acceptCreate.addEventListener("click", (event) => {

        
        const findCurrency = brunchCurrencies.filter( currency => currency.currency_exchange_currency.currency == currencyName.value )

        let currencyNameErrors = ''
        let currencyExchangeErrors = ''
        
        //currencyName validation
        if (process == 'create') {
            if (currencyName.value == '') {
                currencyNameErrors = 'Ingrese una moneda'
                currencyNameErrorText.innerText = currencyNameErrors
                currencyName.classList.add('isInvalid')
                currencyLabel.classList.add('errorColor')
            }else{
                if (findCurrency.length > 0) {
                    currencyNameErrors = 'La moneda ingresada ya existe'
                    currencyNameErrorText.innerText = currencyNameErrors
                    currencyName.classList.add('isInvalid')
                    currencyLabel.classList.add('errorColor')
                }else{
                    currencyNameErrorText.innerText = ''
                    currencyName.classList.remove('isInvalid')
                    currencyLabel.classList.remove('errorColor')
                }
            }
        }        

        //currencyExchange validation
        if (currencyExchange.value == '') {
            currencyExchangeErrors = 'Ingrese la tasa de cambio'
            currencyExchangeErrorText.innerText = currencyExchangeErrors
            currencyExchange.classList.add('isInvalid')
            exchangeLabel.classList.add('errorColor')
        }else{
            if (isNaN(currencyExchange.value)) {
                currencyExchangeErrors = 'El valor debe ser numérico. Utilice "." como separador de miles.'
                currencyExchangeErrorText.innerText = currencyExchangeErrors
                currencyExchange.classList.add('isInvalid')
                exchangeLabel.classList.add('errorColor')
            }else{
                currencyExchangeErrorText.innerText = ''
                currencyExchange.classList.remove('isInvalid')
                exchangeLabel.classList.remove('errorColor')
            }
        }

        if (currencyNameErrors != '' || currencyExchangeErrors != '') {            
            event.preventDefault()
        }
    })

})