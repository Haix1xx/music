const GenreModel = require('./../models/genreModel');
const factory = require('./handlerFactory');

exports.getAllGenres = factory.getAll(GenreModel);

exports.getGenre = factory.getOne(GenreModel);

exports.createGenre = factory.createOne(GenreModel);

exports.deleteGenre = factory.deleteOne(GenreModel);

exports.updateGenre = factory.updateOne(GenreModel);
