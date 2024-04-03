const express = require('express')
const usersController = require('../controllers/usersController.js')
const router = express.Router()

router.get('/:idBrunch/users',usersController.users)
router.post('/:idBrunch/create-edit-user',usersController.createEditUserProcess)
router.post('/:idBrunch/delete-user/:idUser',usersController.deleteUserProcess)
router.post('/:idBrunch/restore-password/:idUser',usersController.restorePasswordProcess)

module.exports = router

