const express = require('express');
const HomeController = require('../controllers/HomeController');
const router = express.Router();


//home page route
router.get('/', HomeController.index)
router.get('/home', HomeController.index)
router.get('/about', HomeController.about)
router.get('/courses', HomeController.courses)
router.get('/teachers', HomeController.teachers)
router.get('/contact', HomeController.contact)


module.exports = router;