const UserModel = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const userService = require('./../services/userService');

exports.getUser = factory.getOne(UserModel);

exports.getAllUsers = factory.getAll(UserModel, 'profile');

exports.updateUser = factory.updateOne(UserModel);

exports.deleteUser = factory.deleteOne(UserModel);

exports.lockUser = catchAsync(async (req, res, next) => {
    const { userId, isActive = false } = req.body;
    const user = await userService.lockOrUnlockUser(userId, isActive);

    res.status(200).json({
        status: 'success',
        data: user,
    });
});
