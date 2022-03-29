const express = require("express"),
  morgan = require("morgan"),
  uuid = require("uuid");

const app = express();

const bodyParser = require("body-parser"),
  methodOverride = require("method-override");

let users = [{
    id: 0,
    name: 'Alice',
    favMovies: []
  },
  {
    id: ``,
    name: 'Bob',
    favMovies: []
  }
];

let topMovies = [{
    title: "A Space Oddyssey",
    year: 1968,
    genre: "Science fiction",
    img: "https://media.timeout.com/images/105455969/750/562/image.jpg",
    directors: [{
      name: "Stanley Kubrick",
      birth: 1928,
      death: 1999,
    }],
    featured: true,
  },
  {
    title: "The Godfather",
    year: 1972,
    genre: "Thrillers",
    img: "https://media.timeout.com/images/105455970/750/562/image.jpg",
    directors: [{
      name: "Francis Ford Coppola",
      birth: 1939,
      death: null,
    }],
    featured: true,
  },
  {
    title: "Citizen Kane",
    year: 1941,
    genre: "Drama",
    img: "https://media.timeout.com/images/105455971/750/562/image.jpg",
    directors: [{
      name: "Orson Welles",
      birth: 1915,
      death: 1985,
    }],
    featured: true,
  },
  {
    title: "Jeanne Dielman, 23, Quai du Commerce, 1080 Bruxells",
    year: 1975,
    genre: "",
    img: "https://media.timeout.com/images/105455972/750/562/image.jpg",
    directors: [{
      name: "Chantal Anne Akerman",
      birth: 1950,
      death: 2015,
    }],
    featured: false,
  },
  {
    title: "Raiders of the Lost Ark",
    year: 1981,
    genre: "Action",
    img: "https://media.timeout.com/images/105455973/750/562/image.jpg",
    directors: [{
      name: "Steven Spielberg",
      birth: 1946,
      death: null,
    }],
    featured: true,
  },
  {
    title: "La Dolce Vita",
    year: 1960,
    genre: "Drama",
    img: "https://media.timeout.com/images/105456105/750/562/image.jpg",
    directors: [{
      name: "Federico Fellini",
      birth: 1920,
      death: 1993,
    }],
    featured: true,
  },
  {
    title: "Seven Samurai",
    year: 1954,
    genre: "Action",
    img: "https://media.timeout.com/images/101714537/750/562/image.jpg",
    directors: [{
      name: "Akira Kurosawa",
      birth: 1910,
      death: 1998,
    }],
    featured: true,
  },
  {
    title: "In the Mood for Love",
    year: 2000,
    genre: "Drama",
    img: "https://media.timeout.com/images/105455977/750/562/image.jpg",
    directors: [{
      name: "Wong Kar-wai",
      birth: 1958,
      death: null,
    }],
    featured: false,
  },
  {
    title: "There Will Be Blood",
    year: 2007,
    genre: "Drama",
    img: "https://media.timeout.com/images/105455978/750/562/image.jpg",
    directors: [{
      name: "Paul Thomas Anderson",
      birth: 1970,
      death: null,
    }],
    featured: true,
  },
  {
    title: "Singin' in the Rain",
    year: 1952,
    genre: "Comedy",
    img: "https://media.timeout.com/images/105455980/750/562/image.jpg",
    directors: [{
      name: "Stanley Donen",
      birth: 1924,
      death: 2019,
    }],
    featured: true,
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

// Serving Static Files
app.use(express.static("public"));

// Task 2.5

// Return a list of ALL movies to the user
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get("/movies/:title", (req, res) => {
  res.json(topMovies.find((movie) => {
    return movie.title === req.params.title;
  }));
});

// Return data about a genre (decription) by name/title (e.g., "Thriller")
app.get("/movies/:title/:genre", (req, res) => {
  res.json(topMovies.find((movie) => {
    return movie.genre === req.params.genre;
  }));
});

// Return data about a director (name, birth year, death year) by name
app.get("/movies/:title/:director", (req, res) => {
  res.json(topMovies.find((movie) => {
    return movie.director === req.params.director;
  }));
});

// Allow new users to register
app.post("/users", (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = "Missing username in request body.";
    res.status(404).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Allow users to update their user info (username)
app.put("/users/:username", (req, res) => {
  let user = users.find((user) => {
    return user.username === req.params.username;
  });

  if (user) {
    user.username = req.params.username;
    res.status(201).send("Username of " + req.params.username + "was updated");
  } else {
    res.status(404).send("Username of " + req.params.username + "was not found");
  }
});

// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later)
app.post("/movies", (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
    const message = "Missing title in request body";
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    movies.push(newMovie);
    res.status(201).send(newMovie);
  }
});

// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later)
app.delete("/movies/:title", (req, res) => {
  let movie = movies.find((movie) => {
    return movie.title === req.params.title;
  });

  if (movie) {
    movies = movies.filter((obj) => {
      return obj.title !== req.params.title;
    });
    res.status(201).send("Movie " + req.params.title + " was deleted");
  }
});

// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later)
app.delete("users/:email", (req, res) => {
  let user = users.find((user) => {
    return user.email === req.params.email;
  });

  if (user) {
    users = users.filter((obj) => {
      return obj.email !== req.params.email;
    });
    res.status(201).send(" Email " + req.params.email + " has been removed.");
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