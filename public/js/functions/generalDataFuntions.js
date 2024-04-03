function clearData(inputs, errors, labels,selects) {

    inputs.forEach(input => {
        input.value = ''
        input.classList.remove('isInvalid')        
    })

    errors.forEach(error => {
        error.innerText = ''      
    })

    labels.forEach(label => {
        label.classList.remove('errorColor')      
    })

    if (selects != undefined) {
        for (let i = 0; i < selects.length; i++) {
            const defaultOption = document.getElementById('defaultOption' + i)
            defaultOption.selected = true
            selects[i].classList.remove('isInvalid')
        }
    }
}

function isInvalid(errorLabel, input) {

    errorLabel.classList.add('errorColor')
    input.classList.add('isInvalid')

}

function isValid(errorText, errorLabel, input) {

    errorText.innerText = ''
    errorLabel.classList.remove('errorColor')
    input.classList.remove('isInvalid')
    
}

export {clearData,isValid,isInvalid}