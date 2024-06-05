const express = require('express');

const authController = require('./../controllers/authController');
const overviewController = require('./../controllers/overviewController');

const router = express.Router();

router.route('/').get(overviewController.getOverview);

router
    .route('/artists')
    .get(authController.protect, overviewController.getArtistOverview);

router.route('/top-tracks').get(overviewController.getTopTracks);

router
    .route('/artists/top-tracks')
    .get(authController.protect, overviewController.getTopTracksByArtist);

module.exports = router;
