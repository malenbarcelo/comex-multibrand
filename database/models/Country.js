module.exports = (sequelize, DataTypes) => {

   const alias = "Countries"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      country:{
      type: DataTypes.STRING,
      allowNull: false,
      }
   }
   const config = {
   tableName : 'countries',
   timestamps : false
   }
   const Country = sequelize.define(alias, cols, config)
   
   return Country
}