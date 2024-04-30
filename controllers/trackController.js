const TrackModel = require('./../models/trackModel');
const factory = require('./handlerFactory');
const trackService = require('./../services/trackService');
const catchAsync = require('./../utils/catchAsync');
const { s3UploadFile } = require('./../utils/s3Services');
const { uploadImageToCloudinary } = require('./../utils/cloudinaryServices');
const { getAudioDuration } = require('./../utils/fileServices');

exports.getAllTracks = factory.getAll(TrackModel);

exports.getTrack = factory.getOne(TrackModel);

exports.getTracksByAlbum = catchAsync(async (req, res, next) => {
    const albumId = req.params.albumId;

    const data = await trackService.getTracksByAlbum(albumId);
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
    console.log(req.body);
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
