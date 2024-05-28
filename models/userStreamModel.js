const { Schema, model } = require('mongoose');

const TrackModel = require('./trackModel');

const userStreamSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'user is required'],
    },
    track: {
        type: Schema.Types.ObjectId,
        ref: 'Track',
        required: [true, 'track is required'],
    },
    streamedAt: {
        type: Date,
        default: Date.now,
    },
});

userStreamSchema.statics.setTotalStreams = async function (trackId) {
    let streams = 0;
    if (trackId) {
        streams = await this.countDocuments({ track: trackId });
        await TrackModel.findByIdAndUpdate(trackId, { totalStreams: streams });
    }
};

userStreamSchema.post('save', async function (doc, next) {
    if (doc) {
        await this.constructor.setTotalStreams(doc.track);
    }
    next();
});
const UserStreamModel = model('UserStream', userStreamSchema);

module.exports = UserStreamModel;
