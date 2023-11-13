const express = require('express')
const usersController = require('../controllers/usersController.js')
const router = express.Router()
const userFormsValidations = require('../validations/userFormsValidations.js')

router.get('/:idBrunch/users',usersController.users)
router.get('/:idBrunch/edit-user/:idUser',usersController.editUser)
router.post('/:idBrunch/edit-user/:idUser',userFormsValidations.editUser,usersController.editUserProcess)
router.get('/:idBrunch/create-user',usersController.createUser)
router.post('/:idBrunch/create-user',userFormsValidations.createUser,usersController.createUserProcess)

module.exports = router

