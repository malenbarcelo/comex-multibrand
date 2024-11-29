
let cg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        
        useGrouping: true
    }),
    popups:[lcpp,copp],
    idBrunch:0,
    changes:[],
    costings:[],
    costingsFiltered:[]
}

export default cg