require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const mentorsRoutes = require('./routes/mentors');
const mentorRequestsRoutes = require('./routes/mentorRequests');
const aiRoutes = require('./routes/ai');
const chatsRoutes = require('./routes/chats');
const blogRoutes = require('./routes/blog');
const subscribeRoutes = require('./routes/subscribe');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const passport = require('passport');
require('./config/passport');

const app = express();

// Initialize passport
app.use(passport.initialize());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  },
  path: '/socket.io',
  transports: ['websocket', 'polling']
});

const allowedOrigin = 'http://localhost:5173'; // Your Vite frontend

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Placeholder route
app.get('/', (req, res) => {
  res.send('SheLearns API is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/mentor-requests', mentorRequestsRoutes);
app.use('/api/ai', aiRoutes); 
app.use('/api/chats', chatsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/subscribe', subscribeRoutes);

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Listen for blog updates
  socket.on('join-blog-room', () => {
    socket.join('blog-updates');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const blogController = require('./controllers/blogController');
const originalSubmitPost = blogController.submitPost;
blogController.submitPost = async (req, res) => {
  try {
    const result = await originalSubmitPost(req, res);
    io.to('blog-updates').emit('new-blog-post');
    return result;
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});