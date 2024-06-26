const trackService = require('./../services/trackService');
const userService = require('./../services/userService');
const artistService = require('../services/artistService');
const userStreamService = require('../services/userStreamService');
const albumService = require('../services/albumService');
const singleService = require('../services/singleService');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    const [userCount, artistCount, streamCount, trackCount] = await Promise.all(
        [
            userService.getTotalUsers(),
            artistService.getTotalArtists(),
            userStreamService.getTotalStreams(),
            trackService.getTotalTracks(),
        ]
    );
    const data = { userCount, artistCount, streamCount, trackCount };
    res.status(200).json({ status: 'success', data });
});

exports.getTopTracks = catchAsync(async (req, res, next) => {
    const data = await trackService.getTopTracksOverview(req.query);

    res.status(200).json({
        status: 'success',
        data: data,
    });
});

exports.getArtistOverview = catchAsync(async (req, res, next) => {
    const artistId = req.user._id;
    const [trackCount, albumCount, streamCount, singleCount] =
        await Promise.all([
            trackService.getTotalTracksByArtist(artistId),
            albumService.getTotalAlbumsByArtist(artistId),
            userStreamService.getTotalStreamsByArtist(artistId),
            singleService.getTotalSinglesByArtist(artistId),
        ]);
    const data = { trackCount, albumCount, streamCount, singleCount };
    res.status(200).json({ status: 'success', data });
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
