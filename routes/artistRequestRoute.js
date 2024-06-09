const express = require('express');

const artistRequestController = require('./../controllers/artistRequestController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        artistRequestController.getAllRequests
    )
    .put(
        authController.protect,
        authController.restrictTo('admin'),
        artistRequestController.updateRequest
    );

router.route('/:id').get(artistRequestController.getRequest);

module.exports = router;
