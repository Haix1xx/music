const express = require('express');

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

router.post('/signup', authController.signup1);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/refresh', authController.refreshToken);
// router.get('/:id/verify/:token', authController.verifyEmail);
// router.post("/forgotPassword", authController.resetPassword);
// router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.post('/artists/signup', authController.artistSignup);

router.route('/').get(userController.getAllUsers);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
