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

exports.getChart = catchAsync(async (req, res, next) => {
    const chartDate = await req.params.date;
    console.log(chartDate);
    let chartPromise;

    if (chartDate === 'latest') {
        chartPromise = chartService.getLatestChart();
    } else {
        chartPromise = chartService.getChart(chartDate);
    }
    const data = await chartPromise;
    res.status(200).json({
        status: 'success',
        data,
    });
});
