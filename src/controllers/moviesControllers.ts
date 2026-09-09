import type { Request, Response } from 'express';
import fs from 'fs/promises';

const readFile = fs.readFile('./data/movie.json', 'utf8');
const movies = JSON.parse(await readFile);

export const checkId = (req: Request, res: Response, next: any, value: string) => {

  const selectedMovie = movies.find((movie: any) => movie.id === Number(value));

  if (!selectedMovie) {
    res.status(404).json({ message: 'Movie not found' });
    return;
  }

  next();
}

export const rejectQueryParams = (req: Request, res: Response, next: any) => {
  if (Object.keys(req.query).length > 0) {
    return res.status(400).json({
      error: 'Query parameters are not allowed on this endpoint'
    });
  }
  next();
};

export const getMovies = (req: Request, res: Response) => {
  res.status(200).json({
    data: {
      movies: movies
    }
  });
}

export const addMovie = (req: Request, res: Response) => {
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
}

export const getMovie = (req: Request, res: Response) => {
  const id = req.params.id;

  res.status(200).json({
    data: {
      movie: movies.find((movie: any) => movie.id === Number(id))
    }
  });
}

export const updateMovie = (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedMovie = req.body;

  const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

  // if (!selectedMovie) {
  //   res.status(404).json({ message: 'Movie not found' });
  //   return;
  // }

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
}

export const deleteMovie = (req: Request, res: Response) => {
  const id = req.params.id;

  // const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

  // if (!selectedMovie) {
  //   res.status(404).json({ message: 'Movie not found' });
  //   return;
  // }

  const filteredMovies = movies.filter((movie: any) => movie.id !== Number(id));

  fs.writeFile('./data/movie.json', JSON.stringify(filteredMovies)).then(() => {
    res.status(200).json({
      data: null
    });
  }).catch((err) => {
    res.status(500).json({ message: 'Error deleting movie' });
  });
}