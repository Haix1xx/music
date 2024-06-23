const { Schema, model } = require('mongoose');

const profileSchema = new Schema(
    {
        firstname: {
            type: String,
            maxLength: 20,
            minLength: 2,
            trim: true,
            required: [true, 'Please tell us your first name!'],
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9_\p{L}\s]+$/u.test(value);
                },
                message: 'Firstname only contains characters and numbers',
            },
        },
        lastname: {
            type: String,
            maxLength: 20,
            minLength: 2,
            trim: true,
            required: [true, 'Please tell us your last name!'],
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9_\p{L}\s]+$/u.test(value);
                },
                message:
                    'Lastname only contains characters, numbers and underscore',
            },
        },
        gender: {
            type: Boolean,
            required: [true, 'Please tell us your gender'],
        },
        avatar: String,
        birthday: Date,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

profileSchema.index({ user: 1 }, { unique: true });

const ProfileModel = model('Profile', profileSchema);

module.exports = ProfileModel;
