const UserStreamModel = require('./../models/userStreamModel');
const TrackModel = require('./../models/trackModel');
const AppError = require('./../utils/appError');

exports.createUserStream = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { user, track } = data;

            const existingTrack = await TrackModel.findById(track);

            if (!existingTrack) {
                return reject(
                    new AppError(`Track with id ${track} not found`, 400)
                );
            }

            const stream = await UserStreamModel.create({
                user: user,
                track: track,
                streamedAt: Date.now(),
            });

            return resolve(stream);
        } catch (err) {
            reject(err);
        }
    });
};
