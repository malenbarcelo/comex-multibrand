
import { dominio } from "../../dominio.js"
import vfg from "./globals.js"
import { closePopupsEventListeners,clearInputs, isValid } from "../../generalFunctions.js"
import { printVolumeFactors } from "./printVolumeFactors.js"
import { getData, sumVolumeExpenses, suppliersSelect } from "./functions.js"

//popups event listeners
import { cvfppEventListeners} from "./volumeFactorsCVFPP.js"

window.addEventListener('load',async()=>{

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
        const inputs = [cvfppSupplier,cvfppStdVolume,cvfppStdVolumeMU,cvfppStdCtn,cvfppStdFreight,cvfppFreight,cvfppStdTerminalExpenses,cvfppTerminalExpenses,cvfppStdDispatchExpenses,cvfppDispatchExpenses,cvfppStdMaritimeAgencyExpenses,cvfppMaritimeAgencyExpenses,cvfppStdDomesticFreight,cvfppDomesticFreight,cvfppCustomAgent,cvfppInsurance,cvfppTransference,cvfppimportDuty,cvfppSalesMargin]
        cvfppTitle.innerText = 'CREAR FACTOR'
        cvfppCreate.innerText = 'Crear'
        vfg.action = 'create'
        clearInputs(inputs)
        isValid(inputs)
        suppliersSelect()
        sumVolumeExpenses()
        cvfpp.style.display = 'block'
    })

})