module.exports = (sequelize, DataTypes) => {

   const alias = "Users"
   const cols = {
      id:{
         type : DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement : true,
         allowNull: false
      },
      first_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      last_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      user_name:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      email:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      password:{
         type: DataTypes.STRING,
         allowNull: false,
      },
      id_users_categories:{
      type: DataTypes.INTEGER,
      allowNull: false,
      },
   }
   const config = {
   tableName : 'users',
   timestamps : false
   }
   const User = sequelize.define(alias, cols, config)

   User.associate = (models) => {
      User.belongsTo(models.User_categories,{
         as:'user_user_category',
         foreignKey: 'id_users_categories'
      })
   }
   return User
}