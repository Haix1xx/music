const express = require('express');

const genreController = require('./../controllers/genreController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(genreController.getAllGenres)
    .post(
        authController.protect,
        authController.restrictTo('admin'),
        genreController.createGenre
    );

router
    .route('/:id')
    .get(genreController.getGenre)
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        genreController.updateGenre
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        genreController.deleteGenre
    );

module.exports = router;
