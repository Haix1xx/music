const UserModel = require('./../models/userModel');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getUser = factory.getOne(UserModel);

exports.getAllUsers = factory.getAll(UserModel, 'profile');

exports.updateUser = factory.updateOne(UserModel);

exports.deleteUser = factory.deleteOne(UserModel);
