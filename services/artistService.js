const ArtistProfileModel = require('../models/artistProfileModel');
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
