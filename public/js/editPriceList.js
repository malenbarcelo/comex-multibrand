import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

    //pricesLists.ejs
    const saveButton = document.getElementById('saveButton')
    const item = document.getElementById('item').value
    const supplier = document.getElementById('supplier').value    

    //confirmPopup
    const confirmPopup = document.getElementById('confirmPopup')
    const cancelButton = document.getElementById('cancelButton')
    const confirmText = document.getElementById('confirmText')
    
    saveButton.addEventListener("click",async(e)=>{

        confirmText.innerText = '¿Confirma que desea editar el item ' + item + ' de ' + supplier + '?'  

        cancelButton.addEventListener("click", async() => {
            confirmPopup.style.display = "none"
        })

        //Show popup
        confirmPopup.style.display = "block"
    })

})



