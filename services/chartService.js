const UserStreamModel = require('./../models/userStreamModel');
const ChartModel = require('./../models/chartModel');
const AppError = require('../utils/appError');
exports.updateTrack = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let result;
            // Define the start and end of the day
            const currentDate = new Date();
            const date = currentDate.getDate();
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            const startOfDay = new Date(year, month, date - 0, 0, 0, 0);
            const endOfDay = new Date(year, month, date - 0, 23, 59, 59);

            const startOfPrevDay = new Date(year, month, date - 1, 0, 0, 0);
            const endOfPrevDay = new Date(year, month, date - 1, 23, 59, 59);
            // console.log(startOfDay, endOfDay);
            // console.log(startOfPrevDay, endOfPrevDay);
            result = await UserStreamModel.aggregate([
                {
                    $match: {
                        streamedAt: { $gte: startOfDay, $lte: endOfDay },
                    }, // Filter streams for the current day
                },
                {
                    $group: {
                        _id: '$track', // Group by track
                        totalStreams: { $sum: 1 }, // Count the number of streams for each track
                    },
                },
                {
                    $sort: { totalStreams: -1 }, // Sort tracks by count in descending order
                },
                {
                    $limit: 50, // Limit to the top 50 tracks
                },
            ]);

            const oldChart = await ChartModel.findOne({
                chartDate: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            });
            // console.log(oldChart);
            // remove current chart
            if (oldChart) {
                await ChartModel.findByIdAndDelete(oldChart._id);
            }

            const prevChart = await ChartModel.findOne({
                chartDate: {
                    $gte: startOfPrevDay,
                    $lte: endOfPrevDay,
                },
            });
            let trackOrder = [];
            if (prevChart) {
                const { tracks } = prevChart;

                trackOrder = result.map((item, index) => {
                    const prevPosition = tracks.findIndex(
                        (prevItem) =>
                            prevItem?.track.toString() === item._id.toString()
                    );
                    return {
                        track: item._id,
                        totalStreams: item.totalStreams,
                        order: index,
                        prevPosition: prevPosition,
                        peak:
                            prevPosition === -1
                                ? index
                                : Math.min(tracks[prevPosition].peak, index),
                    };
                });
            } else {
                trackOrder = result.map((item, index) => ({
                    track: item._id,
                    totalStreams: item.totalStreams,
                    order: index,
                }));
            }
            // console.log(trackOrder);
            const chart = await ChartModel.create({
                chartDate: new Date(year, month, date - 0, 0, 0, 0),
                tracks: trackOrder,
            });
            resolve({
                data: chart,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getChart = (chartDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!chartDate) {
                return reject(new AppError('Missing chart date', 400));
            }

            const charts = await ChartModel.aggregate([
                {
                    $addFields: {
                        chartDateOnly: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$chartDate',
                            },
                        },
                    },
                },
                {
                    $match: {
                        chartDateOnly: new Date(chartDate)
                            .toISOString()
                            .split('T')[0],
                    },
                },
                {
                    $unwind: '$tracks',
                },
                {
                    $lookup: {
                        from: 'tracks',
                        localField: 'tracks.track',
                        foreignField: '_id',
                        as: 'trackDetails',
                    },
                },
                {
                    $unwind: '$trackDetails',
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'trackDetails.artist',
                        foreignField: '_id',
                        as: 'artistDetails',
                    },
                },
                {
                    $unwind: '$artistDetails',
                },
                {
                    $lookup: {
                        from: 'profiles',
                        localField: 'artistDetails._id',
                        foreignField: 'user',
                        as: 'artistProfile',
                    },
                },
                {
                    $unwind: {
                        path: '$artistProfile',
                        preserveNullAndEmptyArrays: true, // Use this to handle cases where a profile might not exist
                    },
                },
                {
                    $addFields: {
                        'trackDetails.artist': {
                            _id: '$artistDetails._id',
                            email: '$artistDetails.email',
                            role: '$artistDetails.role',
                            profile: '$artistProfile',
                        },
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        chartDate: { $first: '$chartDate' },
                        tracks: {
                            $push: {
                                order: '$tracks.order',
                                track: '$trackDetails',
                                totalStreams: '$tracks.totalStreams',
                                prevPosition: '$tracks.prevPosition',
                                peak: '$tracks.peak',
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        chartDate: 1,
                        tracks: 1,
                    },
                },
            ]);

            if (charts.length === 0) {
                return reject(new AppError('Chart not found', 404));
            }
            return resolve(charts[0]);
        } catch (err) {
            reject(err);
        }
    });
};

exports.getLatestChart = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const charts = await ChartModel.aggregate([
                {
                    $sort: { chartDate: -1 },
                },
                {
                    $limit: 1,
                },
                {
                    $unwind: '$tracks',
                },
                {
                    $lookup: {
                        from: 'tracks',
                        localField: 'tracks.track',
                        foreignField: '_id',
                        as: 'trackDetails',
                    },
                },
                {
                    $unwind: '$trackDetails',
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'trackDetails.artist',
                        foreignField: '_id',
                        as: 'artistDetails',
                    },
                },
                {
                    $unwind: '$artistDetails',
                },
                {
                    $lookup: {
                        from: 'profiles',
                        localField: 'artistDetails._id',
                        foreignField: 'user',
                        as: 'artistProfile',
                    },
                },
                {
                    $unwind: {
                        path: '$artistProfile',
                        preserveNullAndEmptyArrays: true, // Use this to handle cases where a profile might not exist
                    },
                },
                {
                    $addFields: {
                        'trackDetails.artist': {
                            _id: '$artistDetails._id',
                            email: '$artistDetails.email',
                            role: '$artistDetails.role',
                            profile: '$artistProfile',
                        },
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        chartDate: { $first: '$chartDate' },
                        tracks: {
                            $push: {
                                order: '$tracks.order',
                                track: '$trackDetails',
                                totalStreams: '$tracks.totalStreams',
                                prevPosition: '$tracks.prevPosition',
                                peak: '$tracks.peak',
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        chartDate: 1,
                        tracks: 1,
                    },
                },
            ]);

            if (charts.length === 0) {
                return reject(new AppError('Chart not found', 404));
            }
            return resolve(charts[0]);
        } catch (err) {
            reject(err);
        }
    });
};
