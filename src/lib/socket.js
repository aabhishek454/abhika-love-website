import { io } from 'socket.io-client';

// FOOLPROOF PRODUCTION URL DETECTION
const getBackendURL = () => {
  // If we are running locally, use localhost
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
     return 'http://localhost:3001';
  }
  
  // ALWAYS use the live Render backend in production
  // This bypasses any missing or misconfigured environment variables
  return 'https://abhika-backend.onrender.com';
};

const URL = getBackendURL();

export const socket = io(URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 20,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
  timeout: 30000,
  forceNew: true 
});

// High-visibility logs for debugging in production
socket.on("connect", () => {
  console.log("%c [SYNC] Connected to Backend: " + URL, "color: #10b981; font-weight: bold; font-size: 12px;");
});

socket.on("connect_error", (err) => {
  console.error("%c [SYNC] Connection Failure to " + URL + ":", "color: #ef4444; font-weight: bold", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("%c [SYNC] Disconnected:", "color: #f59e0b; font-weight: bold", reason);
});
