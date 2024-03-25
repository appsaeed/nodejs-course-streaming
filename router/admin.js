const express = require('express');
const AdminController = require('../controllers/admin/AdminController');
const upload = require('../app/upload');
const admin = require('../middleware/admin');
const PlaylistController = require('../controllers/admin/PlaylistController');
const VideoController = require('../controllers/admin/VideoController');
const CommentController = require('../controllers/admin/CommentController');
const Auth = require('../model/Auth');
const router = express.Router();

//home page route
router.get('/register', AdminController.register)
router.get('/login', AdminController.login)
router.post('/login', AdminController.loginPost)
router.post('/register', upload.single('image'), AdminController.registerPost)

router.get('/profile', admin, AdminController.profile )
router.get('/profile/edit', admin, AdminController.editProfile)
router.post('/profile/update', admin, upload.single('image'), AdminController.updateProfile)
// router.post('/profile/update', upload.single('image'), admin, AdminController.updateProfile)
router.get('/dashboard', admin, AdminController.dashboard )

router.get('/playlists', admin, PlaylistController.index )

router.get('/playlists/view/:playlist_id', admin, PlaylistController.view )
router.get('/playlists/edit/:playlist_id', admin, PlaylistController.edit )
router.get('/playlists/delete/:playlist_id', admin, PlaylistController.delete )
router.post('/playlists/update', admin, upload.single('image') , PlaylistController.update )
router.get('/playlists/add', admin, PlaylistController.add )
router.post('/playlists/save', admin, upload.single('image'), PlaylistController.save )

router.get('/videos', admin, VideoController.index )
router.get('/videos/view/:video_id', admin, VideoController.view )
router.get('/videos/edit/:video_id', admin, VideoController.edit )
router.get('/videos/delete/:video_id', admin, VideoController.delete )
router.get('/videos/add', admin, VideoController.add )
const  video = upload.fields([{ name: 'thumb', maxCount: 1 }, { name: 'video', maxCount: 1 }]);
router.post('/videos/save', admin, video , VideoController.save )
router.post('/videos/update', admin, video , VideoController.update )


router.get('/comments', admin, CommentController.index )

router.get('/logout', Auth.logoutTutor)

module.exports = router;