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

const playlistSchema = new Schema(
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
        owner: {
            type: Schema.Types.ObjectId,
            required: [true, 'A playlist must belong to a user'],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const playlistModel = model('Playlist', playlistSchema);

module.exports = playlistModel;
