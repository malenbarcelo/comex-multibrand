export function createPoInputsData(poData,currency) {

    const divPoFob = document.getElementById('divPoFob')
    const divPoBoxes = document.getElementById('divPoBoxes')
    const divPoVolume = document.getElementById('divPoVolume')
    const divPoWeight = document.getElementById('divPoWeight')

    var poFob = 0
    var poBoxes = 0
    var poWeight = 0
    var poVolume = 0

    divPoFob.innerHTML = '<b>FOB:</b> ' + currency + ' ' + poFob.toFixed(2)
    divPoBoxes.innerHTML = '<b>Cajas:</b> ' + poBoxes.toFixed(2)
    divPoWeight.innerHTML = '<b>Peso:</b> ' + poWeight.toFixed(2) + ' kg'
    divPoVolume.innerHTML = '<b>Volumen:</b> ' + poVolume.toFixed(3) + ' m3'

    poData.forEach(item => {
        poFob += parseFloat(item.total_fob_supplier_currency,2)
        divPoFob.innerHTML = '<b>FOB:</b> ' + currency + ' ' + poFob.toFixed(2)

        poBoxes += parseFloat(item.boxes,2)
        divPoBoxes.innerHTML = '<b>Cajas:</b> ' + poBoxes.toFixed(2)

        poWeight += parseFloat(item.total_weight_kg,2)
        divPoWeight.innerHTML = '<b>Peso:</b> ' + poWeight.toFixed(2) + ' kg'

        poVolume += parseFloat(item.total_volume_m3,2)
        divPoVolume.innerHTML = '<b>Volumen:</b> ' + poVolume.toFixed(3) + ' m3'
        
    })

    return {poFob,poBoxes,poWeight,poVolume}
}