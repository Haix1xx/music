const TrackModel = require('./../models/trackModel');
const TrackGenreModel = require('./../models/trackGenreModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const AlbumModel = require('../models/albumModel');
const SingleModel = require('./../models/singleModel');

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
                album,
            } = data;
            let track = '';
            if (album) {
                track = await TrackModel.create({
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
                    album: album,
                });
            } else {
                track = await TrackModel.create({
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
            }
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
            let updatedAlbum;
            let single;
            if (album) {
                const existingAlbum = await AlbumModel.findById(album);

                let { tracks } = existingAlbum;
                tracks.push({ order: tracks.length, track: track.id });

                updatedAlbum = await AlbumModel.findByIdAndUpdate(album, {
                    tracks: tracks,
                });
                console.log(updatedAlbum);
            } else {
                single = await SingleModel.create({
                    track: track.id,
                    artist: user,
                });
            }
            resolve({
                data: {
                    track,
                    album: updatedAlbum,
                    single: single,
                    type: album ? 'album' : 'single',
                },
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

            const tracks = await AlbumModel.findById(albumId)
                .populate({
                    path: 'artist',
                    populate: 'profile',
                })
                .populate({
                    path: 'tracks',
                    populate: 'track',
                });

            resolve({
                data: tracks,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.addTrackToAbum = (data, albumId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const track = await this.createTrack(data);

            const album = await AlbumModel.findById(albumId);

            let { tracks } = album;
            console.log(tracks);
            tracks.push({ order: tracks.length, track: track.id });

            const updatedAlbum = await AlbumModel.findByIdAndUpdate(
                albumId,
                tracks
            );
            console.log(updatedAlbum);
            resolve({
                data: {
                    updatedAlbum,
                    track,
                },
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.updateTrack = (trackId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!trackId) {
                return reject(new AppError('Missing track id', 403));
            }

            const {
                title,
                coverPath,
                isPublic,
                writtenBy,
                producedBy,
                source,
                copyRight,
                publishRight,
            } = data;

            const track = await TrackModel.findByIdAndUpdate(
                trackId,
                {
                    title: title,
                    source: source,
                    coverPath: coverPath,
                    isPublic: isPublic,
                    writtenBy: writtenBy,
                    producedBy: producedBy,
                    copyRight: copyRight,
                    publishRight: publishRight,
                },
                { new: true }
            ).populate({
                path: 'artist',
                populate: 'profile',
            });
            if (!track) {
                return reject(new AppError(`Track not found`, 404));
            }

            return resolve({
                data: track,
            });
        } catch (err) {
            reject(err);
        }
    });
};
