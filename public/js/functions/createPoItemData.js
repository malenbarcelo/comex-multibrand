export function createPoItemData(item,counter,muQuantity,fob) {
    
    const unitsQuantity = item.price_list_mu.units_per_um * document.getElementById('quantity').value
    const muPerBox = parseFloat(item.mu_per_box,2)
    const boxes = (parseFloat(muQuantity,2) / parseFloat(item.mu_per_box,2)).toFixed(2)
    const weightKg = (parseFloat(item.weight_kg,3)).toFixed(3)
    const totalWeightKg = (weightKg * boxes).toFixed(3)
    const volumeM3 = (parseFloat(item.volume_m3,4)).toFixed(4)
    const totalVolumeM3 = (volumeM3 * boxes).toFixed(4)
    
    const totalFob = (muQuantity * fob).toFixed(2)
    const currency = item.price_list_currency.currency

    const itemData = {
        'counter':counter,
        'id':item.id,
        'item':item.item,
        'description':item.description,
        'id_measurement_units':item.price_list_mu.id,
        'measurement_unit':item.price_list_mu.measurement_unit,
        'mu_quantity':muQuantity,
        'units_quantity':unitsQuantity,
        'mu_per_box':muPerBox,
        'boxes':boxes,
        'weight_kg':weightKg,
        'total_weight_kg':totalWeightKg,
        'volume_m3':volumeM3,
        'total_volume_m3':totalVolumeM3,
        'fob':fob,
        'total_fob':totalFob,
        'brand':item.brand,
        'currency':currency
    }

    return itemData

    
}