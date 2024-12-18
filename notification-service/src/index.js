import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { connectToDatabase } from './config/dbConnect.js';
import userRoute from './routes/userRoute.js';
import http from 'http';
import cookieParser from 'cookie-parser';
import { Server as SocketIo } from 'socket.io';
import { socketConnection } from './controllers/notificationController.js';


const app = express();
app.use(cookieParser());

// CORS options to allow credentials (cookies) to be sent
const corsOptions = {
  origin: process.env.FRONTEND_URL,  
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

// Use CORS middleware with the options
app.use(cors(corsOptions));

// Middleware for parsing JSON
app.use(express.json());

// Connect to the database
connectToDatabase();

// User routes
app.use('/api/user/', userRoute);

// Create HTTP server for Express
const server = http.createServer(app);

// Integrate Socket.IO with the server
const io = new SocketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,  // Allow cookies to be sent with the WebSocket connection
  },
});



io.on('connection', socketConnection);

// Start the server and listen on the specified port
const PORT = process.env.PORT || 3000;  // Default to port 3000 if no PORT is specified
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
