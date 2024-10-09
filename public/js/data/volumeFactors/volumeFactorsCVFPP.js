import vfg from "./globals.js"
import { sumVolumeExpenses } from "./functions.js"

//CREATE VOLUME FACTORS POPUP (CVFPP)
async function cvfppEventListeners() {

    //change supplier or mu
    const selects = [cvfppSupplier, cvfppStdVolumeMU]
    const stdMuTexts = [cvfppStdVolumeMUtext1, cvfppStdVolumeMUtext2,cvfppStdVolumeMUtext3,cvfppStdVolumeMUtext4,cvfppStdVolumeMUtext5]
    const mUTexts = [cvfppMU1,cvfppMU2,cvfppMU3,cvfppMU4,cvfppMU5]
    selects.forEach(select => {
        select.addEventListener('change',async()=>{
            if (cvfppSupplier.value != '') {
                const supplier = vfg.suppliers.filter( s => s.id == cvfppSupplier.value)[0]

                stdMuTexts.forEach(element => {
                    element.innerText = supplier.supplier_currency.currency + ' por vol. std -- '
                })
                
                if (cvfppStdVolumeMU.value != '') {
                    mUTexts.forEach(element => {
                        element.innerText = supplier.supplier_currency.currency + '/' + cvfppStdVolumeMU.value + '/ctnd std'
                    })
                }else{
                    mUTexts.forEach(element => {
                        element.innerText = ''
                    })
                }
            }else{
                stdMuTexts.forEach(element => {
                    element.innerText = ' -- '
                })
                mUTexts.forEach(element => {
                    element.innerText = ''
                })
            }
        })
    })

    //change volume std freight
    cvfppStdVolume.addEventListener('change',async()=>{
        if (cvfppStdVolume.value == 0 || cvfppStdVolume.value == '') {
            cvfppFreight.value = '?'
            cvfppTerminalExpenses.value = '?'
            cvfppDispatchExpenses.value = '?'
            cvfppMaritimeAgencyExpenses.value = '?'
            cvfppDomesticFreight.value = '?'
        }else{
            cvfppFreight.value = (cvfppStdFreight.value == '' || cvfppStdFreight.value == 0) ? '?' : parseFloat(cvfppStdFreight.value / cvfppStdVolume.value,4).toFixed(4)

            cvfppTerminalExpenses.value = (cvfppStdTerminalExpenses.value == '' || cvfppStdTerminalExpenses.value == 0) ? '?' : parseFloat(cvfppStdTerminalExpenses.value / cvfppStdVolume.value,4).toFixed(4)

            cvfppDispatchExpenses.value = (cvfppStdDispatchExpenses.value == '' || cvfppStdDispatchExpenses.value == 0) ? '?' : parseFloat(cvfppStdDispatchExpenses.value / cvfppStdVolume.value,4).toFixed(4)

            cvfppMaritimeAgencyExpenses.value = (cvfppStdMaritimeAgencyExpenses.value == '' || cvfppStdMaritimeAgencyExpenses.value == 0) ? '?' : parseFloat(cvfppStdMaritimeAgencyExpenses.value / cvfppStdVolume.value,4).toFixed(4)

            cvfppDomesticFreight.value = (cvfppStdDomesticFreight.value == '' || cvfppStdDomesticFreight.value == 0) ? '?' : parseFloat(cvfppStdDomesticFreight.value / cvfppStdVolume.value,4).toFixed(4)
        }

        sumVolumeExpenses()
    })

    //change std data
    cvfppStdFreight.addEventListener('change',async()=>{
        cvfppFreight.value = (cvfppStdVolume.value == 0 || cvfppStdVolume.value == '' || cvfppStdFreight.value == 0 || cvfppStdFreight.value == '') ? '?' : parseFloat(cvfppStdFreight.value / cvfppStdVolume.value,4).toFixed(4)
        cvfppTotalVolumeExpenses.value = 0
    })

    cvfppStdTerminalExpenses.addEventListener('change',async()=>{
        cvfppTerminalExpenses.value = (cvfppStdVolume.value == 0 || cvfppStdVolume.value == '' || cvfppStdTerminalExpenses.value == '' || cvfppStdTerminalExpenses.value == 0) ? '?' : parseFloat(cvfppStdTerminalExpenses.value / cvfppStdVolume.value,4).toFixed(4)
        sumVolumeExpenses()
    })

    cvfppStdDispatchExpenses.addEventListener('change',async()=>{
        cvfppDispatchExpenses.value = (cvfppStdVolume.value == 0 || cvfppStdVolume.value == '' || cvfppStdDispatchExpenses.value == '' || cvfppStdDispatchExpenses.value == 0) ? '?' : parseFloat(cvfppStdDispatchExpenses.value / cvfppStdVolume.value,4).toFixed(4)
        sumVolumeExpenses()
    })

    cvfppStdMaritimeAgencyExpenses.addEventListener('change',async()=>{
        cvfppMaritimeAgencyExpenses.value = (cvfppStdVolume.value == 0 || cvfppStdVolume.value == '' || cvfppStdMaritimeAgencyExpenses.value == '' || cvfppStdMaritimeAgencyExpenses.value == 0) ? '?' : parseFloat(cvfppStdMaritimeAgencyExpenses.value / cvfppStdVolume.value,4).toFixed(4)
        sumVolumeExpenses()
    })

    cvfppStdDomesticFreight.addEventListener('change',async()=>{
        cvfppDomesticFreight.value = (cvfppStdVolume.value == 0 || cvfppStdVolume.value == '' || cvfppStdDomesticFreight.value == '' || cvfppStdDomesticFreight.value == 0) ? '?' : parseFloat(cvfppStdDomesticFreight.value / cvfppStdVolume.value,4).toFixed(4)
        sumVolumeExpenses()
    })

    
}

export {cvfppEventListeners}