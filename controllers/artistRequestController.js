const catchAsync = require('../utils/catchAsync');
const ArtistRequestModel = require('./../models/artistRequestModel');
const factory = require('./handlerFactory');
const artistRequestService = require('./../services/artistRequestService');
const userService = require('./../services/userService');

exports.getAllRequests = factory.getAll(ArtistRequestModel, {
    path: 'artist',
    select: '_id id email role isActive profile',
    populate: {
        path: 'profile',
        justOne: true,
    },
});

exports.getRequest = factory.getOne(ArtistRequestModel, {
    path: 'artist',
    select: '_id id email role isActive profile',
    populate: {
        path: 'profile',
        justOne: true,
    },
});

exports.rejectRequest = catchAsync(async (req, res, next) => {
    const data = await artistRequestService.rejectRequest(req.params.id);

    res.status(200).json(data);
});

exports.approveRequest = catchAsync(async (req, res, next) => {
    const data = await artistRequestService.approveRequest(req.params.id);

    res.status(200).json(data);
});

exports.updateRequest = catchAsync(async (req, res, next) => {
    const { type, id } = req.body;

    let data;
    let artist;
    if (type === 'reject') {
        data = await artistRequestService.rejectRequest(id);
        artist = await userService.lockOrUnlockUser(data.data.artist, false);
    } else {
        data = await artistRequestService.approveRequest(id);
        artist = await userService.lockOrUnlockUser(data.data.artist, true);
    }

    res.status(200).json({ status: 'success', data, artist });
});

exports.filterRequests = catchAsync(async (req, res, next) => {
    const { q, status } = req.body;
    const limit = req.body?.limit ?? 10;
    const page = req.body?.page ?? 1;
    const data = await artistRequestService.filterRequests(
        q,
        status,
        limit,
        page
    );

    res.status(200).json({ status: 'success', data });
});
