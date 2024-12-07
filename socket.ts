import { Server } from 'http';
import { Server as SocketServer } from 'socket.io';

let io: SocketServer;

export default {
    init: (httpServer: Server) => {
        io = new SocketServer(httpServer, {
            cors: {
                origin: '*', // Replace '*' with your frontend's URL for better security
                methods: ['GET', 'POST']
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io no initialized");
        }
        return io;
    }
}