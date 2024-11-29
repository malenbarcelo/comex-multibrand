module.exports = (sequelize, DataTypes) => {

   const alias = "Data_suppliers"
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
      tableName : 'data_suppliers',
      timestamps : false
   }

   const Data_supplier = sequelize.define(alias, cols, config)

   Data_supplier.associate = (models) => {
      Data_supplier.belongsTo(models.Data_currencies,{
          as:'supplier_currency',
          foreignKey: 'id_currencies'
      }),
      Data_supplier.belongsTo(models.Data_countries,{
         as:'supplier_country',
         foreignKey: 'id_countries'
      }),
      Data_supplier.hasMany(models.Data_suppliers_volume_factors,{
         as:'supplier_volume_factors',
         foreignKey: 'id_suppliers'
      }),
      Data_supplier.hasMany(models.Data_suppliers_coeficient_factors,{
         as:'supplier_coeficient_factors',
         foreignKey: 'id_suppliers'
      }),
      Data_supplier.hasMany(models.Data_suppliers_brunches,{
         as:'supplier_brunches',
         foreignKey: 'id_suppliers'
      })
   }
   
   return Data_supplier
}