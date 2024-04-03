import { dominio } from "./dominio.js"
import { clearData, isValid, isInvalid } from "./functions/generalDataFuntions.js"

window.addEventListener('load',async()=>{

    //general
    const idBrunch = document.getElementById('idBrunch').innerText
    const create = document.getElementById('create')
    const popup = document.getElementById('popup')
    const close = document.getElementById('close')
    const acceptCreate = document.getElementById('acceptCreate')
    let process = ''

    //delete user popup
    const deleteUserPopup = document.getElementById('deleteUserPopup')
    const deleteUserText = document.getElementById('deleteUserText')
    const deleteUserClose = document.getElementById('deleteUserClose')
    const cancelDelete = document.getElementById('cancelDelete')
    const formDeleteUser = document.getElementById('formDeleteUser')

    //restore passwrod popup
    const restorePswPopup = document.getElementById('restorePswPopup')
    const restorePswText = document.getElementById('restorePswText')
    const restorePswClose = document.getElementById('restorePswClose')
    const cancelRestore = document.getElementById('cancelRestore')
    const formRestorePwd = document.getElementById('formRestorePwd')

    //inputs
    const userName = document.getElementById('userName')
    const firstName = document.getElementById('firstName')
    const lastName = document.getElementById('lastName')
    const email = document.getElementById('email')
    const inputs = [userName,firstName,lastName,email]

    //selects
    const userCategory = document.getElementById('userCategory')
    const selects = [userCategory]

    //errors
    const userNameErrorText = document.getElementById('userNameErrorText')
    const firstNameErrorText = document.getElementById('firstNameErrorText')
    const lastNameErrorText = document.getElementById('lastNameErrorText')
    const userCategoryErrorText = document.getElementById('userCategoryErrorText')
    const emailErrorText = document.getElementById('emailErrorText')
    const errors = [userNameErrorText, firstNameErrorText, lastNameErrorText, userCategoryErrorText,emailErrorText]

    //labels
    const userNameLabel = document.getElementById('userNameLabel')    
    const firstNameLabel = document.getElementById('firstNameLabel')
    const labels = [userNameLabel, firstNameLabel]

    //title
    const title = document.getElementById('title')

    //data
    const data = await (await fetch(dominio + 'apis/users')).json()

    /*---------------users.ejs---------------*/
    create.addEventListener("click", () => {

        process = 'create'

        //clear data
        clearData(inputs,errors,labels,selects)

        //complete title
        title.innerText = 'Crear usuario'

        //change input
        userName.removeAttribute("readonly")

        //show popup
        popup.style.display = 'block'
    })

    data.forEach(detail => {

        const edit = document.getElementById('edit_' + detail.id)
        const deleteUser = document.getElementById('delete_' + detail.id)
        const restore = document.getElementById('restore_' + detail.id)
        
        //edit users event listeners
        edit.addEventListener("click", () => {

            process = 'edit'

            //clear data
            clearData(inputs,errors,labels,selects)

            //compelte title
            title.innerText = 'Editar usuario'

            //complete inputs
            userName.value = detail.user_name
            firstName.value = detail.first_name
            lastName.value = detail.last_name
            email.value = detail.email
            userCategory.value = detail.id_categories
            
            const selectedCategory = document.getElementById(detail.id_users_categories)
            selectedCategory.selected = true
            
            userName.setAttribute("readonly", "readonly")

            //show popup
            popup.style.display = 'block'
        })

        //delete users event listeners
        deleteUser.addEventListener("click", () => {

            formDeleteUser.action = '/users/' + idBrunch + '/delete-user/' + detail.id

            //complete text
            deleteUserText.innerHTML = 'Confirma que desea eliminar el usuario <b>' + detail.user_name + '</b> ?'

            //show popup
            deleteUserPopup.style.display = 'block'
        })
        
        //restore psw event listeners
        restore.addEventListener("click", () => {

            formRestorePwd.action = '/users/' + idBrunch + '/restore-password/' + detail.id

            //complete text
            restorePswText.innerHTML = 'Confirma que desea restablecer la contraseña del usuario <b>' + detail.user_name + '</b> ?'

            //show popup
            restorePswPopup.style.display = 'block'
        })
    })

    deleteUserClose.addEventListener("click",async(e)=>{
        deleteUserPopup.style.display = "none"
    })

    cancelDelete.addEventListener("click",async(e)=>{
        deleteUserPopup.style.display = "none"
    })

    restorePswClose.addEventListener("click",async(e)=>{
        restorePswPopup.style.display = "none"
    })

    cancelRestore.addEventListener("click",async(e)=>{
        restorePswPopup.style.display = "none"
    })
    

    /*---------------createEditUser.ejs---------------*/
    close.addEventListener("click", () => {
        popup.style.display = "none"
    })

    acceptCreate.addEventListener("click", (event) => {

        const textsToValidate = inputs
        const selectsToValidate = selects

        let errorsQty = 0

        //not empty validations
        textsToValidate.forEach(input => {
            const inputName = input.name
            const errorText = document.querySelector(`#${inputName}ErrorText`)
            const errorLabel = document.querySelector(`#${inputName}Label`)
            if (input.value == '') {
                errorsQty += 1
                errorText.innerText = 'El campo no puede estar vacío'
                isInvalid(errorLabel, input)
            }else{
                //specific validations
                const findUser = data.filter(element => element.user_name == userName.value)

                if (process == 'create') {
                    if (findUser.length > 0) {
                        errorsQty += 1
                        userNameErrorText.innerText = 'El usuario ingresado ya existe'
                        isInvalid(errorLabel, input)
                    }else{
                        isValid(errorText,errorLabel,input)
                    }
                }else{
                    isValid(errorText,errorLabel,input)
                }
            }
        })

        //selects validations
        selectsToValidate.forEach(input => {
            const inputName = input.name
            const errorText = document.querySelector(`#${inputName}ErrorText`)
            const errorLabel = document.querySelector(`#${inputName}Label`)
            if (input.value == 'default') {                
                errorsQty += 1
                errorText.innerText = 'Debe seleccionar un elemento'
                isInvalid(errorLabel,input)    
            }else{
                isValid(errorText,errorLabel,input)
            }
        })

        if (errorsQty > 0) {            
            event.preventDefault()
        }

    })

})