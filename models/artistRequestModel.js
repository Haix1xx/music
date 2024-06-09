const { Schema, model } = require('mongoose');
const requestStatus = require('./../common/requestStatus');

const artistRequestSchema = new Schema(
    {
        artist: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: requestStatus.STATUSES,
            default: requestStatus.PENDING,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const ArtistRequestModel = model('ArtistRequest', artistRequestSchema);

module.exports = ArtistRequestModel;
