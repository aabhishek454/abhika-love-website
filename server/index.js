import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import youTubeSearch from 'youtube-search-api';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000
});

const rooms = {};

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = { videoId: 'dQw4w9WgXcQ', currentTime: 0, isPlaying: false };
    }
    socket.emit('room-state', rooms[roomId]);
    console.log(`User joined: ${roomId}`);
  });

  socket.on('sendMessage', ({ roomId, message, username }) => {
    const chatMessage = {
      id: Date.now().toString(),
      sender: username,
      text: message,
      timestamp: new Date().toISOString()
    };
    io.to(roomId).emit('receiveMessage', chatMessage);
  });

  socket.on('play', ({ roomId, currentTime, username }) => {
    if (rooms[roomId]) {
      rooms[roomId].isPlaying = true;
      rooms[roomId].currentTime = currentTime;
    }
    socket.to(roomId).emit('play', { currentTime, username });
  });

  socket.on('pause', ({ roomId, currentTime, username }) => {
    if (rooms[roomId]) {
      rooms[roomId].isPlaying = false;
      rooms[roomId].currentTime = currentTime;
    }
    socket.to(roomId).emit('pause', { currentTime, username });
  });

  socket.on('seek', ({ roomId, currentTime }) => {
    if (rooms[roomId]) rooms[roomId].currentTime = currentTime;
    socket.to(roomId).emit('seek', { currentTime });
  });

  socket.on('changeVideo', ({ roomId, videoId, title, username }) => {
    if (rooms[roomId]) {
      rooms[roomId].videoId = videoId;
      rooms[roomId].currentTime = 0;
      rooms[roomId].isPlaying = true;
    }
    socket.to(roomId).emit('changeVideo', { videoId, title, username });
  });

  socket.on('start-listening', ({ username }) => {
    socket.broadcast.emit('partner-listening', { username });
  });

  socket.on('typing', ({ roomId, username }) => {
    socket.to(roomId).emit('typing', { username });
  });

  socket.on('stop-typing', ({ roomId, username }) => {
    socket.to(roomId).emit('stop-typing', { username });
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Real-sync server running on port ${PORT}`);
});
