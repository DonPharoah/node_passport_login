import express = require('express');
import authRoutes from './express-routes/authRoutes';
import * as http from 'http';
import compression = require('compression');
import * as socketIo from 'socket.io';
import ServerScene from './scenes/serverScene';
import * as mongoose from 'mongoose';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 4000;

let io: socketIo.Server;
let app: express.Application;
let server: http.Server;

function startServer() {
  app = express();

  // set up middleware
  // app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  app.use('/auth', authRoutes);

  // error handling
  app.use((error, req, res, next) => {
    console.log(error.message);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

  server = http.createServer(app);
  io = socketIo(server);

  // connect to database
  mongoose
    .connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => {
      console.log('Connected to database.');

      server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
        new ServerScene();
      });
    });
}

export const getServer = (): http.Server | null => {
  return server ? server : null;
};
export const getIo = (): socketIo.Server => {
  return io ? io : null;
};

startServer();
