const searchService = require('./../services/searchService');
const catchAsync = require('./../utils/catchAsync');
const albumService = require('./../services/albumService');
const singleService = require('./../services/singleService');
const trackService = require('./../services/trackService');
const artistService = require('./../services/artistService');
const playlistService = require('./../services/featuredPlaylistService');

exports.search = catchAsync(async (req, res, next) => {
    const { q, type } = req.query;
    let promise = undefined;
    switch (type) {
        case 'track':
            promise = searchService.searchTrack(q, req.query);
            break;
        case 'album':
            promise = searchService.searchAlbum(q, req.query);
            break;
        case 'playlist':
            promise = searchService.searchPlaylist(q, req.query);
            break;
        case 'artist':
            promise = searchService.searchArtist(q, req.query);
            break;
        default:
            promise = searchService.search(q, req.query);
    }

    const data = await promise;
    res.status(200).json({
        status: 'success',
        data: data,
    });
});

exports.searchPaging = catchAsync(async (req, res, next) => {
    const { q, type } = req.query;
    let promise = undefined;
    switch (type) {
        case 'track':
            promise = trackService.searchTrackPaging(q, req.query);
            break;
        case 'album':
            promise = albumService.searchAlbumPaging(q, req.query);
            break;
        case 'playlist':
            promise = playlistService.searchPlaylistPaging(q, req.query);
            break;
        case 'artist':
            promise = artistService.searchArtistPaging(q, req.query);
            break;
        default:
            promise = searchService.search(q, req.query);
    }

    if (!promise) {
        res.status(400).json({ status: 'fail' });
    }
    const data = await promise;
    res.status(200).json({
        status: 'success',
        data: data,
    });
});

exports.getNewReleases = catchAsync(async (req, res, next) => {
    const singlePromise = singleService.getNewReleaseSingles(req.query);
    const albumPromise = albumService.getNewReleaseAlbums(req.query);

    const [tracks, albums] = await Promise.all([singlePromise, albumPromise]);
    res.status(200).json({
        status: 'success',
        data: {
            tracks: tracks.data,
            albums: albums.data,
        },
    });
});
