const { Schema, model } = require('mongoose');

const trackGenreSchema = new Schema(
    {
        track: {
            type: Schema.Types.ObjectId,
            ref: 'Track',
            required: [true, 'Track is required'],
        },
        genre: {
            type: Schema.Types.ObjectId,
            ref: 'Genre',
            required: [true, 'Genre is required'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

trackGenreSchema.index({ track: 1, genre: 1 }, { unique: true });

const TrackGenreModel = model('TrackGenre', trackGenreSchema);

module.exports = TrackGenreModel;
