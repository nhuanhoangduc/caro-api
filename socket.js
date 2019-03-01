let io = null;
const sockets = {}; // userId: socketInstance



const Socket = {
    init: (app) => {
        const server = require('http').Server(app);
        io = require('socket.io')(server);

        io.on('connection', (socket) => {
            let userId = null;

            socket.on('login', ({ userId }) => {
                userId = userId;
                sockets[userId] = socket;
            });

            socket.on('disconnect', () => {
                if (userId) {
                    sockets[userId].leave();
                    sockets[userId] = null;
                    delete sockets[userId];
                }
            });
        });
    },

    joinRoom: (roomId, userId) => {
        const socket = sockets[userId];
        socket.join(roomId);
    },

    sendRoom: () => {},
};


module.exports = Socket;
