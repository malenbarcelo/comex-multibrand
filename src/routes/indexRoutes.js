const express = require('express')
const indexController = require('../controllers/indexController.js')
const userFormsValidations = require('../validations/userFormsValidations.js')
const router = express.Router()

router.get('/',indexController.login)
router.get('/login',indexController.login)
router.post('/login',userFormsValidations.login,indexController.loginProcess)
router.post('/change-password',userFormsValidations.changePsw,indexController.changePasswordProcess)
router.get('/logout',indexController.logout)
router.get('/select-brunch',indexController.selectBrunch)


module.exports = router

