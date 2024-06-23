const UserModel = require('./../models/userModel');
const ProfileModel = require('./../models/profileModel');
const factory = require('./handlerFactoryService');
const AppError = require('../utils/appError');

exports.getUserProfile = async (userId) => {
    const user = await factory.getOne(UserModel, userId, {
        path: 'profile',
        justOne: true,
    });

    if (user) {
        user.verifyToken = undefined;
        user.refreshToken = undefined;
    }

    return user;
};

exports.getTotalUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const total = await UserModel.find({ role: 'user' }).count();
            resolve(total);
        } catch (err) {
            reject(err);
        }
    });
};

exports.lockOrUnlockUser = (userId, isActive) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                return reject(new AppError('Missing user id', 400));
            }

            const user = await UserModel.findByIdAndUpdate(
                userId,
                {
                    isActive,
                },
                { runValidators: true, new: true }
            );
            return resolve(user);
        } catch (err) {
            reject(err);
        }
    });
};
