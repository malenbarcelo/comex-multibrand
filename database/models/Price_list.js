module.exports = (sequelize, DataTypes) => {

   const alias = "Prices_lists"
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
      id_currencies:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      item:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_measurement_units:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      mu_per_box:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      weight_kg:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      volume_m3:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      fob:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      brand:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      cost_calculation:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      has_breaks:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      price_list_number:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      origin:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      update_date:{
         type: DataTypes.DATE,
         allowNull: false,
      },
      
   }
   const config = {
   tableName : 'prices_lists',
   timestamps : false
   }

   const Price_list = sequelize.define(alias, cols, config)

   Price_list.associate = (models) => {
      Price_list.belongsTo(models.Suppliers,{
          as:'price_list_supplier',
          foreignKey: 'id_suppliers'
      }),
      Price_list.belongsTo(models.Measurement_units,{
         as:'price_list_mu',
         foreignKey: 'id_measurement_units'
     }),
     Price_list.belongsTo(models.Currencies,{
      as:'price_list_currency',
      foreignKey: 'id_currencies'
  })
   }
   
   return Price_list
}