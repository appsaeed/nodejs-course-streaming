const express = require('express');
const AccountController = require('../controllers/AccountController');
const router = express.Router();


//home page route
router.get('/profile', AccountController.profile)


module.exports = router;