const db = require('../../../database/models')
const sequelize = require('sequelize')

const purchaseOrdersQueries = {
    filterLast100: async(idBrunch) => {
        const filaterLast30 = await db.Purchase_orders.findAll({
            order:[['po_year','DESC'],['po_number','DESC']],
            limit:100,
            include: [
                {association: 'purchase_order_supplier'},
                {association: 'purchase_order_currency'}
            ],
            where:{id_brunches:idBrunch},
            raw:true,
            nest:true
        })
        return filaterLast30
    },
    brunchPos: async(idBrunch) => {
        const brunchPos = await db.Purchase_orders.findAll({
            include: [
                {association: 'purchase_order_supplier'},
                {association: 'purchase_order_currency'},
                {association: 'purchase_order_brunch'}

            ],
            where:{id_brunches:idBrunch},
            raw:true,
            nest:true
        })
        return brunchPos
    },
    lastPo: async(idBrunch) => {

        const date =  new Date()
        const year = date.getFullYear()
        
        const yearPos = await db.Purchase_orders.findAll({
            where:{id_brunches:idBrunch,po_year:year}
          })
        
        const lastPo = await db.Purchase_orders.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('po_number')), 'po_number']],
            where:{id_brunches:idBrunch,po_year:year}
          })

        if (yearPos.length == 0) {
            return 1
        }else{
            return lastPo.po_number + 1
        }
    },
    deletePoDetails: async(idPo) => {
        //delete po if exists
        await db.Purchase_orders_details.destroy({
            where:{id_pos:idPo}
        })
    },
    deletePo: async(idPo) => {
        //delete po if exists
        await db.Purchase_orders.destroy({
            where:{id:idPo}
        })
    },
    createPo: async(data) => {
        const date = new Date()

        let year = data.purchaseOrder.split('.')
        year = year[2]
        year = '20' + year

        //create po
        await db.Purchase_orders.create({
            purchase_order:data.purchaseOrder,
            po_number:data.poNumber,
            po_date:data.date,
            po_year:year,
            id_brunches:data.idBrunch,
            id_suppliers:data.idSupplier,
            id_currencies:data.idCurrency,
            total_fob_supplier_currency:(parseFloat(data.poFobSupplierCurrency,2)),
            total_volume_m3:(parseFloat(data.poVolume,4)),
            total_weight_kg:(parseFloat(data.poWeight,2)),
            total_boxes: (parseFloat(data.poBoxes,2)),
            costing: null,
            status:'En proceso',
            reception:null,
            cost_calculation:data.costCalculation
        })
    },
    editPo: async(data,idPo) => {

        //edit po
        await db.Purchase_orders.update(
            {
                total_fob_supplier_currency:(parseFloat(data.poFobSupplierCurrency,2)),
                total_volume_m3:(parseFloat(data.poVolume,4)),
                total_weight_kg:(parseFloat(data.poWeight,2)),
                total_boxes: (parseFloat(data.poBoxes,2))
            },
            {where:{id:idPo}}
        )
    },
    receivePo: async(data) => {

        await db.Purchase_orders.update(
            {
                reception_date: data.reception_date,
                exchange_rate: data.exchange_rate,
                total_fob_local_currency: data.total_fob_local_currency,
                freight_local_currency: data.freight_local_currency,
                insurance_local_currency: data.insurance_local_currency,
                cif_local_currency: data.cif_local_currency,
                forwarder_local_currency: data.forwarder_local_currency,
                domestic_freight_local_currency: data.domestic_freight_local_currency,
                dispatch_expenses_local_currency: data.dispatch_expenses_local_currency,
                office_fees_local_currency: data.office_fees_local_currency,
                container_costs_local_currency: data.container_costs_local_currency,
                port_expenses_local_currency: data.port_expenses_local_currency,
                duties_tarifs_local_currency: data.duties_tarifs_local_currency,
                container_insurance_local_currency: data.container_insurance_local_currency,
                port_contribution_local_currency: data.port_contribution_local_currency,
                other_expenses_local_currency: data.other_expenses_local_currency,
                total_expenses_local_currency: data.total_expenses_local_currency,
                total_costs_local_currency: data.total_costs_local_currency,
                total_volume_expense_local_currency: data.total_volume_expense,
                total_price_expense_local_currency: data.total_price_expense
            },
            {where:{purchase_order:data.purchase_order}}
        )
    },
    createPoDetails: async(data,idPo) => {

        poDetails = data.poData

        //create po details
        for (let i = 0; i < poDetails.length; i++) {
            await db.Purchase_orders_details.create({
                id_pos:idPo,
                item:poDetails[i].item,
                description:poDetails[i].description,
                id_measurement_units:poDetails[i].id_measurement_units,
                mu_quantity:poDetails[i].mu_quantity,
                units_quantity:poDetails[i].units_quantity,
                mu_per_box:poDetails[i].mu_per_box,
                boxes:poDetails[i].boxes,
                weight_kg:poDetails[i].weight_kg,
                total_weight_kg:poDetails[i].total_weight_kg,
                volume_m3:poDetails[i].volume_m3,
                total_volume_m3:poDetails[i].total_volume_m3,
                fob_supplier_currency:poDetails[i].fob_supplier_currency,
                total_fob_supplier_currency:poDetails[i].total_fob_supplier_currency,
                brand:poDetails[i].brand,
                pays_duties_tarifs: poDetails[i].pays_duties_tarifs
            })            
        }
    },
    lastIdPo: async(idBrunch) => {
        const lastIdPo = await db.Purchase_orders.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('id')), 'id']],
            where:{id_brunches:idBrunch}
          })

          return lastIdPo.id
    },
    filterPo: async(purchaseOrder) => {
        const poData = await db.Purchase_orders.findOne({
            where:{purchase_order:purchaseOrder},
            include: [
                {association: 'purchase_order_supplier'},
                {association: 'purchase_order_currency'}
            ],
            raw:true,
            nest:true
          })

          return poData
    },
    filterPoById: async(idPO) => {
        const poData = await db.Purchase_orders.findOne({
            where:{id:idPO},
            include: [
                {association: 'purchase_order_supplier'},
                {association: 'purchase_order_currency'}
            ],
            raw:true,
            nest:true
          })

          return poData
    },
    getPoDetails: async(idPo) => {
        const poDetails = await db.Purchase_orders_details.findAll({
            where:{id_pos:idPo},
            include: [
                {association: 'purchase_order_detail_po'},
                {association: 'purchase_order_detail_mu'}
            ],
            raw:true,
            nest:true
          })

          return poDetails
    },
    getPosWithItem: async(item) => {
        const poDetails = await db.Purchase_orders_details.findAll({
            where:{item:item},
            include: [
                {association: 'purchase_order_detail_po'},
                {association: 'purchase_order_detail_mu'}
            ],
            raw:true,
            nest:true
          })

          return poDetails
    },
    
}       

module.exports = purchaseOrdersQueries