import express from 'express';
import fs from 'fs/promises';
import url from 'url';

const server = express();

const readFile = fs.readFile('./data/movie.json', 'utf8');
const movies = JSON.parse(await readFile);


// this is get request to rooth path
server.get('/', (req, res) => {


  // res.send is used for sending plain text
  // res.send('Hello World');

  // this is to send also the status code
  // res.status(200).send('Hello World');

  // this is to send json
  res.status(200).json({ message: 'Hello World' });
});

// this is middleware to parse the body
server.use(express.json());

server.post('/api/v1/movies', (req, res) => {

  // req.body is undefiend we should use middleware (line25) to get the body
  console.log(req.body);

  const newMovieId = movies.length + 1;

  const addedMovie = {
    id: newMovieId,
    name: req.body.name,
    publish_year: req.body.publish_year,
    duration: req.body.duration
  }

  movies.push(addedMovie);

  fs.writeFile('./data/movie.json', JSON.stringify(movies)).then(() => {

    res.status(201).json({ message: 'Movie added successfully' });

  }).catch((err) => {
    res.status(500).json({ message: 'Error adding movie' });
  });

})



server.get('/api/v1/movies', (req, res) => {

  res.status(200).json({
    data: {
      movies: movies
    }
  });

})

// get request to specific movie path with id query parameter

server.get("/api/v1/movie", (req, res) => {

  const id = url.parse(req.url, true).query.id;

  res.status(200).json({
    data: {
      movie: movies.find((movie: any) => movie.id === Number(id))
    }
  });

})

// get request to specific movie path with route parameter
// if we want the route parameter to be option we can use this "/api/v1/movie/:id?"

server.get("/api/v1/movie/:id", (req, res) => {

  const id = req.params.id;

  const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

  if (!selectedMovie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }

  res.status(200).json({
    data: {
      movie: selectedMovie
    }
  });

})

// to patch a data

server.patch("/api/v1/movie/:id", (req, res) => {
  const id = req.params.id;
  const updatedMovie = req.body;

  const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

  if (!selectedMovie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }

  const updatedMovieData = {
    ...selectedMovie,
    ...updatedMovie
  }

  const index = movies.findIndex((movie: any) => movie.id === Number(id));
  movies[index] = updatedMovieData;


  fs.writeFile('./data/movie.json', JSON.stringify(movies)).then(() => {
    res.status(200).json({
      data: {
        movie: updatedMovieData
      }
    });
  }).catch((err) => {
    res.status(500).json({ message: 'Error updating movie' });
  });
});

// to put a data
server.put("/api/v1/movie/:id", (req, res) => {
  const id = req.params.id;
  const updatedMovie = req.body;

  const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

  if (!selectedMovie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }

  const updatedMovieData = {
    id: selectedMovie.id,
    ...updatedMovie
  }

  const index = movies.findIndex((movie: any) => movie.id === Number(id));
  movies[index] = updatedMovieData;

  fs.writeFile('./data/movie.json', JSON.stringify(movies)).then(() => {
    res.status(200).json({
      data: {
        movie: updatedMovieData
      }
    });
  }).catch((err) => {
    res.status(500).json({ message: 'Error updating movie' });
  });
});

// to delete a data

server.delete("/api/v1/movie/:id", (req, res) => {

  const id = req.params.id;

  const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

  if (!selectedMovie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }

  const filteredMovies = movies.filter((movie: any) => movie.id !== Number(id));

  fs.writeFile('./data/movie.json', JSON.stringify(filteredMovies)).then(() => {
    res.status(200).json({
      data: null
    });
  }).catch((err) => {
    res.status(500).json({ message: 'Error deleting movie' });
  });

})

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});