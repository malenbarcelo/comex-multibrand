import vfg from "./globals.js"

//CREATE VOLUME FACTORS POPUP (CVFPP)
async function cvfppEventListeners() {

    //change supplier or mu
    const selects = [cvfppSupplier, cvfppStdVolumeMU]
    selects.forEach(select => {
        select.addEventListener('change',async()=>{
            if (cvfppSupplier.value != '') {
                const supplier = vfg.suppliers.filter( s => s.id == cvfppSupplier.value)[0]
                cvfppStdVolumeMUtext.innerText = supplier.supplier_currency.currency + ' por vol. std -- '
                if (cvfppStdVolumeMU.value != '') {
                    cvfppMU.innerText = supplier.supplier_currency.currency + '/' + cvfppStdVolumeMU.value + '/ctnd std'
                }else{
                    cvfppMU.innerText = ''
                }
            }else{
                cvfppStdVolumeMUtext.innerText = ' -- '
                cvfppMU.innerText = ''
            }
        })
    })

    //change volume std freight
    cvfppStdFreight.addEventListener('change',async()=>{
        if (cvfppStdVolume.value == 0 || cvfppStdVolume.value == '' || cvfppStdFreight == 0 || cvfppStdFreight == '') {
            cvfppFreight.value = '?'
        }else{
            cvfppFreight.value = 10

        }
    })


    createVolumeFactor.addEventListener('click',async()=>{
    })

    
}

export {cvfppEventListeners}