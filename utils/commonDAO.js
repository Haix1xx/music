const APIFeatures = require('./apiFeatures');

const countDocuments = (Model, conditions = {}) =>
    Model.countDocuments(conditions);

const getAllWithPagination = (Model, query, popOptions, conditions) => {
    console.log(conditions);
    const features = new APIFeatures(Model.find(conditions), query)
        .sort()
        .paginate();
    if (popOptions) {
        features.query = features.query.populate(popOptions);
    }

    return Promise.all([features.query, countDocuments(Model, conditions)]);
};

exports.getAllWithPagination = getAllWithPagination;
