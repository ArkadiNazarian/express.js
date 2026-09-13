import type { Request, Response } from 'express';
import { Movie } from '../models/moviesModels.js';

// export const rejectQueryParams = (req: Request, res: Response, next: any) => {
//     if (Object.keys(req.query).length > 0) {
//         return res.status(400).json({
//             error: 'Query parameters are not allowed on this endpoint'
//         });
//     }
//     next();
// };

export const getMovies = async (req: Request, res: Response) => {

    try {

        // we can use req.query to get the query parameters and also if we don't pass any query parameters then it will return all the movies
        // const movies = await Movie.find(req.query);

        // now if we want to handle the <= , >= , > , < and != operators we can use $lt, $lte, $gt, $gte, $ne

        const { minDuration, sort, fields, page, limit, ...queries } = req.query;

        if (minDuration) {
            queries.duration = { $gte: minDuration };
        }

        let sortOption: string | undefined;

        // this is how we can handle the sort parameter if the parmeter is -duration will be descending order of duration field
        if (sort) {
            sortOption = (sort as string).split(',').join(' ');
        }

        let fieldsOption: string = '';

        // this is how we can handle to return selected fields and like the sort if we use "-" before the field name 
        // it will exculde the field from the response like -__v
        if (fields) {
            fieldsOption = (fields as string).split(',').join(' ');
        }

        // for pagination we can use skip and limit

        const movies = await Movie.find(queries).sort(sortOption).select(fieldsOption).skip((Number(page) - 1) * Number(limit)).limit(Number(limit));

        res.status(200).json({
            success: true,
            length: movies.length,
            data: movies
        });

    } catch (e) {
        res.status(500).json({
            success: false,
            error: e
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