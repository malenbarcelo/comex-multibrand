module.exports = (sequelize, DataTypes) => {

   const alias = "Suppliers"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      supplier:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      business_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      address:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_countries:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_currencies:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      cost_calculation:{
         type: DataTypes.STRING,
         allowNull: false,
      }
   }
   const config = {
      tableName : 'suppliers',
      timestamps : false
   }

   const Supplier = sequelize.define(alias, cols, config)

   Supplier.associate = (models) => {
      Supplier.belongsTo(models.Currencies,{
          as:'supplier_currency',
          foreignKey: 'id_currencies'
      }),
      Supplier.belongsTo(models.Countries,{
         as:'supplier_country',
         foreignKey: 'id_countries'
      }),
      Supplier.hasMany(models.Data_suppliers_volume_factors,{
         as:'supplier_volume_factors',
         foreignKey: 'id_suppliers'
      }),
      Supplier.hasMany(models.Data_suppliers_coeficient_factors,{
         as:'supplier_coeficient_factors',
         foreignKey: 'id_suppliers'
      }),
      Supplier.hasMany(models.Data_suppliers_brunches,{
         as:'supplier_brunches',
         foreignKey: 'id_suppliers'
      })
   }
   
   return Supplier
}