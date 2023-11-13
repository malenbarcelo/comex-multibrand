const {body} = require('express-validator')
const bcrypt = require('bcryptjs')
const db = require('../../database/models');
const path = require('path')
const usersQueries = require('../controllers/dbQueries/usersQueries')

const userFormsValidations = {
    login: [
        body('userName')
            .notEmpty().withMessage('Ingrese un usuario').bail()
            .custom(async(value,{ req }) => {
                const userName = req.body.userName
                const userToLogin = await usersQueries.findUser(userName)
                if (!userToLogin) {
                throw new Error('Usuario inválido')
                }
                return true
            }),
        body('password')
            .notEmpty().withMessage('Ingrese una contraseña')
            .custom(async(value,{ req }) => {
                const userName = req.body.userName
                const userToLogin = await usersQueries.findUser(userName)
                if(userToLogin){
                    if (!bcrypt.compareSync(req.body.password, userToLogin.password)) {
                        throw new Error('Contraseña inválida')
                    }
                }else{
                    throw new Error('Contraseña inválida')
                }
                return true
        })
    ],
    editUser: [
        body('firstName').notEmpty().withMessage('El nombre es requerido'),
        body('lastName').notEmpty().withMessage('El apellido es requerido'),
        body('email')
            .notEmpty().withMessage('El email es requerido').bail()
            .isEmail().withMessage('Formato de email incorrecto')
    ],
    createUser: [
        body('userName')
            .notEmpty().withMessage('El usuario es requerido').bail()
            .custom(async(value,{ req }) => {
                const userName = req.body.userName
                const userToCreate = await usersQueries.findUser(userName)
                if(userToCreate){
                    throw new Error('Ya existe el usuario ' + userName)
                }
                return true
        }),
        body('firstName').notEmpty().withMessage('El nombre es requerido'),
        body('lastName').notEmpty().withMessage('El apellido es requerido'),
        body('email')
            .notEmpty().withMessage('El email es requerido').bail()
            .isEmail().withMessage('Formato de email incorrecto'),
        body('userCategory')
            .custom(async(value,{ req }) => {
                if(req.body.userCategory == 'default'){
                    throw new Error('Seleccione un perfil de usuario')
                }
                return true
    })
    ],
    changePsw: [
        body('password')
            .notEmpty().withMessage('Ingrese una contraseña')
            .custom(async(value,{ req }) => {
                if (req.body.password != req.body.confirmPassword) {
                throw new Error('Las contraseñas no coinciden')
                }
                return true
            })
            .custom(async(value,{ req }) => {
                if (req.body.password == req.body.userName) {
                throw new Error('Su contraseña debe ser diferente a la anterior')
                }
                return true
            }),
        body('confirmPassword')
            .notEmpty().withMessage('Reingrese la contraseña')
            .custom(async(value,{ req }) => {
                if (req.body.password != req.body.confirmPassword) {
                throw new Error('Las contraseñas no coinciden')
                }
                return true
            }),
    ],/*
    createAdm: [
        body('selectCompany')
            .custom(async(value,{ req }) => {
                if(req.body.selectCompany == 'default'){
                    throw new Error('Seleccione una compañía')
                }
                return true
            }),
        body('firstName').notEmpty().withMessage('Ingrese el nombre del administrador'),
        body('lastName').notEmpty().withMessage('Ingrese el apellido del administrador'),
        body('email')
            .notEmpty().withMessage('Ingrese un mail')
            .isEmail().withMessage('Ingrese un mail válido')
            .custom(async(value,{ req }) => {
                const user = await usersQueries.findUser(req.body.email)
                if (user) {
                throw new Error('El mail ingresado ya existe en la base de usuarios')
                }
                return true
            }),
    ],
    deleteAdministratorFormValidations: [
        body('selectAdm')
            .custom(async(value,{ req }) => {
                if(req.body.selectAdm == 'default'){
                    throw new Error('Seleccione un administrador')
                }
                return true
            })
    ],
    restorePswFormValidations: [
        body('selectAdm')
            .custom(async(value,{ req }) => {
                if(req.body.selectAdm == 'default'){
                    throw new Error('Seleccione un administrador')
                }
                return true
            })
    ],*/
}

module.exports = userFormsValidations