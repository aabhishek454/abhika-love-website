import { io } from 'socket.io-client';

// In production, this would be your deployed server URL (e.g. Render/Heroku)
const URL = import.meta.env.PROD ? '' : 'http://localhost:3001';

export const socket = io(URL, {
  autoConnect: false, // We'll connect manually when joining a room
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
