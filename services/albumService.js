const AlbumModel = require('./../models/albumModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.createAlbum = (data, artistId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { title, releaseDate, coverPath } = data;

            const album = await AlbumModel.create({
                artist: artistId,
                coverPath: coverPath,
                title: title,
                releaseDate: releaseDate,
            });

            resolve({
                data: album,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getAlbumsByArtist = (artistId, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!artistId) {
                return reject(new AppError('You need to pass artist id', 403));
            }
            const features = new APIFeatures(
                AlbumModel.find({ artist: artistId }).populate({
                    path: 'artist',
                    select: 'id _id email role profile',
                    populate: 'profile',
                }),
                query
            )
                .filter()
                .sort()
                .limitFields()
                .paginate();

            const albums = await features.query;
            const total = await AlbumModel.countDocuments({ artist: artistId });

            return resolve({
                data: albums,
                total: total,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.updateTracksToAlbum = (albumId, data) => {
    return new Promise(async (resovle, reject) => {
        const { tracks } = data;
        if (!albumId) {
            return reject(new AppError('Missing album id', 403));
        }

        if (!tracks) {
            return reject(new AppError('Tracks are empty', 403));
        }
        const album = await AlbumModel.findByIdAndUpdate(albumId, {
            tracks: tracks,
        });

        resovle({
            data: album,
        });
    });
};

exports.getNewReleaseAlbums = (query) => {
    return new Promise(async (resolve, reject) => {
        try {
            query.sort = '-createdAt';
            const features = new APIFeatures(AlbumModel.find(), query)
                .filter()
                .sort()
                .limitFields()
                .paginate();

            features.query = features.query.populate({
                path: 'artist',
                populate: 'profile',
            });

            const albums = await features.query;

            resolve({
                data: albums.map((item) => ({ ...item._doc, type: 'album' })),
            });
        } catch (err) {
            reject(err);
        }
    });
};
