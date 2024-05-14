const { Schema, model } = require('mongoose');

const chartOrder = new Schema({
    order: {
        type: Number,
    },
    track: {
        type: Schema.Types.ObjectId,
        ref: 'Track',
    },
    totalStreams: {
        type: Number,
        default: 0,
    },
    prevPosition: {
        type: Number,
        default: -1,
    },
    peak: {
        type: Number,
        default: -1,
    },
});
const chartSchema = new Schema(
    {
        chartDate: {
            type: Date,
            required: [true, 'chart must have date'],
        },
        tracks: [chartOrder],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const ChartModel = model('Chart', chartSchema);

module.exports = ChartModel;
