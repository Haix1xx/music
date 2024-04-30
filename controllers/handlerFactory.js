const catchAsync = require('./../utils/catchAsync');
const handlerFactoryService = require('../services/handlerFactoryService');

exports.deleteOne = (Model) =>
    catchAsync(async (req, res) => {
        const doc = await handlerFactoryService.deleteOne(Model, req.params.id);

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res) => {
        const doc = await handlerFactoryService.updateOne(
            Model,
            req.params.id,
            req.body
        );

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res) => {
        const doc = await handlerFactoryService.createOne(Model, req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res) => {
        const doc = await handlerFactoryService.getOne(
            Model,
            req.params.id,
            popOptions
        );

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });
exports.getAll = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        // To allow for nested GET reviews on tour (hack)
        let filter = {};
        // if (req.params.tourId) filter = { tour: req.params.tourId };

        // const features = new APIFeatures(Model.find(filter), req.query)
        //   .filter()
        //   .sort()
        //   .limitFields()
        //   .paginate();
        // // const doc = await features.query.explain();
        // const doc = await features.query;
        const doc = await handlerFactoryService.getAll(
            Model,
            req.query,
            popOptions
        );
        const total = await Model.countDocuments();
        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: doc.length,
            total,
            data: {
                data: doc,
            },
        });
    });
