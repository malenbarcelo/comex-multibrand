export function createPoListeners(poData) {

    poData.forEach(item => {
        const deleteItem = document.getElementById('deleteItem_' + item.counter)
        const editItem = document.getElementById('editItem_' + item.counter)
        
        deleteItem.addEventListener("click", async() => {
            rowToDelete.value = item.counter
            itemToDeleteInput.value = item.item
            deletePopup.style.display = "block"
        })

        editItem.addEventListener("click", async() => {
            rowToEdit.value = item.counter
            editInputItem.value = item.item
            editInputQuantity.value = item.mu_quantity
            editInputFob.value = item.fob
            editPopup.style.display = "block"
        })

    })
}