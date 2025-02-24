import { Server } from 'socket.io';
let io;

export function init(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:3000',
        },
    });
    return io;
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }

    return io;
}
