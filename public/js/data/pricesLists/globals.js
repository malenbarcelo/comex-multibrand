let g = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    idBrunch:0,
    popups:[aipp,ulpp],
    aippInputs:[aippSupplier, aippItem, aippDescription, aippFob, aippMu, aippMaster, aippWeight, aippVolume, aippBrand, aippOrigin, aippBreaks],
    pricesLists:[],
    pricesListsFiltered:[],
    currencies:[],
    mus:[],
    itemId:0
}

export default g