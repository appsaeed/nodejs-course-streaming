const express = require('express');
const HomeController = require('../controllers/HomeController');
const PlaylistController = require('../controllers/PlaylistController');
const TutorController = require('../controllers/TutorController');
const BookmarkController = require('../controllers/BookmarkController');
const auth = require('../middleware/auth');
const router = express.Router();



//home page route
router.get('/', auth, HomeController.index)
router.get('/home',auth,  HomeController.index)
router.get('/about',auth,  HomeController.about)
router.get('/courses',auth,  HomeController.courses)
router.get('/teachers', auth, HomeController.teachers)
router.get('/contact', auth,  HomeController.contact)


router.get('/bookmark', auth ,  BookmarkController.index)

router.get('/likes', auth,  HomeController.like)
router.get('/comments', auth,  HomeController.comment)
router.get('/watch-video/:playlist_id', auth,  PlaylistController.watchVideo)

router.get('/playlist/:playlist_id', auth,  PlaylistController.index)

router.post('/playlist/save', auth,  PlaylistController.savePlaylist)


router.get('/tutor-profile/:tutor_id', auth,  TutorController.profile)
router.get('/search_tutor', auth,  TutorController.search)



module.exports = router;