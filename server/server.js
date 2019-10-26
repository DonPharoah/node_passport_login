const express = require('express');
const path = require('path');
const http = require('http');
const compression = require('compression');
const DataUri = require('datauri');
const jsdom = require('jsdom');
const socketIo = require('socket.io');
const { JSDOM } = jsdom;
const app = express();
const datauri = new DataUri();
const server = http.createServer(app);
const io = socketIo.listen(server);

app.use(compression());

function setupAuthoritativePhaser() {
  JSDOM.fromFile(path.resolve(__dirname, 'dist/index.html'), {
    // To run scripts in the html file
    runScripts: 'dangerously',
    // Also load supported external resources
    resources: 'usable',
    // So requestAnimationFrame events can fire
    pretendToBeVisual: true
  })
    .then((dom) => {
      // override two functions: createObjectURL and revokeObjectURL
      dom.window.URL.createObjectURL = (blob) => {
        if (blob) {
          return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
        }
      };
      dom.window.URL.revokeObjectURL = (objectURL) => {};
      dom.window.gameLoaded = () => {
        server.listen(4000, () => {
          console.log(`Listening on 4000`);
        });
      };
      dom.window.io = io;
    })
    .catch((err) => {
      console.log(err.message);
    });
}
setupAuthoritativePhaser();
