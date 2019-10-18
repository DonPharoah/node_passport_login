const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

let numUsers = 0;
let players = {};

let debugNamespace = io.of('/debug-namespace');
debugNamespace.on('connection', (socket) => {
  console.log('user connected');
  players[socket.id] = {
    playerId: socket.id,
    playerName: ''
  };
  socket.broadcast.emit('connection', players[socket.id].playerId);

  socket.on('changeName', (name) => {
    players[socket.id].playerName = name;
    socket.emit('nameChangeOK', players[socket.id].playerName);
    // socket.emit('errorStatus', 'Could not change name');
  });

  socket.on('getAllUserNames', () => {
    socket.emit('getAllUserNames', players);
  });
  setInterval(() => {
    console.log('sending ping...');
    socket.broadcast.emit('status', 'Ping');
  }, 5000);

  socket.on('disconnect', () => {
    console.log('user disconnected');
    debugNamespace.emit('disconnect', players[socket.id].playerName);
    delete players[socket.id];
  });
});

server.listen(3000, () => console.log('Listening on port 3000...'));
