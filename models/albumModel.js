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

const albumSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide album's title"],
        },
        coverPath: {
            type: String,
            required: [true, "Please provide track's cover path"],
        },
        releaseDate: {
            type: Date,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        duration: {
            type: Number,
            default: 0,
        },
        artist: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'An album must belong to an artist'],
        },
        tracks: [trackOrder],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const AlbumModel = model('Album', albumSchema);

module.exports = AlbumModel;
