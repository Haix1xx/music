const catchAsync = require('../utils/catchAsync');
const ArtistProfileModel = require('./../models/artistProfileModel');
const factory = require('./handlerFactory');
const artistSerivce = require('./../services/artistService');

exports.getAllArtists = factory.getAll(ArtistProfileModel, {
    path: 'user',
    select: '_id id email role',
});

// exports.getArtist = factory.getOne(ArtistProfileModel);
exports.getArtist = catchAsync(async (req, res, next) => {
    const data = await artistSerivce.getArtist(req.params.id);

    res.status(200).json({
        status: 'success',
        data,
    });
});

exports.updateArtist = factory.updateOne(ArtistProfileModel);
