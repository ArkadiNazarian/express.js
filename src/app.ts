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

  fs.writeFile('./data/movies.json', JSON.stringify(movies)).then(() => {

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

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});