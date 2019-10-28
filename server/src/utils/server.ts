import express = require('express');
import * as path from 'path';
import * as http from 'http';
import compression = require('compression');
import * as socketIo from 'socket.io';
import ServerScene from '../scenes/serverScene';

let io: socketIo.Server;
let app: express.Application;
let server: http.Server;

function startServer() {
  app = express();
  app.use(compression());
  server = http.createServer(app);
  io = socketIo.listen(server);
  server.listen(4000, () => {
    console.log(`Listening on port 4000...`);
    new ServerScene();
  });
}

export const getServer = (): http.Server | null => {
  return server ? server : null;
};
export const getIo = (): socketIo.Server => {
  return io ? io : null;
};

startServer();
