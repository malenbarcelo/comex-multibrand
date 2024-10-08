module.exports = (sequelize, DataTypes) => {

   const alias = "Measurement_units"
   const cols = {
      id:{
      type : DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement : true,
      allowNull: false
      },
      measurement_unit:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      units_per_um:{
      type: DataTypes.INTEGER,
      allowNull: false,
      }
   }
   const config = {
      tableName : 'measurement_units',
      timestamps : false
   }
   const Measurement_unit = sequelize.define(alias, cols, config)
   
   return Measurement_unit
}