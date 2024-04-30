const AlbumModel = require('./../models/albumModel');
const factory = require('./handlerFactory');
const albumSerivce = require('./../services/albumService');
const catchAsync = require('./../utils/catchAsync');

exports.getAlbum = factory.getOne(AlbumModel, 'artist');

exports.createAlbum = factory.createOne(AlbumModel);

exports.getAlbumsByArtist = catchAsync(async (req, res, next) => {
    const artistId = req.params.id;
    const data = await albumSerivce.getAlbumsByArtist(artistId, req.query);

    res.status(200).json({
        status: 'success',
        data: data,
    });
});
