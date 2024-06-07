const ArtistProfileModel = require('../models/artistProfileModel');
const UserModel = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const commonDAO = require('./../utils/commonDAO');

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

const searchArtistPaging = (searchText, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!searchText) {
                return reject(new AppError('Empty search text'));
            }
            //search artists
            const regex = new RegExp(searchText, 'i');
            const conditions = {
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
                    { displayname: { $regex: regex } },
                ],
            };
            const popOptions = {
                path: 'user',
                select: '_id id email role',
            };
            const [data, total] = await commonDAO.getAllWithPagination(
                ArtistProfileModel,
                query,
                popOptions,
                conditions
            );

            resolve({
                aritsts: data, //tracks.map((item) => ({ ...item._doc, type: 'track' })),
                total,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.searchArtistPaging = searchArtistPaging;
