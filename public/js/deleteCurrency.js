import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

    const idBrunch = document.getElementById('idBrunch').innerText
    const confirmPopup = document.getElementById('confirmPopup')
    const confirmButton = document.getElementById('confirmButton')
    const cancelButton = document.getElementById('cancelButton')
    const confirmText = document.getElementById('confirmText')
    const brunchCurrencies = await (await fetch(dominio + 'apis/' + idBrunch + '/brunch-currencies')).json()

    cancelButton.addEventListener("click", () => {
        confirmPopup.style.display = "none"
    })

    

    brunchCurrencies.forEach(currency => {

        const deleteCurrency = document.getElementById('deleteCurrency_' + currency.id)
        const currencyToDelete = brunchCurrencies.filter(currency => currency.id == deleteCurrency.id.split('_')[1])
        const currencyName = currencyToDelete[0].currency_exchange_currency.currency
        
        deleteCurrency.addEventListener("click",async(e)=>{

            confirmButton.addEventListener("click", async() => {
                try{
                    await fetch(dominio + 'apis/delete-currency/' + currency.id,{method:'DELETE'})
                    window.location.href = '/data/' + idBrunch + '/currencies'
                }catch(error){

                    console.log('ha ocurrido un error')

                    console.log(error)
                }
            })

            confirmText.innerText = '¿Confirma que desea eliminar la moneda "' + currencyName + '"?'
    
            //Show popup
            confirmPopup.style.display = "block"
        })

        
    })

})