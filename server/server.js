const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
  console.log('user connected');
  socket.broadcast.emit('debugStatus', 'user connected');

  setInterval(() => {
    console.log('sending ping...');
    socket.broadcast.emit('debugStatus', 'Ping');
  }, 5000);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => console.log('Listening on port 3000...'));
