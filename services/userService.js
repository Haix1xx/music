const UserModel = require('./../models/userModel');
const ProfileModel = require('./../models/profileModel');
const factory = require('./handlerFactoryService');

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
