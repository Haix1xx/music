const express = require('express');

const trackController = require('./../controllers/trackController');
const albumController = require('./../controllers/albumController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(albumController.getAllAlbums)
    .post(
        authController.protect,
        authController.restrictTo('artist'),
        albumController.createAlbum
    );

router.route('/:id').get(albumController.getAlbum);

router
    .route('/:id/tracks')
    .get(trackController.getTracksByAlbum)
    .patch(albumController.updateTracksToAlbum);

module.exports = router;
