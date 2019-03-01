let io = null;
const sockets = {}; // userId: socketInstance



const Socket = {
    init: (server) => {
        io = require('socket.io')(server);

        io.on('connection', (socket) => {
            console.log('connect')
            let userId = null;

            socket.on('login', ({ userId }) => {
                console.log('login', userId);
                userId = userId;
                sockets[userId] = socket;
            });

            socket.on('disconnect', () => {
                console.log('disconnect');
                if (userId) {
                    sockets[userId].leave();
                    sockets[userId] = null;
                    delete sockets[userId];
                }
            });

            socket.on('stroke', (data) => {
                const { roomId, row, column } = data;
                socket.broadcast.to(roomId).emit('onStroke', {
                    row: row,
                    column: column,
                });
            });
        });
    },

    joinRoom: (roomId, userId) => {
        const socket = sockets[userId];
        socket.join(roomId);
    },

    sendRoom: (roomId, senderId, event, data) => {
        const socket = sockets[senderId];
        socket.broadcast.to(roomId).emit(event, data);
    },

    broadcastRoom: (roomId, event, data) => {
        io.to(roomId).emit(event, data);
    },
};


module.exports = Socket;
