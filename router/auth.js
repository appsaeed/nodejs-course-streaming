const express = require('express');
const AccountController = require('../controllers/AccountController');
const AuthController = require('../controllers/AuthController');
const unauth = require('../middleware/unauth');
const auth = require('../middleware/auth');
const upload = require('../app/upload');
const Auth = require('../model/Auth');
const router = express.Router();


//home page route
//auth routes
router.get('/login', unauth , AuthController.login)
router.post('/login', unauth , AuthController.loginPost)
router.get('/register', unauth , AuthController.register)
router.post('/register', unauth , upload.single('image') , AuthController.registerPost)

router.get('/profile', auth , AccountController.profile)
router.get('/profile/edit', auth , AccountController.edit)
router.post('/profile/update', upload.single('image') , auth , AccountController.update)

router.get('/logout', Auth.logout)

module.exports = router;