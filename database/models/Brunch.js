module.exports = (sequelize, DataTypes) => {

   const alias = "Brunches"
   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      brunch:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      pos_suffix:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_currencies:{
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      business_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      address:{
         type: DataTypes.STRING,
         allowNull: false,
      },
   }
   const config = {
   tableName : 'brunches',
   timestamps : false
   }
   const Brunch = sequelize.define(alias, cols, config)

   Brunch.associate = (models) => {
      Brunch.belongsTo(models.Currencies,{
          as:'brunch_currency',
          foreignKey: 'id_currencies'
      })
   }
   
   return Brunch
}