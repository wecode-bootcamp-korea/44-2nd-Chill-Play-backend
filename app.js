require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
<<<<<<< HEAD
const router = require('./routes');
=======
const router = require('./routes')
>>>>>>> bd6813a ([ADD]: feature/search)

const { globalErrorHandler } = require('./utils/error');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('combined'));
<<<<<<< HEAD
  app.use(router);
  app.use(globalErrorHandler);
=======
  app.use(router)
>>>>>>> bd6813a ([ADD]: feature/search)

  app.get('/ping', function (req, res, next) {
    res.status(200).json({ message: 'pong' });
  });

  app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    next(err);
  });

  return app;
};

module.exports = { createApp };
