const express = require('express');

const authController = require('../controllers/authController');
const userStreamController = require('../controllers/userStreamController');

const router = express.Router();

router
    .route('/')
    .post(
        authController.protect,
        authController.restrictTo('user'),
        authController.setUserId,
        userStreamController.createUserStream
    );

module.exports = router;
