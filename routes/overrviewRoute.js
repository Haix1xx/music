const express = require('express');

const authController = require('./../controllers/authController');
const overviewController = require('./../controllers/overviewController');
const router = express.Router();

router.route('/').get(overviewController.getOverview);

router.route('/top-tracks').get(overviewController.getTopTracks);
module.exports = router;
