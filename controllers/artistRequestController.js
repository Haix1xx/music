const catchAsync = require('../utils/catchAsync');
const ArtistRequestModel = require('./../models/artistRequestModel');
const factory = require('./handlerFactory');
const artistRequestService = require('./../services/artistRequestService');

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
    if (type === 'reject') {
        data = await artistRequestService.rejectRequest(id);
    } else {
        data = await artistRequestService.approveRequest(id);
    }

    res.status(200).json({ status: 'success', data });
});
