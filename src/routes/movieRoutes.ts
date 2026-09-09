
import express from 'express';
import { getMovies, addMovie, getMovie, updateMovie, deleteMovie, checkId, rejectQueryParams } from '../controllers/index.js';

export const router = express.Router()

// can here add a middleware to check if it has id in the url instead of checking in the handlers one by one each time

router.param('id', checkId);


//  we can also chain the middlewares like this
// get(rejectQueryParams, getMovies) we can use as many middlewares as we want in the order that we defined
// or app.use(rejectQueryParams, getMovies)
router.route('/').get(rejectQueryParams, getMovies).post(addMovie);
router.route('/:id').get(getMovie).patch(updateMovie).put(updateMovie).delete(deleteMovie);
