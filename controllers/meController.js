const trackService = require('./../services/trackService');
const userService = require('./../services/userService');
const catchAsync = require('./../utils/catchAsync');
const UserStreamModel = require('./../models/userStreamModel');
exports.getRecentlyPlayed = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    req.query.sort = '-streamedAt';
    const data = await trackService.getRecentlyPlayed(userId, req.query);

    res.status(200).json({
        status: 'success',
        data,
    });
});

exports.getTopTracks = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const data = await trackService.getTopTracks(userId, req.query);
    res.status(200).json({
        status: 'success',
        data,
    });
});

exports.getMyProfile = catchAsync(async (req, res, next) => {
    const userId = req.user._id;
    const data = await userService.getUserProfile(userId);

    res.status(200).json({
        status: 'success',
        data,
    });
});
