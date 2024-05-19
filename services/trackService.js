const TrackModel = require('./../models/trackModel');
const TrackGenreModel = require('./../models/trackGenreModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const AlbumModel = require('../models/albumModel');
const SingleModel = require('./../models/singleModel');
const FeaturedPlaylistModel = require('./../models/featuredPlaylist');
const UserModel = require('./../models/userModel');
const UserStreamModel = require('./../models/userStreamModel');
const { SageMakerFeatureStoreRuntime } = require('aws-sdk');

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

            features.query = features.query.populate({
                path: 'artist',
                select: 'id _id email role profile',
                populate: 'profile',
            });

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
                    populate: {
                        path: 'track',
                        populate: {
                            path: 'artist',
                            select: 'profile id _id email role',
                            populate: 'profile',
                        },
                    },
                });

            if (!tracks) {
                reject(new AppError('Album not found', 404));
            }
            resolve({
                data: tracks,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getTracksByFPlaylist = (playlistId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!playlistId) {
                return reject(
                    new AppError('You do not pass a playlist id', 403)
                );
            }

            const tracks = await FeaturedPlaylistModel.findById(
                playlistId
            ).populate({
                path: 'tracks',
                populate: {
                    path: 'track',
                    populate: {
                        path: 'artist',
                        select: 'profile id _id email role isActive',
                        populate: 'profile',
                    },
                },
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
            if (!album) {
                return reject(new AppError('Album not found', 404));
            }
            let { tracks } = album;

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

exports.AddTrackToPlaylist = (playlistId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!playlistId) {
                return reject(new AppError('Missing playlist id', 403));
            }

            const playlist = await FeaturedPlaylistModel.findById(playlistId);
            if (!playlist) {
                return reject(new AppError('Playlist not found', 404));
            }

            let { tracks } = playlist;

            const updatedPlaylist =
                await FeaturedPlaylistModel.findByIdAndUpdate(playlistId, {
                    tracks: tracks,
                });

            console.log(updatedPlaylist);

            resolve({
                data: updatedPlaylist,
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

// exports.getRecentlyPlayed = (userId, query) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!userId) {
//                 return reject(new AppError('Missing user id', 403));
//             }

//             const features = new APIFeatures(
//                 UserStreamModel.find({ user: userId }).populate({
//                     path: 'track',
//                     populate: {
//                         path: 'artist',
//                         populate: 'profile',
//                     },
//                 }),
//                 query
//             )
//                 .sort()
//                 .paginate();

//             const tracks = await features.query;

//             const data = tracks.map((item) => ({
//                 track: item.track,
//                 streamedAt: item.streamedAt,
//             }));
//             resolve({
//                 data: data,
//             });
//         } catch (err) {
//             reject(err);
//         }
//     });
// };

exports.getRecentlyPlayed = (userId, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                return reject(new AppError('Missing user id', 403));
            }

            const tracks = await UserStreamModel.aggregate([
                {
                    $match: { user: userId },
                },
                {
                    $sort: { streamedAt: -1 },
                },
                {
                    $group: {
                        _id: '$track',
                        track: { $first: '$$ROOT' },
                    },
                },
                {
                    $replaceRoot: { newRoot: '$track' },
                },
                {
                    $sort: { streamedAt: -1 },
                },
                {
                    $lookup: {
                        from: 'tracks',
                        localField: 'track',
                        foreignField: '_id',
                        as: 'track',
                    },
                },
                {
                    $unwind: '$track',
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'track.artist',
                        foreignField: '_id',
                        as: 'track.artist',
                    },
                },
                {
                    $unwind: '$track.artist',
                },
                // exclude sensitive fields
                {
                    $project: {
                        'track.artist.password': 0,
                        'track.artist.passwordConfirm': 0,
                        'track.artist.refreshToken': 0,
                        'track.artist.verifyToken': 0,
                    },
                },
                {
                    $limit: Number(query?.limit) ?? 5,
                },
            ]);

            // populate profile
            const populatedTracks = await Promise.all(
                tracks.map(async (item) => {
                    const artistWithProfile = await UserModel.findById(
                        item.track.artist._id
                    )
                        .populate('profile')
                        .exec();

                    item.track.artist.profile = artistWithProfile.profile;

                    return item;
                })
            );

            resolve({
                data: populatedTracks.map((item) => ({
                    track: item.track,
                    streamedAt: item.streamedAt,
                })),
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getTopTracks = (userId, query, dateCount = 10) => {
    return new Promise(async (resolve, reject) => {
        try {
            const today = new Date();
            const fromDate = new Date(today);
            fromDate.setDate(today.getDate() - dateCount);
            const topTracks = await UserStreamModel.aggregate([
                {
                    $match: {
                        user: userId,
                        streamedAt: { $lt: today, $gte: fromDate },
                    },
                },
                {
                    $group: {
                        _id: '$track',
                        count: { $sum: 1 },
                    },
                },
                {
                    $sort: { count: -1 },
                },
                {
                    $limit: Number(query.limit) ?? 10,
                },
            ]);

            await Promise.all(
                topTracks.map(async (item) => {
                    item.track = await TrackModel.findById(item._id).populate({
                        path: 'artist',
                        select: '_id id email profile',
                        populate: {
                            path: 'profile',
                            justOne: true,
                        },
                    });
                })
            );
            resolve({
                data: topTracks,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.getArtistTopTracks = (artistId, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            query.sort = 'totalStreams';
            const features = new APIFeatures(
                TrackModel.find({ artist: artistId }),
                query
            )
                .sort()
                .paginate();

            const tracks = await features.query;
            resolve({
                data: tracks,
            });
        } catch (err) {
            reject(err);
        }
    });
};
