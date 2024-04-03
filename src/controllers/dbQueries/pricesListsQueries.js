const db = require('../../../database/models')
const sequelize = require('sequelize')

const pricesListsQueries = {
    editItem: async(idBrunch,itemData,date,itemId) => {
        await db.Prices_lists.update(
            {
                description:itemData.description,
                fob:parseFloat(itemData.fob,3),
                id_measurement_units:itemData.selectMU,
                mu_per_box:itemData.muPerBox,
                weight_kg:itemData.weight == '' ? 0 : parseFloat(itemData.weight,3),
                volume_m3:itemData.volume == '' ? 0 : parseFloat(itemData.volume,3),
                brand:itemData.brand,
                origin: itemData.origin,
                has_breaks:itemData.hasBreaks == 'Si' ? 1 : 0,
                id_brunches: idBrunch,
                update_date: date
            },
            {where:{id:itemId}})
    },
    createItem: async(idBrunch,itemData,supplier,date,priceListNumber) => {

        await db.Prices_lists.create(
            {
                item: itemData.item,
                description:itemData.description,
                fob:parseFloat(itemData.fob,3),
                id_measurement_units:itemData.selectMU,
                mu_per_box:itemData.muPerBox,
                weight_kg:itemData.weight == '' ? 0 : parseFloat(itemData.weight,3),
                volume_m3:itemData.volume == '' ? 0 : parseFloat(itemData.volume,3),
                brand:itemData.brand,
                origin: itemData.origin,
                has_breaks:itemData.hasBreaks == 'Si' ? 1 : 0,
                id_suppliers: supplier.id,
                id_brunches: idBrunch,
                id_currencies: supplier.id_currencies,
                price_list_number:priceListNumber,
                update_date: date
            })
            
    },
    deleteItem: async(idItem) => {
        await db.Prices_lists.destroy({where:{id:idItem}})
    },
    supplierPriceList: async(idBrunch,idSupplier) => {

        const priceListNumber = await db.Prices_lists.max('price_list_number',
         { where: { 
            id_suppliers: idSupplier,
            id_brunches: idBrunch
         } })

        const supplierPriceList = await db.Prices_lists.findAll({
            order:['item'],
            include: [
                {association: 'price_list_supplier'},
                {association: 'price_list_mu'},
                {association: 'price_list_currency'}
            ],
            where:{id_brunches:idBrunch,
                id_suppliers:idSupplier,
                price_list_number:priceListNumber
            },
            raw:true,
            nest:true
        })
        return supplierPriceList
    },
    filterItem: async(idItem) => {
        const item = await db.Prices_lists.findOne({
            where:{id:idItem},
            include: [
                {association: 'price_list_currency'},
                {association: 'price_list_supplier'},
                {association: 'price_list_mu'}
            ],
            raw:true,
            nest:true
        })
        return item
    },
}

module.exports = pricesListsQueries