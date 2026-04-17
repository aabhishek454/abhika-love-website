import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev
    methods: ["GET", "POST"]
  }
});

// Store room states
// { roomId: { videoId: string, currentTime: number, isPlaying: boolean, lastSyncTime: number } }
const rooms = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    
    // Initialize room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        videoId: 'dQw4w9WgXcQ', // Default video (Rick Astley)
        currentTime: 0,
        isPlaying: false,
        lastSyncTime: Date.now()
      };
    }

    // Send the current room state to the newly joined user
    socket.emit('room-state', rooms[roomId]);
    console.log(`User ${socket.id} joined room ${roomId}`);
    
    // Notify others
    socket.to(roomId).emit('user-joined', { id: socket.id });
  });

  socket.on('sync-action', ({ roomId, action, payload }) => {
    // Update room state based on action
    if (rooms[roomId]) {
       if (action === 'play') {
           rooms[roomId].isPlaying = true;
           rooms[roomId].currentTime = payload.currentTime;
       } else if (action === 'pause') {
           rooms[roomId].isPlaying = false;
           rooms[roomId].currentTime = payload.currentTime;
       } else if (action === 'seek') {
           rooms[roomId].currentTime = payload.currentTime;
       } else if (action === 'changeVideo') {
           rooms[roomId].videoId = payload.videoId;
           rooms[roomId].currentTime = 0;
           rooms[roomId].isPlaying = true; // Auto-play new video
       }
    }

    // Broadcast the action to everyone else in the room
    socket.to(roomId).emit('sync-action', { action, payload });
  });

  socket.on('sync-time', ({ roomId, currentTime }) => {
     if (rooms[roomId]) {
        rooms[roomId].currentTime = currentTime;
        rooms[roomId].lastSyncTime = Date.now();
     }
  });

  socket.on('send-message', ({ roomId, message, username }) => {
    const chatMessage = {
      id: Date.now().toString(),
      sender: username || 'Anonymous',
      text: message,
      timestamp: new Date().toISOString()
    };
    io.to(roomId).emit('chat-message', chatMessage);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
});
