import 'dotenv/config';
import { app } from './app.js';
import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
  console.log("uncaughtException error", err)

  // if there is an error in our application, we should shudown the server
  console.log('Shutting down the server');
  process.exit(1)
})

// we can use dotenv to load the environment variables then we can use in the project
// dotenv.config();
// or import 'dotenv/config'

// connect to the database
mongoose.connect(process.env.MONGODB_URI!).then((connection) => {
  console.log('Connected to the database');
}).catch((err) => {
  console.log('Error connecting to the database', err);
});


const server = app.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
});

// process is a global object in Node.js (always available, no require needed). It represents the current Node.js process and is an instance of EventEmitter.
// process.on(event, listener) lets you listen to lifecycle/system events emitted by the Node runtime itself — not your app.

// to test this we can remove the catch block of the mongoose.connect() method and then we can see the error in the console
process.on('unhandledRejection', (err) => {
  console.log("unhandledRejection error", err)

  // if there is an error in our application, we should shudown the server
  console.log('Shutting down the server');
  server.close(() => {
    process.exit(1)
  });

})