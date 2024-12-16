const { raw } = require('mysql2')
const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_suppliers


const suppliersQueries = {
    getAllSuppliers: async() => {
        const allSuppliers = await model.findAll({
            order:['supplier'],
            include: [
                {association: 'supplier_currency'},
                {association: 'supplier_country'},
                {association: 'supplier_volume_factors'},
                {association: 'supplier_coeficient_factors'},
                {association: 'supplier_brunches'},
            ],
            nest:true
        })
        return allSuppliers
    },
    brunchSuppliers: async(idBrunch) => {
        const allSuppliers = await model.findAll({
            order:['supplier'],
            include: [
                {association: 'supplier_currency'},
                {association: 'supplier_country'},
                {
                    association: 'supplier_volume_factors',
                    separate: true, // to allow specific order
                    order: [['id', 'DESC']],
                },
                {
                    association: 'supplier_coeficient_factors',
                    separate: true, // to allow specific order
                    order: [['id', 'DESC']],
                },
                {
                    association: 'supplier_brunches',
                    where: {
                        id_brunches: idBrunch
                    }
                },
            ],
            nest:true,
        })
        return allSuppliers
    },
    getData: async(idBrunch) => {
        const allSuppliers = await model.findAll({
            order:['supplier'],
            include: [
                {association: 'supplier_currency'},
                {association: 'supplier_country'},
                {association: 'supplier_volume_factors'},
                {association: 'supplier_coeficient_factors'},
                {
                    association: 'supplier_brunches',
                    where: {
                        id_brunches: idBrunch
                    }
                },
            ],
            nest:true,
        })
        return allSuppliers
    },
    filterSupplier: async(idSupplier) => {
        const supplier = await model.findOne({
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
        const supplierId = await model.findOne({
            where:{supplier:supplier},
        })
        return supplierId
    },
    editSupplier: async(idSupplier, idCurrency,idCountry,supplierName,supplierBusinessName,supplierAddress) => {
        await model.update(
            {
            id_currencies:idCurrency,
            id_countries:idCountry,
            supplier:supplierName,
            business_name:supplierBusinessName,
            address:supplierAddress
            },
            {where:{id:idSupplier}}
    )},
    create: async(data) => {
        const newSupplier = await model.create(data)
        return newSupplier
    },
    update: async(newData,supplierId) => {
        console.log(newData)
        console.log(supplierId)
        
        await model.update(
            newData,
            {
                where:{
                    id: supplierId
                }
            }
        )}
}       

module.exports = suppliersQueries