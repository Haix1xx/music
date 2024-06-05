const express = require('express');

const trackController = require('./../controllers/trackController');
const albumController = require('./../controllers/albumController');
const singleController = require('./../controllers/singleController');
const artistController = require('./../controllers/artistController');
const authController = require('./../controllers/authController');
const overviewController = require('./../controllers/overviewController');

const router = express.Router();

router.route('/').get(artistController.getAllArtists);

router.route('/:id').get(artistController.getArtist);
router.route('/:id/tracks').get(trackController.getTracksByArtist);
router.route('/:id/top-tracks').get(trackController.getArtistTopTrack);
router.route('/:id/albums').get(albumController.getAlbumsByArtist);
router.route('/:id/singles').get(singleController.getSinglesByArtist);
module.exports = router;
