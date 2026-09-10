import { server } from './app.js';
import dotenv from 'dotenv';

// we can use dotenv to load the environment variables then we can use in the project
dotenv.config();

server.listen(process.env.PORT, () => {
  console.log('Server is running on port 3000');
});