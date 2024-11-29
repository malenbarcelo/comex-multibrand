module.exports = (sequelize, DataTypes) => {

   const alias = "Data_countries"
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
   tableName : 'data_countries',
   timestamps : false
   }
   const Data_country = sequelize.define(alias, cols, config)
   
   return Data_country
}