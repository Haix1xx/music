const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const SingleModel = require('./../models/singleModel');

exports.getSinglesByArtist = (artistId, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!artistId) {
                return reject(new AppError('You need to pass artist id', 403));
            }

            // query.sort = 'track.releaseDate';
            const features = new APIFeatures(
                SingleModel.find({ artist: artistId }),
                query
            )
                .filter()
                .sort()
                .limitFields()
                .paginate();

            features.query = features.query.populate('track').populate({
                path: 'artist',
                populate: 'profile',
            });

            const singles = await features.query;
            const total = await SingleModel.countDocuments({
                artist: artistId,
            });
            resolve({
                data: singles,
                total: total,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getNewReleaseSingles = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            query.sort = '-createdAt';
            const features = new APIFeatures(SingleModel.find(), query)
                .filter()
                .sort()
                .limitFields()
                .paginate();

            features.query = features.query.populate({
                path: 'track',
                populate: {
                    path: 'artist',
                    select: '-verifyToken -refreshToken',
                    populate: 'profile',
                },
            });

            const singles = await features.query;
            console.log(singles);
            const tracks = singles.map((item) => item.track);
            const returnTracks = tracks.map((item) => ({
                ...item._doc,
                type: 'track',
            }));
            resolve({
                data: returnTracks,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getTotalSinglesByArtist = (artistId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const total = await SingleModel.countDocuments({
                artist: artistId,
            });
            resolve(total);
        } catch (err) {
            reject(err);
        }
    });
};
