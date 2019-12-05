const express = require('express');
const helmet = require('helmet');
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');
const server = express();

server.use(express.json());

//----------Custom Middlewear----------//

//logs to the console the request method, request url, and a timestamp about each request
function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url}`
  )
  next();
}

//----------Implement Custom Middlewear----------//
server.use(helmet());
server.use(logger);
server.use('/api/posts', postRouter);
server.use('/api/users', userRouter);

//----------Sanity Check----------//
server.get('/', (req, res) => {
  res.send('Project: node-api3-project is up and running!');
});

module.exports = server;
