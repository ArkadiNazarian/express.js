import type { Request, Response } from 'express';
import { Movie } from '../models/moviesModels.js';

export const hightRatingMovies = async (req: Request, res: Response, next: Function) => {
    res.locals.sort = '-rating';
    res.locals.limit = '10';

    next();
}

export const getMovies = async (req: Request, res: Response) => {

    try {

        // we can use req.query to get the query parameters and also if we don't pass any query parameters then it will return all the movies
        // const movies = await Movie.find(req.query);

        // now if we want to handle the <= , >= , > , < and != operators we can use $lt, $lte, $gt, $gte, $ne, $eq

        const { minDuration, sort, fields, page, limit, ...queries } = req.query;

        const effectiveSort = (res.locals.sort ?? sort) as string | undefined;
        const effectiveLimit = (res.locals.limit ?? limit) as string | undefined;

        if (minDuration) {
            queries.duration = { $gte: minDuration };
        }

        let sortOption: string | undefined;

        // this is how we can handle the sort parameter if the parmeter is -duration will be descending order of duration field
        if (effectiveSort) {
            sortOption = (effectiveSort as string).split(',').join(' ');
        }

        let fieldsOption: string = '';

        // this is how we can handle to return selected fields and like the sort if we use "-" before the field name 
        // it will exculde the field from the response like -__v
        if (fields) {
            fieldsOption = (fields as string).split(',').join(' ');
        }

        if (page && effectiveLimit) {

            const movies = await Movie.countDocuments(queries);

            if ((Number(page) - 1) * Number(effectiveLimit) > movies) {
                throw new Error('Page not found');
            }
        }

        // for pagination we can use skip and limit

        const movies = await Movie.find(queries).sort(sortOption).select(fieldsOption).skip((Number(page) - 1) * Number(effectiveLimit)).limit(Number(effectiveLimit));

        res.status(200).json({
            success: true,
            length: movies.length,
            data: movies
        });

    } catch (e) {

        const error = e as Error;

        res.status(500).json({
            success: false,
            error: error.message
        });
    }

}


export const addMovie = async (req: Request, res: Response) => {
    try {
        // we can use also insert() but it isn't the mongoose standard method
        const movie = await Movie.create(req.body);

        res.status(201).json({
            success: true,
            data: movie
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: e
        });
    }


}

export const getMovie = async (req: Request, res: Response) => {

    try {
        const movie = await Movie.findById(req.params.id);

        res.status(200).json({
            success: true,
            data: movie
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: e
        });
    }
}

export const updateMovie = async (req: Request, res: Response) => {
    try {

        // when we use {new: true} it will return the updated document
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            success: true,
            data: movie
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: e
        });
    }


}

export const deleteMovie = async (req: Request, res: Response) => {

    try {

        const movie = await Movie.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: null
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            error: e
        });
    }

}

export const getMoviesStats = async (req: Request, res: Response) => {
    try {
        // MongoDB Aggregation Pipeline: processes documents in stages,
        // where the output of one stage becomes the input of the next.
        //   $match  → filter movies with duration >= 10
        //   $group  → group them by publish_year and compute
        //             max/min/avg rating, total duration, and movie count per year
        const movies = await Movie.aggregate([
            {
                $match: { duration: { $gte: 10 } }
            },
            {
                $group: {
                    _id: "$publish_year",
                    maxRating: { $max: "$rating" },
                    minRating: { $min: "$rating" },
                    avgRating: { $avg: "$rating" },
                    totalDuration: { $sum: "$duration" },
                    totlaMovies: { $sum: 1 }
                }
            }
        ])

        res.status(200).json({
            success: true,
            data: movies
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            error: e
        });
    }
}

export const getMovieGenres = async (req: Request, res: Response) => {
    try {

        const params = req.params.genre as string;

        const movies = await Movie.aggregate([
            {
                $unwind: "$genre"
            },
            {
                $match: { genre: params }
            },
            {
                $group: {
                    _id: "$genre",
                    movies: { $push: "$name" },
                    totalCount: { $sum: 1 }
                }
            },
            {
                $sort: { totalCount: -1 }
            },
            {
                $addFields: {
                    genre: "$_id"
                }
            },
            {
                $project: { _id: 0 }
            },
            
        ])

        res.status(200).json({
            success: true,
            data: movies
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            error: e
        });
    }
}