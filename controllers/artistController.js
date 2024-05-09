const ArtistProfileModel = require('./../models/artistProfileModel');
const factory = require('./handlerFactory');

exports.getAllArtists = factory.getAll(ArtistProfileModel);

exports.getArtist = factory.getOne(ArtistProfileModel);

exports.updateArtist = factory.updateOne(ArtistProfileModel);
