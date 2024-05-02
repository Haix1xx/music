const express = require('express');

const trackController = require('./../controllers/trackController');
const albumController = require('./../controllers/albumController');
const singleController = require('./../controllers/singleController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/:id/tracks').get(trackController.getTracksByArtist);
router.route('/:id/albums').get(albumController.getAlbumsByArtist);
router.route('/:id/singles').get(singleController.getSinglesByArtist);
module.exports = router;
