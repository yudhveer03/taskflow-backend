const express = require('express')
const bcrypt = require('bcryptjs')
const router= express.Router()
const authController = require('../../controllers/auth.controller')
const validator = require('../../middleware/express-validator')
const jwtMiddleware = require('../../middleware/jwt.middleware')

router.
    post('/register',jwtMiddleware,
    validator.registerValidationRules,
    authController.register)

router.
    post('/login',
        authController.login)

router.
    post('/logout',
        authController.logout)




module.exports = router