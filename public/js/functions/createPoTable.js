export function createPoTable(newItem) {

    const body = document.getElementById('body')
    
    const line1 = '<th class="aTh2">' + newItem.item + '</th>'
    const line2 = '<th class="aTh2">' + newItem.description + '</th>'
    const line3 = '<th class="aTh2">' + newItem.mu_quantity + '</th>'
    const line4 = '<th class="aTh2">' + newItem.measurement_unit + '</th>'
    const line5 = '<th class="aTh2">' + newItem.fob_supplier_currency + '</th>'
    const line6 = '<th class="aTh2">' + newItem.mu_per_box + '</th>'
    const line7 = '<th class="aTh2">' + newItem.volume_m3 + '</th>'
    const line8 = '<th class="aTh2">' + newItem.weight_kg + '</th>'
    const line9 = '<th class="aTh2">' + newItem.boxes + '</th>'
    const line10 = '<th class="aTh2">' + newItem.total_fob_supplier_currency + '</th>'
    const line11 = '<th class="aTh2">' + newItem.total_volume_m3 + '</th>'
    const line12 = '<th class="aTh2">' + newItem.total_weight_kg + '</th>'
    const line13 = '<th class="aTh2"><i class="fa-regular fa-pen-to-square aEdit1" id="editItem_' + newItem.counter + '"></i></th>'
    const line14 = '<th class="aTh2"><i class="fa-regular fa-trash-can aEdit1" id="deleteItem_' + newItem.counter +'"></i></th>'

    body.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line12 + line13 + line14 + '</tr>'
    

}