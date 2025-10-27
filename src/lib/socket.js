const { Server } = require('socket.io');

let io = null;

function initializeSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-room', (userEmail) => {
        socket.join(userEmail);
        console.log('User joined room:', userEmail);
      });

      socket.on('send-message', async (data) => {
        console.log('Socket received:', data);
        
        // The data object contains: senderEmail, receiverEmail, message
        const { senderEmail, receiverEmail, message } = data;
        
        console.log(`Socket: Message from ${senderEmail} to ${receiverEmail}`);
        
        // Broadcast to receiver
        io.to(receiverEmail).emit('receive-message', {
          senderEmail: senderEmail,
          receiverEmail: receiverEmail,
          message: message
        });

        console.log(`Message delivered via socket`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

module.exports = { initializeSocket, getIO };
