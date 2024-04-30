const catchAsync = require('./../utils/catchAsync');
const userStreamService = require('./../services/userStreamService');

exports.createUserStream = catchAsync(async (req, res, next) => {
    const data = await userStreamService.createUserStream(req.body);
    res.status(201).json({
        status: 'success',
        data: data,
    });
});
