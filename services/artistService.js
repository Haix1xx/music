const ArtistProfileModel = require('../models/artistProfileModel');
const UserModel = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getArtist = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                return reject(new AppError('Misisng user id', 403));
            }

            const artist = await ArtistProfileModel.findOne({
                user: userId,
            }).populate({
                path: 'user',
                select: '_id id email role',
            });

            if (!artist) {
                return reject(new AppError('Artist not found', 404));
            }

            resolve({
                data: artist,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getUserTopArtists = (userId, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                return reject(new AppError('Misisng user id', 403));
            }
            const features = new APIFeatures(
                UserModel.find({ role: 'artist' })
                    .select('-verifyToken -refreshToken')
                    .populate('profile'),
                query
            )
                .sort()
                .paginate();
            const artists = await features.query;
            resolve({
                data: artists,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getTotalArtists = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const total = await ArtistProfileModel.count();
            resolve(total);
        } catch (err) {
            reject(err);
        }
    });
};
