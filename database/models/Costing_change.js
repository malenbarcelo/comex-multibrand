module.exports = (sequelize, DataTypes) => {

   const alias = "Costings_changes"
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
      type:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      description:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_users:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      created_at:{
         type: DataTypes.DATE,
         allowNull: false,
      },
      updated_costs:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },

   }

   const config = {
      tableName : 'costings_changes',
      timestamps : true,
      createdAt: 'created_at',
      updatedAt:false
   }

   const Costing_change = sequelize.define(alias, cols, config)

   Costing_change.associate = (models) => {
      Costing_change.belongsTo(models.Brunches,{
         as:'brunch_data',
         foreignKey: 'id_brunches'
      }),
      Costing_change.belongsTo(models.Users,{
         as:'user_data',
         foreignKey: 'id_users'
      })
   }
   
   return Costing_change

}