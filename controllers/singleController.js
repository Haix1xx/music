const singleService = require('./../services/singleService');
const catchAsync = require('./../utils/catchAsync');

exports.getSinglesByArtist = catchAsync(async (req, res, next) => {
    const artistId = req.params.id;
    const data = await singleService.getSinglesByArtist(artistId, req.query);
    res.status(200).json({
        status: 'success',
        data: data,
    });
});
