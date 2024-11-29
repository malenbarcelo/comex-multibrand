const { raw } = require('mysql2')
const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')

const pricesListsQueries = {
    create: async(data) => {
        await db.Prices_lists.bulkCreate(data)
    },
    getSupplierList: async (idBrunch,idSupplier, priceListNumber) => {
        const allData = await db.Prices_lists.findAll({
            include: [
                {association: 'currency_data'},
                {association: 'supplier_data'},
                {association: 'mu_data'}
            ],
            where:{
                id_brunches:idBrunch,
                id_suppliers: idSupplier,
                price_list_number: priceListNumber
            },
            raw:true,
            nest:true
        });

        return allData
    },
    edit: async(id,data) => {
        await db.Prices_lists.update(
            data,
            {where:{id:id}})
    },


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
                {association: 'supplier_data'},
                {association: 'mu_data'},
                {association: 'currency_data'}
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
                {association: 'currency_data'},
                {association: 'supplier_data'},
                {association: 'mu_data'}
            ],
            raw:true,
            nest:true
        })
        return item
    },
    getData: async (idBrunch,conditions) => {
        const allData = await db.Prices_lists.findAll({
            include: [
                {association: 'currency_data'},
                {association: 'supplier_data'},
                {association: 'mu_data'}
            ],
            where:{
                id_brunches:idBrunch,
                [Op.or]: conditions
            },
            order: [[{ model: db.Suppliers, as: 'supplier_data' }, 'supplier', 'ASC'],[['item','ASC']]],
            raw:true,
            nest:true
        });

        return allData
    },
    allData: async (idBrunch) => {
        const allData = await db.Prices_lists.findAll({
            include: [
                {association: 'supplier_data'},
                {association: 'mu_data'},
                {association: 'currency_data'}
            ],
            where:{
                id_brunches:idBrunch
            },
            order:[['id','DESC']],
            raw:true,
            nest:true
        });

        return allData
    },
    uniqueItems: async (idBrunch) => {
        const uniqueItems = await db.Prices_lists.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('item')), 'item']
            ],
            where:{
                id_brunches:idBrunch
            },
            raw:true
        });

        return uniqueItems;
    },
    lastListsNumbers: async (idBrunch) => {
        const lastListsNumbers = await db.Prices_lists.findAll({
            attributes: [
                'id_suppliers',
                [sequelize.fn('MAX', sequelize.col('price_list_number')), 'max_price_list_number']
            ],
            where:{
                id_brunches:idBrunch
            },
            group: ['id_suppliers'],
            raw:true
        });
        return lastListsNumbers
    }
}

module.exports = pricesListsQueries