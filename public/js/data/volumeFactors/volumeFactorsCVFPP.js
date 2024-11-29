import { dominio } from "../../dominio.js"
import vfg from "./globals.js"
import { sumVolumeExpenses,getData } from "./functions.js"
import { inputsValidation, showOkPopup } from "../../generalFunctions.js"
import { printVolumeFactors} from "./printVolumeFactors.js"

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

    cvfppCreate.addEventListener('click',async()=>{

        const inputs = [cvfppSupplier,cvfppStdVolume,cvfppStdVolumeMU,cvfppStdCtn,cvfppStdFreight,cvfppStdTerminalExpenses,cvfppStdDispatchExpenses,cvfppStdMaritimeAgencyExpenses,cvfppStdDomesticFreight,cvfppCustomAgent,cvfppInsurance,cvfppTransference,cvfppimportDuty,cvfppSalesMargin]
        const errors = inputsValidation(inputs)

        if (errors == 0) {
            const data = {
                dataToCreate: {
                    supplier: vfg.suppliers.filter( s => s.id == cvfppSupplier.value)[0].supplier,
                    id_brunches:parseInt(vfg.idBrunch),
                    id_suppliers:parseInt(cvfppSupplier.value),
                    std_volume:parseFloat(cvfppStdVolume.value,2),
                    volume_mu:cvfppStdVolumeMU.value,
                    std_container:parseFloat(cvfppStdCtn.value,3),
                    std_freight:parseFloat(cvfppStdFreight.value,3),
                    freight:parseFloat(cvfppFreight.value,3),
                    std_terminal_expenses:parseFloat(cvfppStdTerminalExpenses.value,3),
                    terminal_expenses:parseFloat(cvfppTerminalExpenses.value,3),
                    std_dispatch_expenses:parseFloat(cvfppStdDispatchExpenses.value,3),
                    dispatch_expenses:parseFloat(cvfppDispatchExpenses.value,3),
                    std_maritime_agency_expenses:parseFloat(cvfppStdMaritimeAgencyExpenses.value,3),
                    maritime_agency_expenses:parseFloat(cvfppMaritimeAgencyExpenses.value,3),
                    std_domestic_freight:parseFloat(cvfppStdDomesticFreight.value,3),
                    domestic_freight:parseFloat(cvfppDomesticFreight.value,3),
                    total_volume_expenses:parseFloat(cvfppTotalVolumeExpenses.value,3),
                    volume_expenses_mu:cvfppMU1.innerText,
                    custom_agent:parseFloat(cvfppCustomAgent.value,3)/100,
                    insurance:parseFloat(cvfppInsurance.value,3)/100,
                    transference:parseFloat(cvfppTransference.value,3)/100,
                    import_duty:parseFloat(cvfppimportDuty.value,3)/100,
                    sales_margin:parseFloat(cvfppSalesMargin.value,3)/100,
                    enabled:1
                },
                action: vfg.action
                
            }

            await fetch(dominio + 'data/apis/volume-factors/create',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            bodyVolumeFactors.innerHTML = ''

            //show loader
            volumeFactorsLoader.style.display = 'block'

            cvfpp.style.display = 'none'

            //get data
            await getData()

            //print table
            printVolumeFactors()

            //edit header
            itemsMenu5Text.classList.add('itemHeaderMenuError')
            itemsMenu5Text.classList.remove('itemHeaderMenu')

            //show popup
            okppText.innerText = 'Coeficiente creado con éxito'
            showOkPopup(okpp)
            
        }
    })

    
}

export {cvfppEventListeners}