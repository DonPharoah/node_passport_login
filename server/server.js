const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

let players = {};
const pingNamespace = io.of('/ping-namespace');
pingNamespace.on('connection', (socket) => {
  socket.on('pingEvent', () => {
    socket.emit('pongEvent');
  });
});
// const pingTimer = setInterval(() => {
//   console.log('sending ping...');
//   if (Object.keys(players).length > 0) {
//     pingNamespace.emit('ping', 'Ping');
//   }
// }, 3000);

const debugNamespace = io.of('/debug-namespace');
debugNamespace.on('connection', (socket) => {
  console.log('user connected');
  players[socket.id] = {
    playerId: socket.id,
    playerName: `Player${Math.round(Math.random() * 1000) + 1}`
  };
  socket.broadcast.emit('connection', players[socket.id].playerName);

  socket.on('changeName', (name) => {
    players[socket.id].playerName = name;
    socket.emit('nameChangeOK', players[socket.id].playerName);
    // socket.emit('errorStatus', 'Could not change name');
  });

  socket.on('getAllUserNames', () => {
    socket.emit('getAllUserNames', Object.values(players).map((player) => player.playerName));
  });

  socket.on('playerDisconnect', () => {
    socket.disconnect();
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
    debugNamespace.emit('disconnect', players[socket.id].playerName);
    delete players[socket.id];
  });
});

server.listen(3000, () => console.log('Listening on port 3000...'));
