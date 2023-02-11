const PORT = 8080;
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = app.listen(PORT);
const io = socketio(server);

app.use(express.static('static'));

io.on('connection', (socket) => {
  console.log(`${socket.id} has connected`);
  
  socket.on('disconnect', () => {
    console.log(`${socket.id} has disconnected`)
  });
});

/* io methods

  io.on('connection, socket => {}); // when users connected to the root directory '/'
  io.emit(handler, data); // emits to all rooms within the root ('/') namespace
  const namespace = io.of(directory);

*/

/* namespace methods

  namespace.on('connection', socket => {}); // any rooms joined will be segmented within the namespace
  namespace.emit(handler, data); // emits to all rooms within the namespace

*/

/* socket properties and methods
  socket.id // unique id of the socket
  socket.rooms // array of all rooms that the user is currently in within the namespace

  socket.on('disconnect', () => {}); // called when that socket disconnects

  socket.emit(handler, data); // sends data associated with a handler
  socket.broadcast.emit(handler, data)
  socket.on(handler, data => {}); // gets the data sent to that handler and uses as parameters

  socket.join(roomId);
  socket.to(roomId).emit(handler, data);
  socket.broadcast.to(roomId).emit(handler, data);
  socket.to(socket.id).emit(handler, data); send data to the specific user
*/