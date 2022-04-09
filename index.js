const express = require("express"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  uuid = require("uuid");

const {
  rest
} = require('lodash');

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan("common"));

// Welcome message
app.get("/", (req, res) => {
  res.send("Welcome to Movie App!");
});

// Return a list of ALL movies to the user
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get("/movies/:title", (req, res) => {
  Movies.findOne({
      Title: req.params.Title
    })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Return data about a genre (decription) by name/title (e.g., "Thriller")
app.get("/movies/genre/:genreName", (req, res) => {
  const {
    genreName
  } = req.params;
  const genre = movies.find(movie => movie.genre === genreName).genre;

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
  const director = movies.find(movie => movie.director.name === directorName).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("Director not found");
  }
});

// Additional self-task: return a list of ALL users
app.get("/users", (req, res) => {
  Users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Allow new users to register
app.post('/users', (req, res) => {
  Users.findOne({
      Username: req.body.username
    })
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
          .then((user) => {
            res.status(201).json(user)
          })
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

// Get a user by username 
app.get("/users/:Username", (req, res) => {
  Users.findOne({
      Username: req.params.Username
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});


// Allow users to update their user info (username)
// app.put("/users/:id", (req, res) => {
//   const {
//     id
//   } = req.params;
//   const updatedUser = req.body;

//   let user = users.find(user => user.id == id);

//   if (user) {
//     user.name = updatedUser.name;
//     res.status(200).json(user)
//   } else {
//     const message = "User not found.";
//     res.status(400).send(message);
//   }
// });

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    }, {
      new: true
    },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

// Allow users to add a movie to their list of favorites 
// app.post("/users/:id/:movieTitle", (req, res) => {
//   const {
//     id,
//     movieTitle
//   } = req.params;

//   let user = users.find(user => user.id == id);

//   if (user) {
//     user.favMovies.push(movieTitle);
//     res.status(200).json(`${movieTitle} has been added to user ${id}'s array`);
//   } else {
//     const message = "Fav Movies not found";
//     res.status(400).send(message);
//   }
// });

app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $push: {
        FavoriteMovies: req.params.MovieID
      }
    }, {
      new: true
    },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
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

// Allow existing users to deregister or delete a user by username
// app.delete("/users/:id", (req, res) => {
//   const {
//     id
//   } = req.params;

//   let user = users.find(user => user.id == id);

//   if (user) {
//     users = users.filter(user => user.id != id);
//     res.status(200).json(`User ${id} has been deleted`);
//   } else {
//     const message = "User ID not found";
//     res.status(400).send(message);
//   }
// });

app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({
      Username: req.params.Username
    })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Access documentation.html using express. static
app.use('/documentation', express.static("public"));

//Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("This app is listening on port 8080.");
});