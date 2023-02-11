const express = require('express');
const socketio = require('socket.io');

var app = express();
var server = app.listen(8080);
var io = socketio(server);


//setup express to use middleware
app.get('/folder1', (req, res) => {});
app.get('/folder2', (req, res) => {});

const folder1NameSpace = io.of('/folder1');
const folder2NameSpace = io.of('/folder2');

const folder1NameSpaceHandler = socket => {
    // write here what you want to have happen when user connects to folder1
}
const folder2NameSpaceHandler = socket => {
    // write here what you want to have happen when user connects to folder1
}

/*
    Client side: 
        const socket = io('/folder1', {transports: ['websocket'], upgrade: false});
        const socket = io('/folder2', {transports: ['websocket'], upgrade: false});
    For each page respectively
*/

folder1NameSpace.on('connection', folder1NameSpaceHandler);
folder2NameSpace.on('connection', folder2NameSpaceHandler);

io.on('connection', (socket) => {
  
});
