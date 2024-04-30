const { Schema, model } = require('mongoose');

const followingSchema = new Schema(
    {
        follower: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Follower is required'],
        },
        following: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Follower is required'],
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

followingSchema.index({ follower: 1, following: 1 }, { unique: true });

const FollowingModel = model('Following', followingSchema);

module.exports = FollowingModel;
