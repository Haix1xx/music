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

            const [artists, tracks, albums] = await Promise.all([
                artistFeature.query,
                trackFeature.query,
                albumFeature.query,
            ]);

            resolve({
                artists,
                tracks,
                albums,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.searchTrack = (searchText, query) => {
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
                tracks,
            });
        } catch (err) {
            reject(err);
        }
    });
};
