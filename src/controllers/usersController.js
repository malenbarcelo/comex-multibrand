const db = require('../../database/models')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const brunchesQueries = require('./dbQueries/brunchesQueries')
const usersQueries = require('./dbQueries/usersQueries')

//get DB Data
async function getData(idBrunch){
    const brunches = await brunchesQueries.allData()
    const brunch = await brunchesQueries.brunch(idBrunch)
    const users = await usersQueries.allUsers(idBrunch)
    const usersCategories = await usersQueries.allUsersCategories()
    const data = {brunches,idBrunch,brunch,users,usersCategories}
    return data
  }

const usersController = {
    users: async(req,res) => {
        try{

            const idBrunch = req.params.idBrunch

            const data = await getData(idBrunch)

            return res.render('users/users',{title:'Usuarios',data})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    editUser: async(req,res) => {
        try{

            const idBrunch = req.params.idBrunch
            const idUser = req.params.idUser
            const data = await getData(idBrunch)
            const userToEdit = await usersQueries.findUserById(idUser)

            return res.render('users/editUser',{title:'Editar Usuario',data,userToEdit})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    editUserProcess: async(req,res) => {
        try{

            const idBrunch = req.params.idBrunch
            const idUser = req.params.idUser
            var data = await getData(idBrunch)
            const userToEdit = await usersQueries.findUserById(idUser)

            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                return res.render('users/editUser',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Editar Usuario',
                    data,
                    userToEdit
                })
            }

            //edit User
            const userData = req.body

            await usersQueries.editUser(userData)

            data = await getData(idBrunch)

            const successMessage = 'editUser'

            return res.render('users/users',{title:'Usuarios',data,successMessage})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    createUser: async(req,res) => {
        try{

            const idBrunch = req.params.idBrunch
            const data = await getData(idBrunch)

            return res.render('users/createUser',{title:'Crear Usuario',data})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    createUserProcess: async(req,res) => {
        try{

            const idBrunch = req.params.idBrunch
            let data = await getData(idBrunch)

            const resultValidation = validationResult(req)

            if (resultValidation.errors.length > 0){
                return res.render('users/createUser',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Crear Usuario',
                    data
                })
            }

            //create User
            const userData = req.body

            await usersQueries.createUser(userData)

            data = await getData(idBrunch)

            const successMessage = 'createUser'

            return res.render('users/users',{title:'Usuarios',data,successMessage})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    
    /*
    processDeleteAdministrator: async(req,res) => {
        try{
            const resultValidation = validationResult(req)
            const administrators = await usersQueries.allAdministrators()

            if (resultValidation.errors.length > 0){
                return res.render('users/deleteAdm',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Eliminar administrador',
                    administrators
                })
            }

            //delete user
            await db.Users.destroy({where: {id:req.body.selectAdm}})
            
            const successMessage = true
            
            return res.render('users/deleteAdm',{title:'Eliminar administrador',administrators,successMessage})
            
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    
    processRestorePassword: async(req,res) =>{
        try{

            const administrators = await usersQueries.allAdministrators()
            const resultValidation = validationResult(req)
            
            if (resultValidation.errors.length > 0){
                return res.render('users/restorePassword',{
                    errors:resultValidation.mapped(),
                    oldData: req.body,
                    title:'Restablecer contraseña',
                    administrators
                })
            }

            const newPassword = bcrypt.hashSync(req.body.selectAdm,10)

            await db.Users.update(
                { password: newPassword },
                { where: { user_email: req.body.selectAdm } }
              )

            const successMessage = true

            return res.render('users/restorePassword',{title:'Restablecer contraseña',successMessage,administrators})

        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    restorePassword: async(req,res) => {
        try{
            const administrators = await usersQueries.allAdministrators()
            return res.render('users/restorePassword',{title:'Restablecer contraseña',administrators})
        }catch(error){
            console.log(error)
            res.send('Ha ocurrido un error')
        }       
    },*/

}
module.exports = usersController

