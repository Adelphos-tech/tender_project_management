const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: '*', // Allow all for development. In prod, restrict to frontend URL
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      },
    });

    // Authentication middleware for sockets
    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return next(new Error('Authentication error: Invalid token'));
        }
        
        // Attach user info to socket
        socket.user = decoded; 
        
        // Join a room specific to the user's ID
        socket.join(decoded.id.toString());
        
        // Also join a room based on the user's role for broadcast messages
        if (decoded.role) {
          socket.join(`role_${decoded.role}`);
        }

        next();
      });
    });

    io.on('connection', (socket) => {
      console.log(`Socket connected: User ${socket.user?.id} (${socket.user?.role})`);

      socket.on('disconnect', () => {
        console.log(`Socket disconnected: User ${socket.user?.id}`);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
};
