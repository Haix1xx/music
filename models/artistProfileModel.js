const { Schema } = require('mongoose');
const ProfileModel = require('./profileModel');

const artistProfileSchema = new Schema(
    {
        displayname: {
            type: String,
            maxLength: 64,
            trim: true,
        },
        bio: {
            type: String,
            maxLength: 4096 * 2,
            trim: true,
        },
        images: [String],
        popularTracks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Track',
            },
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const ArtistProfileModel = ProfileModel.discriminator(
    'ArtistProfile',
    artistProfileSchema
);

module.exports = ArtistProfileModel;
