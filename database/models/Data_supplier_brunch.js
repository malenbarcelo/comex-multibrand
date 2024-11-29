module.exports = (sequelize, DataTypes) => {

   const alias = "Data_suppliers_brunches"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      id_suppliers:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_brunches:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }

   const config = {
      tableName : 'data_suppliers_brunches',
      timestamps : false
   }

   const Data_supplier_brunch = sequelize.define(alias, cols, config)

   Data_supplier_brunch.associate = (models) => {
      Data_supplier_brunch.belongsTo(models.Data_suppliers,{
         as:'supplier_data',
         foreignKey: 'id_suppliers'
     }),
     Data_supplier_brunch.belongsTo(models.Brunches,{
      as:'brunch_data',
      foreignKey: 'id_brunches'
     })
   }
   
   return Data_supplier_brunch
}