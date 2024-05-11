const searchService = require('./../services/searchService');
const catchAsync = require('./../utils/catchAsync');
exports.search = catchAsync(async (req, res, next) => {
    const { q, type } = req.query;
    let promise = undefined;
    switch (type) {
        case 'track':
            promise = searchService.searchTrack(q, req.query);
            break;
        case 'album':
        case 'artist':
        default:
            promise = searchService.search(q, req.query);
    }

    const data = await promise;
    res.status(200).json({
        status: 'success',
        data: data,
    });
});
