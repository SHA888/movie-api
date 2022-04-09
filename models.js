const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {
        type: 'string',
        required: true,
    },
    ReleaseYear: {
        type: 'string',
        required: true,
    },
    Description: {
        type: 'string',
        required: true,
    },
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actor: [String],
    ImageUrl: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {
        type: 'string',
        required: true
    },
    Password: {
        type: 'string',
        required: true
    },
    Email: {
        type: 'string',
        required: true
    },
    Birtday: Date,
    FavoriteMovie: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;