import express, { type NextFunction, type Request, type Response } from 'express';
import fs from 'fs/promises';
import url from 'url';
import { movieRouter } from './routes/movieRoutes.js';
import morgan from 'morgan';
import { globalErrorHandler } from './controllers/errorControllers.js';
import { authRouter } from './routes/authRouters.js';
import { userRouter } from './routes/userRouter.js';

export const app = express();

// this is middleware to parse the body
app.use(express.json());

// we can have custom middleware like this :
// each middleware will be called one by one in order with each request
// for example if we have two middlewares like this
// app.use(middleware1);
// app.use(middleware2);
// then middleware1 will be called first and then middleware2
// if we want to call middleware2 first then we can use this
// app.use(middleware2, middleware1);
// each middleware has 3 parameters
// req, res, next
// route handlers also are middlewares but for specific route
// if the middleware write after a route handler then it will not be called for that route

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log('Request started');
  next();
}

// here if we write the path then it will be relative to the root path
// app.use("/api/v1/users", logger);
// here when we request to /api/v1/users then it will call the logger middleware otherwise it will call the next middleware
// but if we don't write the path then it will be relative to all the routes
app.use(logger);
// morgan package is used to show the request time fullfill and the bytes that contains
app.use(morgan('dev'))

// this is to serve the static files
app.use(express.static('./public'));

app.use((req: any, res, next) => {
  req.createdAt = new Date();
  next();
});

// here this router is relatived to this file path
app.use('/api/v1/movies', movieRouter);

app.use('/api/v1/auth', authRouter);

app.use('/api/v1/users', userRouter);
// this is the default route, means if there is no route defined then it will be relative to this path
// you know that it should be the last route defined

app.all('/*splat', (req, res, next) => {
  // res.status(404).json({
  //   message: `No route found for ${req.method} ${req.url}`
  // });


  // to use the error middleware we can use this
  const error: any = new Error(`No route found for ${req.method} ${req.url}`);
  error.statusCode = 404;
  error.success = false;

  // if we pass any arguement to next() function it calls the error middleware
  next(error);

});

// here we can make a middleware to handle the errors , for example now for the default route we are returning 404 error
app.use(globalErrorHandler);

// app.get("/api/v1/middlewareTestToPass", (req: any, res) => {
//   res.status(200).json({
//     data: {
//       message: 'Middleware is working',
//       createdAt: req.createdAt
//     }
//   });
// });

const readFile = fs.readFile('./data/movie.json', 'utf8');
const movies = JSON.parse(await readFile);


// // this is get request to rooth path
// app.get('/', (req, res) => {


//   // res.send is used for sending plain text
//   // res.send('Hello World');

//   // this is to send also the status code
//   // res.status(200).send('Hello World');

//   // this is to send json
//   res.status(200).json({ message: 'Hello World' });
// });



// app.post('/api/v1/movies', (req, res) => {

//   // req.body is undefiend we should use middleware (line8) to get the body
//   console.log(req.body);

//   const newMovieId = movies.length + 1;

//   const addedMovie = {
//     id: newMovieId,
//     name: req.body.name,
//     publish_year: req.body.publish_year,
//     duration: req.body.duration
//   }

//   movies.push(addedMovie);

//   fs.writeFile('./data/movie.json', JSON.stringify(movies)).then(() => {

//     res.status(201).json({ message: 'Movie added successfully' });

//   }).catch((err) => {
//     res.status(500).json({ message: 'Error adding movie' });
//   });

// })



// app.get('/api/v1/movies', (req, res) => {

//   res.status(200).json({
//     data: {
//       movies: movies
//     }
//   });

// })

// // get request to specific movie path with id query parameter

// app.get("/api/v1/movies", (req, res) => {

//   const id = url.parse(req.url, true).query.id;

//   res.status(200).json({
//     data: {
//       movie: movies.find((movie: any) => movie.id === Number(id))
//     }
//   });

// })

// // get request to specific movie path with route parameter
// // if we want the route parameter to be option we can use this "/api/v1/movie/:id?"

// app.get("/api/v1/movies/:id", (req, res) => {

//   const id = req.params.id;

//   const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

//   if (!selectedMovie) {
//     res.status(404).json({ message: 'Movie not found' });
//     return;
//   }

//   res.status(200).json({
//     data: {
//       movie: selectedMovie
//     }
//   });

// })

// // to patch a data

// app.patch("/api/v1/movies/:id", (req, res) => {
//   const id = req.params.id;
//   const updatedMovie = req.body;

//   const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

//   if (!selectedMovie) {
//     res.status(404).json({ message: 'Movie not found' });
//     return;
//   }

//   const updatedMovieData = {
//     ...selectedMovie,
//     ...updatedMovie
//   }

//   const index = movies.findIndex((movie: any) => movie.id === Number(id));
//   movies[index] = updatedMovieData;


//   fs.writeFile('./data/movie.json', JSON.stringify(movies)).then(() => {
//     res.status(200).json({
//       data: {
//         movie: updatedMovieData
//       }
//     });
//   }).catch((err) => {
//     res.status(500).json({ message: 'Error updating movie' });
//   });
// });

// // to put a data
// app.put("/api/v1/movies/:id", (req, res) => {
//   const id = req.params.id;
//   const updatedMovie = req.body;

//   const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

//   if (!selectedMovie) {
//     res.status(404).json({ message: 'Movie not found' });
//     return;
//   }

//   const updatedMovieData = {
//     id: selectedMovie.id,
//     ...updatedMovie
//   }

//   const index = movies.findIndex((movie: any) => movie.id === Number(id));
//   movies[index] = updatedMovieData;

//   fs.writeFile('./data/movie.json', JSON.stringify(movies)).then(() => {
//     res.status(200).json({
//       data: {
//         movie: updatedMovieData
//       }
//     });
//   }).catch((err) => {
//     res.status(500).json({ message: 'Error updating movie' });
//   });
// });

// // to delete a data

// app.delete("/api/v1/movie/:id", (req, res) => {

//   const id = req.params.id;

//   const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

//   if (!selectedMovie) {
//     res.status(404).json({ message: 'Movie not found' });
//     return;
//   }

//   const filteredMovies = movies.filter((movie: any) => movie.id !== Number(id));

//   fs.writeFile('./data/movie.json', JSON.stringify(filteredMovies)).then(() => {
//     res.status(200).json({
//       data: null
//     });
//   }).catch((err) => {
//     res.status(500).json({ message: 'Error deleting movie' });
//   });

// })

// *********************************************************************************************

// also we can chaining the route handlers  , if we seperate each callback to a function
// app.route('/api/v1/movies').get(getMovies).post(addMovie);
// app.route('/api/v1/movies/:id').get(getMovie).patch(updateMovie).put(updateMovie).delete(deleteMovie);
// this is the same as above


// const getMovies = (req: Request, res: Response) => {
//   res.status(200).json({
//     data: {
//       movies: movies
//     }
//   });
// }

// const addMovie = (req: Request, res: Response) => {
//   const newMovieId = movies.length + 1;

//   const addedMovie = {
//     id: newMovieId,
//     name: req.body.name,
//     publish_year: req.body.publish_year,
//     duration: req.body.duration
//   }

//   movies.push(addedMovie);

//   fs.writeFile('./data/movie.json', JSON.stringify(movies)).then(() => {
//     res.status(201).json({ message: 'Movie added successfully' });
//   }).catch((err) => {
//     res.status(500).json({ message: 'Error adding movie' });
//   });
// }

// const getMovie = (req: Request, res: Response) => {
//   const id = req.params.id;

//   res.status(200).json({
//     data: {
//       movie: movies.find((movie: any) => movie.id === Number(id))
//     }
//   });
// }

// const updateMovie = (req: Request, res: Response) => {
//   const id = req.params.id;
//   const updatedMovie = req.body;

//   const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

//   if (!selectedMovie) {
//     res.status(404).json({ message: 'Movie not found' });
//     return;
//   }

//   const updatedMovieData = {
//     ...selectedMovie,
//     ...updatedMovie
//   }

//   const index = movies.findIndex((movie: any) => movie.id === Number(id));
//   movies[index] = updatedMovieData;

//   fs.writeFile('./data/movie.json', JSON.stringify(movies)).then(() => {
//     res.status(200).json({
//       data: {
//         movie: updatedMovieData
//       }
//     });
//   }).catch((err) => {
//     res.status(500).json({ message: 'Error updating movie' });
//   });
// }

// const deleteMovie = (req: Request, res: Response) => {
//   const id = req.params.id;

//   const selectedMovie = movies.find((movie: any) => movie.id === Number(id));

//   if (!selectedMovie) {
//     res.status(404).json({ message: 'Movie not found' });
//     return;
//   }

//   const filteredMovies = movies.filter((movie: any) => movie.id !== Number(id));

//   fs.writeFile('./data/movie.json', JSON.stringify(filteredMovies)).then(() => {
//     res.status(200).json({
//       data: null
//     });
//   }).catch((err) => {
//     res.status(500).json({ message: 'Error deleting movie' });
//   });
// }

// app.route('/api/v1/movies').get(getMovies).post(addMovie);
// app.route('/api/v1/movies/:id').get(getMovie).patch(updateMovie).put(updateMovie).delete(deleteMovie);

// *********************************************************

// now we want to seperate the route handlers to a different file
// for this we can make a route folder for example and put all the route handlers in that folder for specific subject like movies
// then import it in the app.ts file and use it in the app.use
// because it's a middleware we can use it like this
// also we can seperate the handlers in controllers folder (MVC) architecture
// also we can move the app.listen to a different file called app.ts

// app.listen(3000, () => {
//   console.log('app is running on port 3000');
// });
