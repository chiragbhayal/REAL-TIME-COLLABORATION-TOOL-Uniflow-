const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Room = require('./models/Room');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://uniflow-phuzvr5dt-bhayal07s-projects.vercel.app", "https://uniflow-wfpb.onrender.com"]
      : ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ["https://uniflow-phuzvr5dt-bhayal07s-projects.vercel.app", "https://uniflow-wfpb.onrender.com"]
    : ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Falling back to in-memory storage');
  }
};

connectDB();

// In-memory storage fallback
const rooms = new Map();
const connectedUsers = new Map();

// Generate random room ID
const generateRoomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// User colors and avatars
const userColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
const userAvatars = ['👤', '🧑‍💻', '👩‍💻', '🧑‍🎨', '👩‍🎨', '🧑‍🔬', '👩‍🔬', '🧑‍💼'];

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('join-room', async (data) => {
    const { roomId, username } = data;
    
    try {
      let room = null;
      let roomContent = '';
      
      // Try MongoDB first if connected
      if (mongoose.connection.readyState === 1) {
        try {
          room = await Room.findOne({ roomId });
          if (room) {
            roomContent = room.content;
          }
        } catch (dbError) {
          console.log('MongoDB query failed, using in-memory storage');
        }
      }
      
      // Initialize or get in-memory room
      if (!rooms.has(roomId)) {
        rooms.set(roomId, { content: roomContent, users: new Map() });
      }
      
      const roomData = rooms.get(roomId);
      
      const userColor = userColors[Math.floor(Math.random() * userColors.length)];
      const userAvatar = userAvatars[Math.floor(Math.random() * userAvatars.length)];
      
      const user = {
        id: socket.id,
        username,
        color: userColor,
        avatar: userAvatar,
        roomId
      };
      
      connectedUsers.set(socket.id, user);
      socket.join(roomId);
      
      // Update room users
      roomData.users.set(socket.id, user);
      
      // Try to update MongoDB if available
      if (mongoose.connection.readyState === 1) {
        try {
          if (!room) {
            room = new Room({ roomId, content: roomContent });
            await room.save();
          }
          room.users.push(user);
          room.lastActivity = new Date();
          await room.save();
        } catch (dbError) {
          console.log('MongoDB update failed, continuing with in-memory storage');
        }
      }
      
      socket.emit('room-joined', {
        roomId,
        content: roomData.content,
        user
      });
      
      socket.to(roomId).emit('user-joined', user);
      
      // Send current users list
      const currentUsers = Array.from(roomData.users.values());
      io.to(roomId).emit('users-update', currentUsers);
      
      console.log(`👤 ${username} joined room ${roomId}`);
      
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', 'Failed to join room');
    }
  });

  socket.on('create-room', async (data) => {
    const { username } = data;
    let roomId;
    let attempts = 0;
    
    // Generate unique room ID
    do {
      roomId = generateRoomId();
      attempts++;
    } while (rooms.has(roomId) && attempts < 10);
    
    try {
      // Create in-memory room first
      rooms.set(roomId, { content: '', users: new Map() });
      
      // Try to save to MongoDB if available
      if (mongoose.connection.readyState === 1) {
        try {
          const room = new Room({ roomId, content: '' });
          await room.save();
        } catch (dbError) {
          console.log('MongoDB save failed, continuing with in-memory storage');
        }
      }
      
      socket.emit('room-created', { roomId });
      console.log(`🏠 Room ${roomId} created by ${username}`);
      
    } catch (error) {
      console.error('Error creating room:', error);
      socket.emit('error', 'Failed to create room');
    }
  });

  socket.on('text-change', async (data) => {
    const { roomId, content, username } = data;
    
    try {
      // Update in-memory storage first
      if (rooms.has(roomId)) {
        rooms.get(roomId).content = content;
      }
      
      // Try to update MongoDB if available
      if (mongoose.connection.readyState === 1) {
        try {
          await Room.findOneAndUpdate(
            { roomId },
            { content, lastActivity: new Date() }
          );
        } catch (dbError) {
          console.log('MongoDB update failed, continuing with in-memory storage');
        }
      }
      
      socket.to(roomId).emit('text-changed', { content, username });
      
    } catch (error) {
      console.error('Error updating content:', error);
    }
  });

  socket.on('cursor-position', (data) => {
    const { roomId, position, username } = data;
    socket.to(roomId).emit('cursor-update', { position, username, userId: socket.id });
  });

  socket.on('disconnect', async () => {
    const user = connectedUsers.get(socket.id);
    
    if (user) {
      const { roomId, username } = user;
      
      // Remove from in-memory storage
      if (rooms.has(roomId)) {
        rooms.get(roomId).users.delete(socket.id);
        
        // Clean up empty rooms
        if (rooms.get(roomId).users.size === 0) {
          rooms.delete(roomId);
        }
      }
      
      // Update MongoDB
      if (mongoose.connection.readyState === 1) {
        try {
          await Room.findOneAndUpdate(
            { roomId },
            { 
              $pull: { users: { id: socket.id } },
              lastActivity: new Date()
            }
          );
        } catch (error) {
          console.error('Error updating room on disconnect:', error);
        }
      }
      
      connectedUsers.delete(socket.id);
      socket.to(roomId).emit('user-left', { userId: socket.id, username });
      
      // Send updated users list
      if (rooms.has(roomId)) {
        const currentUsers = Array.from(rooms.get(roomId).users.values());
        io.to(roomId).emit('users-update', currentUsers);
      }
      
      console.log(`👋 ${username} left room ${roomId}`);
    }
    
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// REST API endpoints
app.get('/api/rooms/:roomId', async (req, res) => {
  const { roomId } = req.params;
  
  try {
    let room = await Room.findOne({ roomId });
    
    if (!room && rooms.has(roomId)) {
      const roomData = rooms.get(roomId);
      room = { roomId, content: roomData.content };
    }
    
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ error: 'Room not found' });
    }
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    activeRooms: rooms.size,
    connectedUsers: connectedUsers.size
  });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
