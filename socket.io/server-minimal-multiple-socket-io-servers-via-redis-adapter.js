const express = require('express');
const socketio = require('socket.io');
const process = require('process');
const socketioRedis = require('socket.io-redis');
const require('dotenv').config();

var app = express();
var server = app.listen(process.argv[2]);
var io = socketio(server);

app.use(express.static('static'));

io.adapter(socketioRedis({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT}));
io.on('connection', (socket) => {
  // Whatever is done here is shared among servers.
});
