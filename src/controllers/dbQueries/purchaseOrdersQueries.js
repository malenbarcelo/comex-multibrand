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
            order:[['po_year','DESC'],['po_number','DESC']],
            include: [
                {association: 'purchase_order_supplier'},
                {association: 'purchase_order_currency'},
                {association: 'purchase_order_brunch'},
                {association: 'details'}
            ],
            where:{id_brunches:idBrunch},
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

        const poData = await db.Purchase_orders.findOne({
            where:{id:idPo},
            raw:true,
          })

        //edit po
        await db.Purchase_orders.update(
            {
                total_fob_supplier_currency:(parseFloat(data.poFobSupplierCurrency,2)),
                total_volume_m3:(parseFloat(data.poVolume,4)),
                total_weight_kg:(parseFloat(data.poWeight,2)),
                total_boxes: (parseFloat(data.poBoxes,2)),
                status: poData.status == 'Recibida' ? 'Recibir' : poData.Status
            },
            {where:{id:idPo}}
        )
    },
    receiveImport: async(data) => {

        await db.Purchase_orders.update(data,
            {where:{purchase_order:data.purchase_order}}
        )

        //update purchase_orders_details if corresponds (only when process = 'acceptReception')
        const receptionDetails = data.details

        for (let i = 0; i < receptionDetails.length; i++) {
            await db.Purchase_orders_details.update(
                {
                    total_fob_local_currency: receptionDetails[i].total_fob_local_currency,
                    freight_and_insurance_local_currency: receptionDetails[i].freight_and_insurance_local_currency,
                    cif_local_currency: receptionDetails[i].cif_local_currency,
                    duties_tarifs_local_currency: receptionDetails[i].duties_tarifs_local_currency,
                    total_volume_expense_local_currency: receptionDetails[i].total_volume_expense_local_currency,
                    total_price_expense_local_currency: receptionDetails[i].total_price_expense_local_currency,
                    total_expense_local_currency: receptionDetails[i].total_expense_local_currency,
                    total_cost_local_currency: receptionDetails[i].total_cost_local_currency,
                    unit_cost_local_currency: receptionDetails[i].unit_cost_local_currency,
                    unit_cost_supplier_currency: receptionDetails[i].unit_cost_supplier_currency,
                    pays_duties_tarifs: receptionDetails[i].pays_duties_tarifs
                },
                {where:{id:receptionDetails[i].id}}
            )
        }
    },
    createPoDetails: async(data,idPo) => {

        poDetails = data.poData

        //create po details
        for (let i = 0; i < poDetails.length; i++) {
            await db.Purchase_orders_details.create({
                id_pos:idPo,
                id_brunches:data.idBrunch,
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
    getPosWithItem: async(idBrunch,item) => {
        let poDetails = await db.Purchase_orders_details.findAll({
            where:{
                item:item,
            },
            include: [
                {association: 'purchase_order_detail_po'},
                {association: 'purchase_order_detail_mu'}
            ],
            raw:true,
            nest:true
        })

        poDetails.filter(pos => pos.purchase_order_detail_po.id_brunches == idBrunch)
        
        return poDetails
    },
    posBySupplier: async(idBrunch) => {
        
        const posBySupplier = await db.Purchase_orders.findAll({
            attributes: [
                'id_suppliers',
                'id_currencies',
                [sequelize.literal('SUM(total_fob_supplier_currency)'), 'total_fob']
            ],
            include: [
                {association: 'purchase_order_supplier'},
                {association: 'purchase_order_currency'}
            ],
            group: ['id_suppliers','id_currencies'],
            order: [[sequelize.literal('purchase_order_supplier.supplier'), 'ASC']],
            where:{id_brunches:idBrunch},
            raw:true,
            nest:true
        })
        return posBySupplier
    },
    posBySupplierAndYear: async(idBrunch,year) => {
        
        const posBySupplier = await db.Purchase_orders.findAll({
            attributes: [
                'id_suppliers',
                'id_currencies',
                'po_year',
                [sequelize.literal('SUM(total_fob_supplier_currency)'), 'total_fob']
            ],
            include: [
                {association: 'purchase_order_supplier'},
                {association: 'purchase_order_currency'}
            ],
            group: ['id_suppliers','id_currencies','po_year'],
            order: [[sequelize.literal('purchase_order_supplier.supplier'), 'ASC']],
            where:{id_brunches:idBrunch,po_year:year},
            raw:true,
            nest:true
        })
        return posBySupplier
    },
    itemsLastPo: async(idBrunch) => {
        
        const posBySupplier = await db.Purchase_orders_details.findAll({
            attributes: [[sequelize.fn('max', sequelize.col('po_number')), 'po_number']],
            where:{id_brunches:idBrunch},
            raw:true,
            nest:true
        })
        return posBySupplier
    },
}       

module.exports = purchaseOrdersQueries