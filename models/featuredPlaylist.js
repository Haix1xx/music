const { Schema, model } = require('mongoose');

const trackOrder = new Schema({
    track: {
        type: Schema.Types.ObjectId,
        ref: 'Track',
    },
    order: {
        type: Number,
    },
});

const featuredPlaylistSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide album's title"],
        },
        coverPath: {
            type: String,
            required: [true, "Please provide track's cover path"],
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        tracks: [trackOrder],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const featuredPlaylistModel = model('FeaturedPlaylist', featuredPlaylistSchema);

module.exports = featuredPlaylistModel;
