const ArtistRequestModel = require('./../models/artistRequestModel');
const UserModel = require('./../models/userModel');
const ArtistProfileModel = require('./../models/artistProfileModel');
const requestStatus = require('./../common/requestStatus');
const AppError = require('../utils/appError');

exports.createRequest = (artistId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const request = await ArtistRequestModel.create({
                artist: artistId,
                status: requestStatus.PENDING,
            });

            resolve({
                data: request,
            });
        } catch (err) {
            reject(err);
        }
    });
};

const updateRequestStatus = (id, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                return reject(new AppError('Missing request id', 400));
            }
            const request = await ArtistRequestModel.findByIdAndUpdate(
                id,
                {
                    status,
                },
                { new: true, runValidators: true }
            );

            resolve({
                data: request,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.rejectRequest = (id) => updateRequestStatus(id, requestStatus.REJECTED);

exports.approveRequest = (id) =>
    updateRequestStatus(id, requestStatus.APPROVED);

exports.filterRequests = (searchText, status, limit = 10, page = 1) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Initialize aggregation pipeline
            let pipeline = [
                {
                    $lookup: {
                        from: 'users',
                        localField: 'artist',
                        foreignField: '_id',
                        as: 'artist',
                    },
                },
                { $unwind: '$artist' },
                {
                    $lookup: {
                        from: 'profiles',
                        localField: 'artist._id',
                        foreignField: 'user',
                        as: 'artist.profile',
                    },
                },
                { $unwind: '$artist.profile' },
            ];

            // Add status filter if provided
            if (status) {
                pipeline.push({
                    $match: { status: status },
                });
            }

            // Add search text filter if provided
            if (searchText) {
                const regex = new RegExp(searchText, 'i'); // Case-insensitive regex
                pipeline.push({
                    $match: {
                        $or: [
                            { 'artist.profile.displayname': regex },
                            { 'artist.email': regex },
                        ],
                    },
                });
            }
            pipeline.push({ $sort: { createdAt: -1 } });
            // Add stage to count total documents
            const countPipeline = [...pipeline, { $count: 'totalDocs' }];

            // Add pagination stages
            const skip = (page - 1) * limit;
            pipeline.push({ $skip: skip });
            pipeline.push({ $limit: limit });

            // count
            const totalPromise = ArtistRequestModel.aggregate(countPipeline);

            // data
            const dataPromise = ArtistRequestModel.aggregate(pipeline);

            const [total, data] = await Promise.all([
                totalPromise,
                dataPromise,
            ]);
            // Return total docs and paginated results
            return resolve({
                data,
                total: total.length > 0 ? total[0].totalDocs : 0,
            });
        } catch (err) {
            return reject(err);
        }
    });
};
