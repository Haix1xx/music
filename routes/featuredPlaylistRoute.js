const express = require('express');

const authController = require('../controllers/authController');
const featuredPlaylistController = require('../controllers/featuredPlaylistController');
const trackController = require('./../controllers/trackController');
const router = express.Router();

router
    .route('/')
    .get(featuredPlaylistController.getAllPlaylists)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        featuredPlaylistController.createPlaylist
    );

router.route('/:id').get(featuredPlaylistController.getPlaylist);

router
    .route('/:id/tracks')
    .get(trackController.getTracksByPlaylist)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        featuredPlaylistController.updateTracksToPlaylist
    );
module.exports = router;
