
let globals = {
    editFrom: '',
    process: '',
    poData: {'fob':0,'volume':0,'boxes':0,'weight':0},
    poDetails: [],
    PO: '',
    supplierId: 0,
    importData: '',
    inputReceptionDate:'',
    inputCurrencyExchange:'',
    inputFreight:'',
    inputInsurance:'',
    inputForwarder:'',
    inputDomesticFreight:'',
    inputDispatchExpenses:'',
    inputOfficeFees:'',
    inputContainerCosts:'',
    inputPortExpenses:'',
    inputDutiesTarifs:'',
    inputContainerInsurance:'',
    inputPortContribution:'',
    inputOtherExpenses:'',
    showPricesPopup: document.getElementById('showPricesPopup'),//showPricesPopup
    yesNoText: document.getElementById('yesNoText'),//showPricesPopup
    yesNoClosePopup: document.getElementById('yesNoClosePopup'),//showPricesPopup
    yesButton: document.getElementById('yesButton'),//showPricesPopup
    noButton: document.getElementById('noButton'),//showPricesPopup
    alertPopup: document.getElementById('alertPopup'),//alertPopup
    alertText: document.getElementById('alertText'),//alertPopup
    acceptAlertButton: document.getElementById('acceptAlertButton'),//alertPopup
    acceptCancelPopup: document.getElementById('acceptCancelPopup'),//acceptCancelPopup
    acceptCancelClose: document.getElementById('acceptCancelClose'),//acceptCancelPopup
    cancelEdit: document.getElementById('cancelEdit'),//acceptCancelPopup
    acceptEdit: document.getElementById('acceptEdit'),//acceptCancelPopup
    editItemFob: document.getElementById('editItemFob'),//acceptCancelPopup
    editItemQty: document.getElementById('editItemQty'),//acceptCancelPopup
    editItemRow: 0,//acceptCancelPopup
    acceptEditTitle: document.getElementById('acceptEditTitle'),//acceptCancelPopup
    infoPopup: document.getElementById('infoPopup'),//infoPopup
    
}

export default globals
