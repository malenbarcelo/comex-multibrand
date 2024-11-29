module.exports = (sequelize, DataTypes) => {

   const alias = "Data_currencies_exchange"
   
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
      id_currencies:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      currency_exchange:{
         type: DataTypes.DECIMAL,
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
   }
   const config = {
      tableName : 'data_currencies_exchange',
      timestamps : true,
      createdAt: 'created_at',
      updatedAt: false
   }

   const Data_currency_exchange = sequelize.define(alias, cols, config)

   Data_currency_exchange.associate = (models) => {
      Data_currency_exchange.belongsTo(models.Data_currencies,{
          as:'currency_exchange_currency',
          foreignKey: 'id_currencies'
      }),
      Data_currency_exchange.belongsTo(models.Brunches,{
         as:'currency_exchange_brunch',
         foreignKey: 'id_brunches'
     })
   }
   
   return Data_currency_exchange
}