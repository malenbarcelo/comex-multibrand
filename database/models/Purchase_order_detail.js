module.exports = (sequelize, DataTypes) => {

   const alias = "Purchase_orders_details"
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
      id_pos:{
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
      mu_quantity:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      units_quantity:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      mu_per_box:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      boxes:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      weight_kg:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      total_weight_kg:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      volume_m3:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      total_volume_m3:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      fob_supplier_currency:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      total_fob_supplier_currency:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },

      brand:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      pays_duties_tarifs:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      total_fob_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      freight_and_insurance_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      cif_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      duties_tarifs_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      total_volume_expense_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      total_price_expense_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      total_expense_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      total_cost_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      unit_cost_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      unit_cost_supplier_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      estimated_cost_supplier_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      }
   }
   const config = {
   tableName : 'purchase_orders_details',
   timestamps : false
   }

   const Purchase_order_detail = sequelize.define(alias, cols, config)

   Purchase_order_detail.associate = (models) => {
      Purchase_order_detail.belongsTo(models.Purchase_orders,{
          as:'purchase_order_detail_po',
          foreignKey: 'id_pos'
      }),
      Purchase_order_detail.belongsTo(models.Measurement_units,{
         as:'purchase_order_detail_mu',
         foreignKey: 'id_measurement_units'
     })
   }
   
   return Purchase_order_detail
}