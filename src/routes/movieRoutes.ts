
import express from 'express';
import { addMovie, deleteMovie, getMovie, getMovies, rejectQueryParams, updateMovie } from '../controllers/mongodbMoviesControllers.js';
// import { getMovies, addMovie, getMovie, updateMovie, deleteMovie, checkId, rejectQueryParams } from '../controllers/index.js';

export const movieRouter = express.Router()

// can here add a middleware to check if it has id in the url instead of checking in the handlers one by one each time

// movieRouter.param('id', checkId);


//  we can also chain the middlewares like this
// get(rejectQueryParams, getMovies) we can use as many middlewares as we want in the order that we defined
// or app.use(rejectQueryParams, getMovies)
// movieRouter.route('/').get(rejectQueryParams, getMovies).post(addMovie);
// movieRouter.route('/:id').get(getMovie).patch(updateMovie).put(updateMovie).delete(deleteMovie);

movieRouter.route('/').get(rejectQueryParams, getMovies).post(addMovie);
movieRouter.route('/:id').get(getMovie).patch(updateMovie).put(updateMovie).delete(deleteMovie);
