const db = require('../../../database/models')
const sequelize = require('sequelize')
const bcrypt = require('bcryptjs')

const user_user_categorysQueries = {
    findUser: async(userName) => {
        const user = await db.Users.findOne({
            where:{user_name:userName},
            raw:true
        })
        return user
    },
    findUserById: async(idUser) => {
        const user = await db.Users.findOne({
            where:{id:idUser},
            raw:true
        })
        return user
    },
    allUsers: async() => {
        const users = await db.Users.findAll({
            include: [{association: 'user_user_category'}],
            order:[['first_name','ASC']],
            raw:true,
            nest:true
        })
        return users
    },
    allUsersCategories: async(userName) => {
        const usersCategories = await db.User_categories.findAll({
            raw:true
        })
        return usersCategories
    },
    editUser: async(userData) => {
        await db.Users.update(
            {
                first_name:userData.firstName,
                last_name:userData.lastName,
                email:userData.email,
                id_users_categories: userData.userCategory
            },
            {where:{user_name:userData.userName}}
    )},
    changePassword: async(userName,newPassword) => {
        await db.Users.update(
            {
                password: newPassword
            },
            {where:{user_name:userName}}
    )},
    createUser: async(userData) => {

        const password = bcrypt.hashSync(userData.userName,10)

        await db.Users.create(
            {
                user_name:userData.userName,
                first_name:userData.firstName,
                last_name:userData.lastName,
                email:userData.email,
                id_users_categories: userData.userCategory,
                password: password
            }
    )},
}       

module.exports = user_user_categorysQueries