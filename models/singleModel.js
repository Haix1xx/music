const { Schema, model } = require('mongoose');

const singleSchema = new Schema(
    {
        track: {
            type: Schema.Types.ObjectId,
            ref: 'Track',
            required: [true, 'A single must a track'],
        },
        artist: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A track must belong to an artist'],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const SingleModel = model('Single', singleSchema);

module.exports = SingleModel;
