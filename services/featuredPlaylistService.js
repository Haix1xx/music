const FeaturedPlaylistModel = require('./../models/featuredPlaylist');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const commonDAO = require('./../utils/commonDAO');

exports.updateTracksToPlaylist = (playlistId, data) => {
    return new Promise(async (resolve, reject) => {
        const { tracks } = data;
        if (!playlistId) {
            return reject(new AppError('Missing album id', 403));
        }

        if (!tracks) {
            return reject(new AppError('Tracks are empty', 403));
        }
        // console.log(tracks);
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

const searchPlaylistPaging = (searchText, query) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!searchText) {
                return reject(new AppError('Empty search text'));
            }
            const conditions = {
                title: { $regex: searchText, $options: 'i' },
            };
            const popOptions = undefined;
            const [data, total] = await commonDAO.getAllWithPagination(
                FeaturedPlaylistModel,
                query,
                popOptions,
                conditions
            );

            resolve({
                data,
                total,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.searchPlaylistPaging = searchPlaylistPaging;
