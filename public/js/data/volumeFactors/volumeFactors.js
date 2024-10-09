
import { dominio } from "../../dominio.js"
import vfg from "./globals.js"
import { closePopupsEventListeners } from "../../generalFunctions.js"
import { printVolumeFactors } from "./printVolumeFactors.js"
import { getData, sumVolumeExpenses, suppliersSelect } from "./functions.js"

//popups event listeners
import { cvfppEventListeners} from "./volumeFactorsCVFPP.js"

window.addEventListener('load',async()=>{

    //show popup
    volumeFactorsLoader.style.display = 'block'

    //get data
    await getData()

    //popups event listeners
    cvfppEventListeners()
    
    //print table
    printVolumeFactors()

    //close popups
    let closePopups = [cvfppClose]
    closePopupsEventListeners(closePopups)

    //create factor
    createVolumeFactor.addEventListener('click',async()=>{
        cvfppTitle.innerText = 'CREAR FACTOR'
        cvfppEdit.style.display = 'none'
        cvfppCreate.style.display = 'block'
        vfg.action = 'create'
        suppliersSelect()
        sumVolumeExpenses()
        cvfpp.style.display = 'block'
    })

})