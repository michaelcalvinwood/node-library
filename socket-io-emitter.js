const socketioEmitter = require('socket.io-emitter');
require('dotenv').config();

var io = socketioEmitter({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT});

const room = 'theRoom';
const event = 'theEvent';
const message = 'theMessage';

io.to(room).emit(event, message);
setTimeout(() => {process.exit(0)}, 1000);
