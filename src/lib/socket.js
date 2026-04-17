import { io } from 'socket.io-client';

// For Vite, environment variables are available via import.meta.env
// For Vercel/Node environment, process.env might be available
const getBackendURL = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
     return 'http://localhost:3001';
  }
  
  // Try to find the Render URL from environment
  return import.meta.env.VITE_BACKEND_URL || 
         'https://abhika-backend.onrender.com'; // Default production placeholder
};

const URL = getBackendURL();

export const socket = io(URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"], // Dual transport for maximum stability
  timeout: 20000
});

// Global debug logs for stable connectivity
socket.on("connect", () => {
  console.log("%c Real-time Sync: Connected!", "color: #10b981; font-weight: bold", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("%c Real-time Sync Error:", "color: #ef4444; font-weight: bold", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("%c Real-time Sync: Disconnected", "color: #f59e0b; font-weight: bold", reason);
});
