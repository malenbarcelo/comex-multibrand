module.exports = (sequelize, DataTypes) => {

   const alias = "Costings"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      costing_number:{
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
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      id_currencies:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      fob:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      unit_cost:{
         type: DataTypes.DECIMAL,
         allowNull: false,
      },
      notes:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      created_at:{
         type: DataTypes.DATE,
         allowNull: false,
      }
   }

   const config = {
      tableName : 'costings',
      timestamps : true,
      createdAt: 'created_at',
      updatedAt:false
   }

   const Costing = sequelize.define(alias, cols, config)

   Costing.associate = (models) => {
      Costing.belongsTo(models.Brunches,{
         as:'brunch_data',
         foreignKey: 'id_brunches'
      }),
      Costing.belongsTo(models.Data_suppliers,{
         as:'supplier_data',
         foreignKey: 'id_suppliers'
      }),
      Costing.belongsTo(models.Measurement_units,{
            as:'mu_data',
            foreignKey: 'id_measurement_units'
      }),
      Costing.belongsTo(models.Data_currencies,{
          as:'currency_data',
          foreignKey: 'id_currencies'
      })
   }
   
   return Costing

}