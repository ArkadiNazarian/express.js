import express from 'express';

const server = express();


// this is get request to rooth path
server.get('/', (req, res) => {


  // res.send is used for sending plain text
  // res.send('Hello World');

  // this is to send also the status code
  // res.status(200).send('Hello World');

  // this is to send json
  res.status(200).json({ message: 'Hello World' });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});