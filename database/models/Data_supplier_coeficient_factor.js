module.exports = (sequelize, DataTypes) => {

   const alias = "Data_suppliers_coeficient_factors"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      id_brunches:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_suppliers:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      factor:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      sales_margin:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      created_at:{
         type: DataTypes.DATE,
         allowNull: false,
      },
      id_users:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      enabled:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
   }
   const config = {
      tableName : 'data_suppliers_coeficient_factors',
      timestamps : true,
      createdAt: 'created_at',
      updatedAt:false
   }

   const Data_supplier_coeficient_factor = sequelize.define(alias, cols, config)

   Data_supplier_coeficient_factor.associate = (models) => {
      Data_supplier_coeficient_factor.belongsTo(models.Users,{
          as:'factor_user',
          foreignKey: 'id_users'
      }),
      Data_supplier_coeficient_factor.belongsTo(models.Data_suppliers,{
         as:'factor_supplier',
         foreignKey: 'id_suppliers'
     })
   }
   
   return Data_supplier_coeficient_factor
   
}