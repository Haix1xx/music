const TrackModel = require('./../models/trackModel');
const factory = require('./handlerFactory');
const trackService = require('./../services/trackService');
const catchAsync = require('./../utils/catchAsync');
const { s3UploadFile } = require('./../utils/s3Services');
const AppError = require('../utils/appError');

exports.getAllTracks = factory.getAll(TrackModel, {
    path: 'artist',
    select: 'profile email _id id',
    populate: 'profile',
});

exports.getTrack = factory.getOne(TrackModel, {
    path: 'artist',
    select: 'profile email _id id',
    populate: 'profile',
});

exports.getTracksByAlbum = catchAsync(async (req, res, next) => {
    const albumId = req.params.id;

    const data = await trackService.getTracksByAlbum(albumId);
    res.status(200).json({
        status: 'success',
        data: data,
    });
});

exports.getTracksByPlaylist = catchAsync(async (req, res, next) => {
    const playlistId = req.params.id;

    const data = await trackService.getTracksByFPlaylist(playlistId);
    res.status(200).json({
        status: 'success',
        data: data,
    });
});
exports.getTracksByArtist = catchAsync(async (req, res, next) => {
    const artistId = req.params.id;
    const data = await trackService.getTracksByArtist(artistId, req.query);
    res.status(200).json({
        status: 'success',
        data: data,
    });
});

exports.createTrack = catchAsync(async (req, res, next) => {
    const { track } = req.files;
    console.log(track[0]);
    // const duration = await getAudioDuration(track);
    // console.log(duration);
    if (!track[0]) {
        res.status(400).json({
            status: 'fail',
            message: 'Track file not found',
        });
    }
    // const imageResult = await uploadImageToCloudinary(cover[0]);

    // if (!imageResult) {
    //     res.status(400).json({
    //         status: 'fail',
    //         message: 'an error occured while uploading image file',
    //     });
    // }
    const audioResult = await s3UploadFile(track[0]);
    if (!audioResult) {
        res.status(400).json({
            status: 'fail',
            message: 'an error occured while uploading audio file',
        });
    }
    req.body.url = audioResult.Location;
    const data = await trackService.createTrack(req.body);
    res.status(201).json({
        status: 'success',
        data: data,
    });
});

exports.createTrackAndAddToAlbum = catchAsync(async (req, res, next) => {
    const { albumId } = req.params.id;

    const data = await trackService.addTrackToAbum(req.body, albumId);

    res.status(200).json({
        status: 'success',
        data: data,
    });
});

exports.updateTrack = catchAsync(async (req, res, next) => {
    const trackId = req.params.id;
    const data = await trackService.updateTrack(trackId, req.body);
    res.status(200).json({
        status: 'success',
        data: data,
    });
});

exports.getTopTracks = catchAsync(async (req, res, next) => {
    res.query.sort = 'totalStreams';
    const data = await trackService.getTopTracks(req.user._id, res.query);

    res.status(200).json({
        status: 'success',
        data,
    });
});

exports.getArtistTopTrack = catchAsync(async (req, res, next) => {
    req.query.sort = 'totalStreams';
    const data = await trackService.getArtistTopTracks(
        req.params.id,
        req.query
    );
    res.status(200).json({
        status: 'success',
        data,
    });
});

exports.getTopTracksByArtist = catchAsync(async (req, res, next) => {
    const artistId = req.user._id;
    if (!artistId) {
        return next(new AppError('Missing Artist Id', 400));
    }
    const data = await trackService.getArtistTopTracks(artistId, req.query);
    res.status(200).json({
        status: 'success',
        data,
    });
});
