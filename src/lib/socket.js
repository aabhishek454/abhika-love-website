import { io } from 'socket.io-client';

// In production, this would be your deployed server URL
const URL = import.meta.env.PROD ? 'YOUR_RENDER_URL_HERE' : 'http://localhost:3001';

export const socket = io(URL, {
  autoConnect: false, // We'll connect manually when joining a room
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
