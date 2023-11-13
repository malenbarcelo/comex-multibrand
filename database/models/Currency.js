module.exports = (sequelize, DataTypes) => {

   const alias = "Currencies"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      currency:{
      type: DataTypes.STRING,
      allowNull: false,
      }
   }
   const config = {
   tableName : 'currencies',
   timestamps : false
   }
   const Currency = sequelize.define(alias, cols, config)
   
   return Currency
}