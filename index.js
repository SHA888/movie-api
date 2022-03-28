const express = require("express"),
    morgan = require("morgan"),
    uuid = require("uuid");

const app = express();

const bodyParser = require("body-parser"),
    methodOverride = require("method-override");

let topMovies = [{
        title: "A Space Oddyssey",
        year: 1968,
        genre: "Science fiction",
    },
    {
        title: "The Godfather",
        year: 1972,
        genre: "Thrillers",
    },
    {
        title: "Citizen Kane",
        year: 1941,
        genre: "Drama",
    },
    {
        title: "Jeanne Dielman, 23, Quai du Commerce, 1080 Bruxells",
        year: 1975,
        genre: "",
    },
    {
        title: "Raiders of the Lost Ark",
        year: 1981,
        genre: "Action and adveneture",
    },
    {
        title: "La Dolce Vita",
        year: 1960,
        genre: "",
    },
    {
        title: "Seven Samurai",
        year: 1954,
        genre: "Action and adveneture",
    },
    {
        title: "In the Mood for Love",
        year: 2000,
        genre: "Drama",
    },
    {
        title: "There Will Be Blood",
        year: 2007,
        genre: "Drama",
    },
    {
        title: "Singin' in the Rain",
        year: 1952,
        genre: "Comedy",
    },
];

// Morgan middleware
app.use(morgan("common"));

// Body-parser middleware
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// Welcome message
app.get("/", (req, res) => {
    res.send("Welcome to Movie App!");
});

// Show movies
// app.get("/movies", (req, res) => {
//     res.json(topMovies);
// });

//Serving Static Files
// app.use(express.static("public"));

// Task 2.5

// Return a list of ALL movies to the user

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user

// Return data about a genre (decription) by name/title (e.g., "Thriller")

// Return data about a director (bio, birth year, death year) by name

// Allow new users to register

// Allow users to update their user info (username)

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)

// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)

// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)

//Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
    console.log("Your app is listening on port 8080.");
});