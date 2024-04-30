const { randomBytes, createHash } = require('crypto');
const { Schema, model } = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const { hash, compare } = bcryptjs;
const { isEmail } = validator;
const userSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            validator: [isEmail, 'Please provide a valid email'],
        },
        role: {
            type: String,
            enum: ['user', 'artist', 'admin'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                // Use an arrow function to capture the correct context of 'this'
                validator: function (el) {
                    return el === this.password;
                },
                message: 'Passwords are not the same!',
            },
        },
        passwordChangedAt: Date,
        refreshToken: String,
        verifyToken: String,
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.virtual('profile', {
    ref: 'Profile',
    foreignField: 'user',
    localField: '_id',
    justOne: true,
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = randomBytes(32).toString('hex');

    this.passwordResetToken = createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const UserModel = model('User', userSchema);

module.exports = UserModel;
