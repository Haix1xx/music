const { Schema, model } = require('mongoose');

const trackSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide track's name"],
        },
        url: {
            type: String,
            required: [true, "Please provide track's url"],
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
        },
        totalStreams: {
            type: Number,
            default: 0,
        },
        album: {
            type: Schema.Types.ObjectId,
            ref: 'Album',
        },
        artist: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A track must belong to an artist'],
        },
        collaborators: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        writtenBy: {
            type: String,
            maxLength: 256,
            default: '-',
        },
        producedBy: {
            type: String,
            maxLength: 256,
            default: '-',
        },
        source: {
            type: String,
            maxLength: 256,
            default: '-',
        },
        copyRight: {
            type: String,
            maxLength: 256,
            default: '-',
        },
        publishRight: {
            type: String,
            maxLength: 256,
            default: '-',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const TrackModel = model('Track', trackSchema);

module.exports = TrackModel;
