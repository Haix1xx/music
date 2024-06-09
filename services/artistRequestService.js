const ArtistRequestModel = require('./../models/artistRequestModel');
const requestStatus = require('./../common/requestStatus');
const AppError = require('../utils/appError');

exports.createRequest = (artistId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const request = await ArtistRequestModel.create({
                artist: artistId,
                status: requestStatus.PENDING,
            });

            resolve({
                data: request,
            });
        } catch (err) {
            reject(err);
        }
    });
};

const updateRequestStatus = (id, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                return reject(new AppError('Missing request id', 400));
            }
            const request = await ArtistRequestModel.findByIdAndUpdate(
                id,
                {
                    status,
                },
                { new: true, runValidators: true }
            );

            resolve({
                data: request,
            });
        } catch (err) {
            reject(err);
        }
    });
};

exports.rejectRequest = (id) => updateRequestStatus(id, requestStatus.REJECTED);

exports.approveRequest = (id) =>
    updateRequestStatus(id, requestStatus.APPROVED);
