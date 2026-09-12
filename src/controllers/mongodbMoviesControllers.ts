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
        const movies = await Movie.find(req.query);

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

    try{

        const movie = await Movie.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: null
        });

    }catch(e){
        res.status(500).json({
            success: false,
            error: e
        });
    }

}