const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide name of genre'],
        },
    },
    {
        timestamps: true,
    }
);

const GenreModel = mongoose.model('Genre', genreSchema);

module.exports = GenreModel;
