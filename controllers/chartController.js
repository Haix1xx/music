const catchAsync = require('../utils/catchAsync');
const ChartModel = require('./../models/chartModel');
const factory = require('./handlerFactory');
const chartService = require('./../services/chartService');

// exports.getArtist = factory.getOne(ArtistProfileModel);
exports.updateChart = catchAsync(async (req, res, next) => {
    const data = await chartService.updateTrack();

    res.status(200).json({
        status: 'success',
        data,
    });
});
