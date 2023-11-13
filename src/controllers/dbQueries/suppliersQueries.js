const db = require('../../../database/models')
const sequelize = require('sequelize')

const suppliersQueries = {
    allSuppliers: async() => {
        const allSuppliers = await db.Suppliers.findAll({
            order:['supplier'],
            include: [
                {association: 'supplier_currency'},
                {association: 'supplier_country'}
            ],
            raw:true,
            nest:true
        })
        return allSuppliers
    },
    filterSupplier: async(idSupplier) => {
        const supplier = await db.Suppliers.findOne({
            order:['supplier'],
            where:{id:idSupplier},
            include: [
                {association: 'supplier_currency'},
                {association: 'supplier_country'}
            ],
            raw:true,
            nest:true
        })
        return supplier
    },
    supplierId: async(supplier) => {
        const supplierId = await db.Suppliers.findOne({
            where:{supplier:supplier},
        })
        return supplierId
    },
    editSupplier: async(idSupplier, idCurrency,idCountry,supplierName,supplierBusinessName,supplierAddress) => {
        await db.Suppliers.update(
            {
            id_currencies:idCurrency,
            id_countries:idCountry,
            supplier:supplierName,
            business_name:supplierBusinessName,
            address:supplierAddress
            },
            {where:{id:idSupplier}}
    )},
    createSupplier: async(idCurrency,idCountry,supplierName,supplierBusinessName,supplierAddress) => {
        await db.Suppliers.create({
            id_currencies:idCurrency,
            id_countries:idCountry,
            supplier:supplierName,
            business_name:supplierBusinessName,
            address:supplierAddress
        })
    }
}       

module.exports = suppliersQueries