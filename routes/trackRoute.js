const express = require('express');
const multer = require('multer');
const authController = require('./../controllers/authController');
const trackController = require('./../controllers/trackController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 20000000 },
}).fields([{ name: 'track', maxCount: 1 }]);

router
    .route('/')
    .get(trackController.getAllTracks)
    .post(
        authController.protect,
        upload,
        authController.setUserId,
        trackController.createTrack
    );

router.route('/:id').get(trackController.getTrack);

module.exports = router;
