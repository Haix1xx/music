const catchAsync = require('../utils/catchAsync');
const featuredPlaylistModel = require('./../models/featuredPlaylist');
const FeaturedPlaylistModel = require('./../models/featuredPlaylist');
const factory = require('./handlerFactory');
const featuredPlaylistService = require('./../services/featuredPlaylistService');

exports.getAllPlaylists = factory.getAll(FeaturedPlaylistModel);

exports.getPlaylist = factory.getOne(FeaturedPlaylistModel, {
    path: 'tracks',
    populate: {
        path: 'track',
        populate: {
            path: 'artist',
            populate: 'profile',
        },
    },
});

exports.createPlaylist = factory.createOne(featuredPlaylistModel);

exports.updateTracksToPlaylist = catchAsync(async (req, res, next) => {
    const data = await featuredPlaylistService.updateTracksToPlaylist(
        req.params.id,
        req.body
    );

    res.status(200).json({
        status: 'success',
        data,
    });
});
