const searchService = require('./../services/searchService');
const catchAsync = require('./../utils/catchAsync');
exports.search = catchAsync(async (req, res, next) => {
    const { q } = req.query;
    const data = await searchService.search(q, req.query);

    res.status(200).json({
        status: 'success',
        data: data,
    });
});
