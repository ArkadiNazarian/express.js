import { server } from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';



// we can use dotenv to load the environment variables then we can use in the project
dotenv.config();

// connect to the database
mongoose.connect(process.env.MONGODB_URI!).then((connection) => {
  console.log('Connected to the database');
}).catch((error) => {
  console.log('Error connecting to the database');
});


server.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
});