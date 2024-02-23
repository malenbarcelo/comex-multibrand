module.exports = (sequelize, DataTypes) => {

   const alias = "Purchase_orders"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      purchase_order:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      po_number:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      po_date:{
         type: DataTypes.DATE,
         allowNull: false,
      },
      po_year:{
         type: DataTypes.INTEGER,
         allowNull: false,
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
      total_fob_supplier_currency:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      total_weight_kg:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      total_volume_m3:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      total_boxes:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      costing:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      status:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      reception_date:{
         type: DataTypes.DATE,
         allowNull: true,
      },
      exchange_rate:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      total_fob_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull: true,
      },
      freight_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      insurance_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      cif_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      forwarder_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      domestic_freight_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      dispatch_expenses_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      office_fees_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      container_costs_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      port_expenses_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      duties_tarifs_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      container_insurance_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      port_contribution_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      other_expenses_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      total_expenses_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      total_costs_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      total_volume_expense_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      total_price_expense_local_currency:{
         type: DataTypes.DECIMAL,
         allowNull:true
      },
      cost_calculation:{
         type: DataTypes.STRING,
         allowNull:false
      }
   }
   
   const config = {
   tableName : 'purchase_orders',
   timestamps : false
   }

   const Purchase_order = sequelize.define(alias, cols, config)

   Purchase_order.associate = (models) => {
      Purchase_order.belongsTo(models.Suppliers,{
          as:'purchase_order_supplier',
          foreignKey: 'id_suppliers'
      }),
      Purchase_order.belongsTo(models.Currencies,{
         as:'purchase_order_currency',
         foreignKey: 'id_currencies'
     }),
     Purchase_order.belongsTo(models.Brunches,{
         as:'purchase_order_brunch',
         foreignKey: 'id_brunches'
     })
   }
   
   return Purchase_order
}