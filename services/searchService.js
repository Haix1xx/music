const TrackModel = require('./../models/trackModel');
const AlbumModel = require('./../models/albumModel');
const ArtistProfileModel = require('./../models/artistProfileModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
exports.search = (searchText, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!searchText) {
                return reject(new AppError('Empty search text'));
            }

            const [artists, tracks, albums] = await Promise.all([
                searchArtist(searchText, query),
                searchTrack(searchText, query),
                searchAlbum(searchText, query),
            ]);

            resolve({
                artists: artists.artists,
                tracks: tracks.tracks,
                albums: albums.albums,
            });
        } catch (err) {
            reject(err);
        }
    });
};

const searchTrack = (searchText, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!searchText) {
                return reject(new AppError('Empty search text'));
            }

            //search tracks
            const trackFeature = new APIFeatures(
                TrackModel.find({
                    title: { $regex: searchText, $options: 'i' },
                }).populate({
                    path: 'artist',
                    populate: 'profile',
                }),
                query
            )
                .sort()
                .paginate();

            const tracks = await trackFeature.query;

            resolve({
                tracks: tracks.map((item) => ({ ...item._doc, type: 'track' })),
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.searchTrack = searchTrack;

const searchAlbum = (searchText, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!searchText) {
                return reject(new AppError('Empty search text'));
            }

            //search albums
            const albumFeature = new APIFeatures(
                AlbumModel.find({
                    title: { $regex: searchText, $options: 'i' },
                }).populate({
                    path: 'artist',
                    select: 'profile email id _id',
                    populate: 'profile',
                }),
                query
            )
                .sort()
                .paginate();

            const albums = await albumFeature.query;

            resolve({
                albums: albums.map((item) => ({ ...item._doc, type: 'album' })),
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.searchAlbum = searchAlbum;

const searchArtist = (searchText, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!searchText) {
                return reject(new AppError('Empty search text'));
            }

            //search artists
            const regex = new RegExp(searchText, 'i');
            const artistFeature = new APIFeatures(
                ArtistProfileModel.find({
                    $or: [
                        {
                            $expr: {
                                $regexMatch: {
                                    input: {
                                        $concat: [
                                            { $ifNull: ['$firstname', ''] }, // Handle potential null values
                                            ' ',
                                            { $ifNull: ['$lastname', ''] },
                                        ],
                                    },
                                    regex: regex.source,
                                    options: 'i',
                                },
                            },
                        },
                        { bio: { $regex: regex } },
                    ],
                }),
                query
            )
                .sort()
                .paginate();

            const artists = await artistFeature.query;
            resolve({
                artists: artists.map((item) => ({
                    ...item._doc,
                    type: 'artist',
                })),
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.searchArtist = searchArtist;
