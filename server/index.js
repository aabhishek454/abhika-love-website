import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import ytSearch from 'yt-search';

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]
});

// Room-based State
const rooms = {};

const getRoomState = (roomId) => {
  if (!rooms[roomId]) {
    rooms[roomId] = {
      currentVideoId: 'dQw4w9WgXcQ',
      currentTitle: 'Never Gonna Give You Up',
      isPlaying: false,
      currentTime: 0,
      volume: 50,
      queue: [],
      lastUpdated: Date.now(),
      messages: []
    };
  }
  return rooms[roomId];
};

app.get('/api/youtube/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    const results = await ytSearch(q);
    const videos = results.videos.slice(0, 10).map(video => ({
      videoId: video.videoId,
      title: video.title,
      thumbnail: video.thumbnail,
      channel: video.author.name
    }));
    res.json(videos);
  } catch (error) {
    console.error('YouTube Search Error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join-room', ({ roomId }) => {
    socket.join(roomId);
    const state = getRoomState(roomId);
    socket.emit('initialState', state);
    console.log(`User joined: ${roomId}`);
  });

  socket.on('changeVideo', (data) => {
    const { roomId, videoId, title, user } = data;
    const state = getRoomState(roomId);
    state.currentVideoId = videoId;
    state.currentTitle = title || 'Unknown Title';
    state.currentTime = 0;
    state.isPlaying = true;
    state.lastUpdated = Date.now();
    
    io.to(roomId).emit('videoChanged', state);
  });

  socket.on('play', (data) => {
    const { roomId, currentTime, user } = data;
    const state = getRoomState(roomId);
    state.isPlaying = true;
    state.currentTime = currentTime;
    state.lastUpdated = Date.now();
    
    io.to(roomId).emit('playerStateChange', state);
  });

  socket.on('pause', (data) => {
    const { roomId, currentTime, user } = data;
    const state = getRoomState(roomId);
    state.isPlaying = false;
    state.currentTime = currentTime;
    state.lastUpdated = Date.now();
    
    io.to(roomId).emit('playerStateChange', state);
  });

  socket.on('seek', (data) => {
    const { roomId, currentTime, user } = data;
    const state = getRoomState(roomId);
    state.currentTime = currentTime;
    state.lastUpdated = Date.now();
    
    io.to(roomId).emit('playerStateChange', state);
  });

  socket.on('volumeChange', (data) => {
    const { roomId, volume } = data;
    const state = getRoomState(roomId);
    state.volume = volume;
    io.to(roomId).emit('volumeAction', { volume });
  });

  socket.on('addToQueue', (data) => {
    const { roomId, videoId, title, thumbnail } = data;
    const state = getRoomState(roomId);
    const newItem = {
      id: Date.now(),
      videoId,
      title,
      thumbnail
    };
    state.queue.push(newItem);
    io.to(roomId).emit('queueUpdate', state.queue);
  });

  socket.on('trackEnded', (data) => {
    const { roomId } = data;
    const state = getRoomState(roomId);
    if (state.queue.length > 0) {
      const next = state.queue.shift();
      state.currentVideoId = next.videoId;
      state.currentTitle = next.title;
      state.currentTime = 0;
      state.isPlaying = true;
      state.lastUpdated = Date.now();
      
      io.to(roomId).emit('videoChanged', state);
      io.to(roomId).emit('queueUpdate', state.queue);
    }
  });

  socket.on('removeFromQueue', (data) => {
    const { roomId, id } = data;
    const state = getRoomState(roomId);
    state.queue = state.queue.filter(item => item.id !== id);
    io.to(roomId).emit('queueUpdate', state.queue);
  });

  socket.on('sendMessage', (data) => {
    const { roomId, user, text } = data;
    const state = getRoomState(roomId);
    const newMessage = {
      id: Date.now(),
      user,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    state.messages.push(newMessage);
    if (state.messages.length > 50) state.messages.shift();
    io.to(roomId).emit('receiveMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Real-sync server running on port ${PORT}`);
});
