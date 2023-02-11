
// Leave every room except the self-contained personal room

exports.leaveAllRooms = socket => {
    Object.keys(socket.rooms)
    .filter(room => room !== socket.id)
    .forEach(room => socket.leave(room));
}

exports.namespaceHandler = (namespace) => {
    return (socket) => {
  
      // if you are going to do the same thing for many namespaces, use a handler such as this
      // usage: io.on('connection, namespaceHandler({namespace}));
      
      socket.emit('event', 'You joined ' + namespace.name);
      //just resend it
      socket.on('event', (data) => {
        socket.broadcast.emit('event', data);
      });
    };
  }

