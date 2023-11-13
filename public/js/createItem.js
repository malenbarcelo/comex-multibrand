import { dominio } from "./dominio.js"

window.addEventListener('load',async()=>{

    //createItem.ejs
    const saveButton = document.getElementById('saveButton')
    const supplier = document.getElementById('supplier').value    

    //confirmPopup
    const confirmPopup = document.getElementById('confirmPopup')
    const cancelButton = document.getElementById('cancelButton')
    const confirmText = document.getElementById('confirmText')
    
    saveButton.addEventListener("click",async(e)=>{

        let item = document.getElementById('item').value

        confirmText.innerText = '¿Confirma que desea crear el item ' + item + ' de ' + supplier + '?'  

        cancelButton.addEventListener("click", async() => {
            confirmPopup.style.display = "none"
        })

        //Show popup
        confirmPopup.style.display = "block"
    })

})



