import { io } from 'socket.io-client';

// Use NEXT_PUBLIC_BACKEND_URL for Vercel compatibility
// Fallback to localhost for dev environment
const URL = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_URL 
  ? process.env.NEXT_PUBLIC_BACKEND_URL 
  : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001');

export const socket = io(URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket"] // Ensure stable websocket connection on Render
});

// Debug log for production connection
socket.on("connect", () => {
  console.log("Connected to Real-time Backend:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket Connection Error:", err.message);
});
