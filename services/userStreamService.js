const mongoose = require('mongoose');
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

exports.getTotalStreams = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const total = await UserStreamModel.countDocuments();
            resolve(total);
        } catch (err) {
            reject(err);
        }
    });
};

exports.getTotalStreamsByArtist = (artistId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await UserStreamModel.aggregate([
                {
                    $lookup: {
                        from: 'tracks',
                        localField: 'track',
                        foreignField: '_id',
                        as: 'trackInfo',
                    },
                },
                {
                    $unwind: '$trackInfo',
                },
                {
                    $match: {
                        'trackInfo.artist': artistId,
                    },
                },
                {
                    $group: {
                        _id: '$trackInfo.artist',
                        totalStreams: { $sum: 1 },
                    },
                },
            ]);

            return resolve(result.length > 0 ? result[0].totalStreams : 0);
        } catch (err) {
            return reject(err);
        }
    });
};
