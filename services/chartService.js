const UserStreamModel = require('./../models/userStreamModel');
const ChartModel = require('./../models/chartModel');
exports.updateTrack = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let result;
            // Define the start and end of the day
            const currentDate = new Date();
            const date = currentDate.getDate();
            const month = currentDate.getMonth();
            const year = currentDate.getFullYear();
            const startOfDay = new Date(year, month, date - 1, 0, 0, 0);
            const endOfDay = new Date(year, month, date - 1, 23, 59, 59);

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
                    $sort: { streams: -1 }, // Sort tracks by count in descending order
                },
                {
                    $limit: 10, // Limit to the top 10 tracks
                },
            ]);

            const oldChart = await ChartModel.findOne({
                chartDate: {
                    $gt: new Date(year, month, date - 2, 23, 59, 59),
                    $lt: new Date(year, month, date - 1, 0, 0, 59),
                },
            });

            // remove current chart
            if (oldChart) {
                await ChartModel.findByIdAndDelete(oldChart._id);
            }

            const prevChart = await ChartModel.findOne({
                chartDate: {
                    $gt: new Date(year, month, date - 3, 23, 59, 59),
                    $lt: new Date(year, month, date - 2, 0, 0, 59),
                },
            });
            let trackOrder = [];
            if (prevChart) {
                const { tracks } = prevChart;

                trackOrder = result.map((item, index) => {
                    const prevPosition = tracks.findIndex(
                        (item) => item?.track === item._id
                    );
                    return {
                        track: item._id,
                        totalStreams: item.totalStreams,
                        order: index,
                        prevPosition: prevPosition,
                        peak: Math.max(prevPosition, order),
                    };
                });
            } else {
                trackOrder = result.map((item, index) => ({
                    track: item._id,
                    totalStreams: item.totalStreams,
                    order: index,
                }));
            }
            const chart = await ChartModel.create({
                chartDate: new Date(year, month, date - 1, 0, 0, 0),
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
