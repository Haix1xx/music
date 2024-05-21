const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const meController = require('./../controllers/meController');
const router = express.Router();

router.route('/').get(authController.protect, meController.getMyProfile);
router
    .route('/recently-played')
    .get(authController.protect, meController.getRecentlyPlayed);

router
    .route('/top/tracks')
    .get(authController.protect, meController.getTopTracks);

router
    .route('/top/artists')
    .get(authController.protect, meController.getUserTopArtists);

module.exports = router;
