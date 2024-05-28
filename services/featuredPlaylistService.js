const FeaturedPlaylistModel = require('./../models/featuredPlaylist');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.updateTracksToPlaylist = (playlistId, data) => {
    return new Promise(async (resolve, reject) => {
        const { tracks } = data;
        if (!playlistId) {
            return reject(new AppError('Missing album id', 403));
        }

        if (!tracks) {
            return reject(new AppError('Tracks are empty', 403));
        }
        console.log(tracks);
        const playlist = await FeaturedPlaylistModel.findByIdAndUpdate(
            playlistId,
            {
                tracks: tracks,
            }
        );

        resolve({
            data: playlist,
        });
    });
};
