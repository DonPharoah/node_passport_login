import express = require('express');
import * as path from 'path';
import * as http from 'http';
import compression = require('compression');
import * as socketIo from 'socket.io';
import ServerScene from './scenes/serverScene';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 4000;

let io: socketIo.Server;
let app: express.Application;
let server: http.Server;

function startServer() {
  app = express();
  app.use(compression());
  server = http.createServer(app);
  // io = socketIo.listen(server);
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
