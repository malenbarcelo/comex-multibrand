module.exports = (sequelize, DataTypes) => {

   const alias = "Currencies_exchange"
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
      }
   }
   const config = {
   tableName : 'currencies_exchange',
   timestamps : false
   }

   const Currency_exchange = sequelize.define(alias, cols, config)

   Currency_exchange.associate = (models) => {
      Currency_exchange.belongsTo(models.Currencies,{
          as:'currency_exchange_currency',
          foreignKey: 'id_currencies'
      }),
      Currency_exchange.belongsTo(models.Brunches,{
         as:'currency_exchange_brunch',
         foreignKey: 'id_brunches'
     })
   }
   
   return Currency_exchange
}