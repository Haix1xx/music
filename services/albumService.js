const AlbumModel = require('./../models/albumModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAlbumsByArtist = (artistId, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!artistId) {
                return reject(new AppError('You need to pass artist id', 403));
            }
            const features = new APIFeatures(
                AlbumModel.find({ artist: artistId }).populate('artist'),
                query
            )
                .filter()
                .sort()
                .limitFields()
                .paginate();

            const albums = await features.query;
            const total = await AlbumModel.countDocuments({ artist: artistId });

            return resolve({
                data: albums,
                total: total,
            });
        } catch (err) {
            reject(err);
        }
    });
};
