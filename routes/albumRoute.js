const express = require('express');

const trackController = require('./../controllers/trackController');
const albumController = require('./../controllers/albumController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(albumController.getAlbum)
    .post(
        authController.protect,
        authController.restrictTo('admin,artist'),
        albumController.createAlbum
    );

router.route('/:id/tracks').get(trackController.getTracksByAlbum);

module.exports = router;
