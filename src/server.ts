import { server } from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';



// we can use dotenv to load the environment variables then we can use in the project
dotenv.config();

// connect to the database
mongoose.connect(process.env.MONGODB_URI!).then((connection) => {
  console.log('Connected to the database');
})


const app = server.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
});

// process is a global object in Node.js (always available, no require needed). It represents the current Node.js process and is an instance of EventEmitter.
// process.on(event, listener) lets you listen to lifecycle/system events emitted by the Node runtime itself — not your app.

// to test this we can remove the catch block of the mongoose.connect() method and then we can see the error in the console
process.on('unhandledRejection', (err) => {
  console.log("unhandledRejection error", err)

  // if there is an error in our application, we should shudown the server
  console.log('Shutting down the server');
  app.close(() => {
    process.exit(1)
  });

})