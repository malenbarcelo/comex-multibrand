module.exports = (sequelize, DataTypes) => {

   const alias = "Data_suppliers_volume_factors"
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
      std_volume:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      volume_mu:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_container:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_freight:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      freight:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_terminal_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      terminal_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_dispatch_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      dispatch_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_maritime_agency_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      maritime_agency_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      std_domestic_freight:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      domestic_freight:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      total_volume_expenses:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      volume_expenses_mu:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      custom_agent:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      insurance:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      transference:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      import_duty:{
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
      tableName : 'data_suppliers_volume_factors',
      timestamps : true,
      createdAt: 'created_at',
      updatedAt:false
   }

   const Data_supplier_volume_factor = sequelize.define(alias, cols, config)

   Data_supplier_volume_factor.associate = (models) => {
      Data_supplier_volume_factor.belongsTo(models.Users,{
          as:'factor_user',
          foreignKey: 'id_users'
      }),
      Data_supplier_volume_factor.belongsTo(models.Suppliers,{
         as:'factor_supplier',
         foreignKey: 'id_suppliers'
     })
   }
   
   return Data_supplier_volume_factor
}