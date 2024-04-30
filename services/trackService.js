const TrackModel = require('./../models/trackModel');
const TrackGenreModel = require('./../models/trackGenreModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const AlbumModel = require('../models/albumModel');

exports.createTrack = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data);
            let {
                title,
                url,
                coverPath,
                releaseDate,
                isPublic,
                duration,
                user,
                writtenBy,
                producedBy,
                source,
                copyRight,
                publishRight,
                genres,
            } = data;
            const track = await TrackModel.create({
                title: title,
                url: url,
                coverPath: coverPath,
                releaseDate: releaseDate,
                isPublic: isPublic,
                duration: duration,
                artist: user,
                writtenBy: writtenBy,
                producedBy: producedBy,
                source: source,
                copyRight: copyRight,
                publishRight: publishRight,
            });
            if (!track) {
                return reject(
                    new AppError('An error occured while creating a track', 403)
                );
            }

            if (genres) {
                const genresArr = genres.split(',');
                const promises = genresArr.map(async (genre) => {
                    await TrackGenreModel.create({
                        genre: genre,
                        track: track.id,
                    });
                });

                await Promise.all(promises);
            }

            resolve({
                data: track,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getTracksByArtist = (artistId, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!artistId) {
                return reject(new AppError('You need to pass artist id', 403));
            }

            const features = new APIFeatures(
                TrackModel.find({ artist: artistId }),
                query
            )
                .filter()
                .sort()
                .limitFields()
                .paginate();

            features.query = features.query.populate('artist collaborators');

            const tracks = await features.query;
            const total = await TrackModel.countDocuments({ artist: artistId });
            resolve({
                data: tracks,
                total: total,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getTracksByAlbum = (albumId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!albumId) {
                return reject(new AppError('You do not pass a album id', 403));
            }

            const tracks = await AlbumModel.findById(albumId).populate(
                'tracks.track'
            );

            resolve({
                data: tracks,
            });
        } catch (err) {
            reject(err);
        }
    });
};
