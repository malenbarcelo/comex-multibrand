import { dominio } from "./dominio.js"

window.addEventListener('load', async () => {
    const users = await (await fetch(dominio + 'apis/users')).json()
  
    //confirmPopup
    const confirmPopup = document.getElementById('confirmPopup')
    const confirmText = document.getElementById('confirmText')
    const confirmButton = document.getElementById('confirmButton')
    const cancelButton = document.getElementById('cancelButton')
  
    cancelButton.addEventListener("click", async (e) => {
      confirmPopup.style.display = "none"
    })
  
    function handleConfirmClick(user) {
      return async (e) => {
        await fetch(dominio + 'apis/users/restore-password/' + user.id, { method: 'POST' })
        alertify.success('Contraseña restablecida con éxito')
        confirmPopup.style.display = "none"
  
        // Eliminar el event listener después de ejecutarlo
        confirmButton.removeEventListener("click", handleConfirmClick(user))
      };
    }
  
    users.forEach(user => {
      const restore = document.getElementById('restore_' + user.id)
  
      restore.addEventListener("click", async (e) => {
        confirmText.innerHTML = '¿Confirma que desea restablecer la contraseña de <b>' + user.user_name + '</b>?'
        confirmPopup.style.display = "block"
  
        // Verificar si ya existe un evento, eliminarlo y luego agregar uno nuevo
        if (confirmButton._listener) {
          confirmButton.removeEventListener("click", confirmButton._listener)
        }
  
        const confirmClickHandler = handleConfirmClick(user)
        confirmButton._listener = confirmClickHandler
        confirmButton.addEventListener("click", confirmClickHandler)
      })
    })
  })