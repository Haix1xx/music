const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const SingleModel = require('./../models/singleModel');

exports.getSinglesByArtist = (artistId, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!artistId) {
                return reject(new AppError('You need to pass artist id', 403));
            }

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
