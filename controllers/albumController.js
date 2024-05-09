const AlbumModel = require('./../models/albumModel');
const factory = require('./handlerFactory');
const albumSerivce = require('./../services/albumService');
const catchAsync = require('./../utils/catchAsync');

exports.getAllAlbums = factory.getAll(AlbumModel, {
    path: 'artist',
    populate: 'profile',
});

exports.getAlbum = factory.getOne(AlbumModel, {
    path: 'artist',
    populate: 'profile',
});

exports.createAlbum = catchAsync(async (req, res, next) => {
    const artistId = req.user.id;
    const data = await albumSerivce.createAlbum(req.body, artistId);
    res.status(201).json({
        status: 'success',
        data: data,
    });
});

exports.getAlbumsByArtist = catchAsync(async (req, res, next) => {
    const artistId = req.params.id;
    const data = await albumSerivce.getAlbumsByArtist(artistId, req.query);

    res.status(200).json({
        status: 'success',
        data: data,
    });
});

exports.updateTracksToAlbum = catchAsync(async (req, res, next) => {
    const albumId = req.params.id;

    const data = await albumSerivce.updateTracksToAlbum(albumId, req.body);

    res.status(200).json({
        status: 'success',
        data: data,
    });
});
