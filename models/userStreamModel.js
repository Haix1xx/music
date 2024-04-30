const { Schema, model } = require('mongoose');

const userStreamSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'user is required'],
    },
    track: {
        type: Schema.Types.ObjectId,
        required: [true, 'track is required'],
    },
    streamedAt: {
        type: Date,
        default: Date.now,
    },
});

const UserStreamModel = model('UserStream', userStreamSchema);

module.exports = UserStreamModel;
