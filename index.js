const mongoose = require('mongoose');
const Models = require('../models.js');
const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const express = require("express"),
  morgan = require("morgan"),
  uuid = require("uuid");

const bodyParser = require("body-parser"),
  methodOverride = require("method-override");
const { rest } = require('lodash');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan("common"));



let users = [{
    id: 1,
    name: "Alice",
    favMovies: []
  },
  {
    id: 2,
    name: "Bob",
    favMovies: ["A Space Oddyssey"]
  }
];

let topMovies = [{
    "title": "A Space Oddyssey",
    "year": 1968,
    "genre": "Science fiction",
    "img": "https://media.timeout.com/images/105455969/750/562/image.jpg",
    "director": {
      "name": "Stanley Kubrick",
      "birth": 1928,
      "death": 1999,
    },
    "featured": true,
  },
  {
    "title": "The Godfather",
    "year": 1972,
    "genre": "Thrillers",
    "img": "https://media.timeout.com/images/105455970/750/562/image.jpg",
    "director": {
      "name": "Francis Ford Coppola",
      "birth": 1939,
      "death": null,
    },
    "featured": true,
  },
  {
    "title": "Citizen Kane",
    "year": 1941,
    "genre": "Drama",
    "img": "https://media.timeout.com/images/105455971/750/562/image.jpg",
    "director": {
      "name": "Orson Welles",
      "birth": 1915,
      "death": 1985,
    },
    "featured": true,
  },
  {
    "title": "Jeanne Dielman, 23, Quai du Commerce, 1080 Bruxells",
    "year": 1975,
    "genre": "",
    "img": "https://media.timeout.com/images/105455972/750/562/image.jpg",
    "director": {
      "name": "Chantal Anne Akerman",
      "birth": 1950,
      "death": 2015,
    },
    "featured": false,
  },
  {
    "title": "Raiders of the Lost Ark",
    "year": 1981,
    "genre": "Action",
    "img": "https://media.timeout.com/images/105455973/750/562/image.jpg",
    "director": {
      "name": "Steven Spielberg",
      "birth": 1946,
      "death": null,
    },
    "featured": true,
  },
  {
    "title": "La Dolce Vita",
    "year": 1960,
    "genre": "Drama",
    "img": "https://media.timeout.com/images/105456105/750/562/image.jpg",
    "director": {
      "name": "Federico Fellini",
      "birth": 1920,
      "death": 1993,
    },
    "featured": true,
  },
  {
    "title": "Seven Samurai",
    "year": 1954,
    "genre": "Action",
    "img": "https://media.timeout.com/images/101714537/750/562/image.jpg",
    "director": {
      "name": "Akira Kurosawa",
      "birth": 1910,
      "death": 1998,
    },
    "featured": true,
  },
  {
    "title": "In the Mood for Love",
    "year": 2000,
    "genre": "Drama",
    "img": "https://media.timeout.com/images/105455977/750/562/image.jpg",
    "director": {
      "name": "Wong Kar-wai",
      "birth": 1958,
      "death": null,
    },
    "featured": false,
  },
  {
    "title": "There Will Be Blood",
    "year": 2007,
    "genre": "Drama",
    "img": "https://media.timeout.com/images/105455978/750/562/image.jpg",
    "director": {
      "name": "Paul Thomas Anderson",
      "birth": 1970,
      "death": null,
    },
    "featured": true,
  },
  {
    "title": "Singin' in the Rain",
    "year": 1952,
    "genre": "Comedy",
    "img": "https://media.timeout.com/images/105455980/750/562/image.jpg",
    "director": {
      "name": "Stanley Donen",
      "birth": 1924,
      "death": 2019,
    },
    "featured": true,
  },
];

// Welcome message
app.get("/", (req, res) => {
  res.send("Welcome to Movie App!");
});

// Serving Static Files
// app.use(express.static("public"));

// Task 2.5

// Return a list of ALL movies to the user
app.get("/movies", (req, res) => {
  res.status(200).json(topMovies);
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get("/movies/:title", (req, res) => {
  const {
    title
  } = req.params;
  const movie = topMovies.find(movie => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(404).send("Movie not found");
  }
});

// Return data about a genre (decription) by name/title (e.g., "Thriller")
app.get("/movies/genre/:genreName", (req, res) => {
  const {
    genreName
  } = req.params;
  const genre = topMovies.find(movie => movie.genre === genreName).genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("Genre not found");
  }
});

// Return data about a director (name, birth year, death year) by name 
app.get("/movies/directors/:directorName", (req, res) => {
  const {
    directorName
  } = req.params;
  const director = topMovies.find(movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("Director not found");
  }
});

// Additional self-task: return a list of ALL users
app.get("/users", (req, res) => {
  res.status(200).json(users);
});

// Allow new users to register
// app.post("/users", (req, res) => {
//   const newUser = req.body;

//   if (newUser.name) {
//     newUser.id = uuid.v4();
//     users.push(newUser);
//     res.status(201).json(newUser);
//   } else {
//     const message = "Missing name in request body.";
//     res.status(400).send(message);
//   }
// });

app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
      .create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => {res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        rest.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

// Allow users to update their user info (username)
app.put("/users/:id", (req, res) => {
  const {
    id
  } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user)
  } else {
    const message = "User not found.";
    res.status(400).send(message);
  }
});

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.post("/users/:id/:movieTitle", (req, res) => {
  const {
    id,
    movieTitle
  } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favMovies.push(movieTitle);
    res.status(200).json(`${movieTitle} has been added to user ${id}'s array`);
  } else {
    const message = "Fav Movies not found";
    res.status(400).send(message);
  }

});

// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete("/users/:id/:movieTitle", (req, res) => {
  const {
    id,
    movieTitle
  } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favMovies = user.favMovies.filter(title => title !== movieTitle);
    res.status(200).json(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    const message = "Fav Movies not found";
    res.status(400).send(message);
  }

});

// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
app.delete("/users/:id", (req, res) => {
  const {
    id
  } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).json(`User ${id} has been deleted`);
  } else {
    const message = "User ID not found";
    res.status(400).send(message);
  }
});

//Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("This app is listening on port 8080.");
});