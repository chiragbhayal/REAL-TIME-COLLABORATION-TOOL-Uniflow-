# 🚀 MERN Real-Time Collaboration Tool

A comprehensive real-time collaboration tool built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring WebSocket communication, desktop support via Electron, and modern glassmorphism UI design.

## ✨ Features

### 🔄 Real-Time Collaboration
- **Live Document Editing**: Multiple users can edit the same document simultaneously
- **WebSocket Communication**: Instant synchronization using Socket.IO
- **User Presence**: See who's online with unique avatars and colors
- **Cursor Tracking**: Real-time cursor position sharing
- **Activity Feed**: Live statistics and user activity monitoring

### 🏠 Room Management
- **Random Room IDs**: 6-character unique room identifiers (e.g., ABC123)
- **Easy Room Creation**: One-click room generation
- **Simple Room Joining**: Enter room ID to collaborate
- **Room Persistence**: Documents saved to MongoDB Atlas
- **Auto-Cleanup**: Inactive rooms automatically removed after 24 hours

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful translucent interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark/Light Themes**: Adaptive design elements
- **Toast Notifications**: Real-time user feedback
- **Professional Typography**: Clean, readable fonts

### 🖥️ Multi-Platform Support
- **Web Application**: Runs in any modern browser
- **Desktop App**: Native Electron application
- **Cross-Platform**: macOS, Windows, and Linux support
- **Native Menus**: OS-integrated menu system
- **Keyboard Shortcuts**: Standard editing shortcuts

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Real-Time**: Socket.IO for WebSocket communication
- **Desktop**: Electron for native app experience
- **Styling**: CSS3 with Glassmorphism effects
- **Notifications**: React-Toastify

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (connection string provided)

### Installation

1. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**:
   The MongoDB connection is already configured in `server/.env`

3. **Start the application**:
   ```bash
   # Start web version (backend + frontend)
   npm start
   
   # Start desktop version (backend + frontend + electron)
   npm run desktop
   ```

### Available Scripts

- `npm start` - Start backend server and React client
- `npm run server` - Start only the backend server
- `npm run client` - Start only the React client
- `npm run desktop` - Launch the complete desktop application
- `npm run build` - Build React app for production
- `npm run electron-pack` - Build desktop distributables

## 📱 Usage

### Creating a Room
1. Enter your username
2. Click "Create Room"
3. Share the generated 6-character room ID with collaborators

### Joining a Room
1. Enter your username
2. Enter the room ID (e.g., ABC123)
3. Click "Join Room"
4. Start collaborating in real-time!

### Desktop Features
- **File Menu**: New Room (Cmd/Ctrl+N), Join Room (Cmd/Ctrl+J)
- **Edit Menu**: Standard editing shortcuts (Cut, Copy, Paste, Undo, Redo)
- **View Menu**: Zoom controls, fullscreen, developer tools
- **Native Integration**: OS-specific menus and keyboard shortcuts

## 🔧 Configuration

### MongoDB Connection
The application uses MongoDB Atlas with the following configuration:
```
mongodb+srv://chiragbhayal7_db_user:<db_password>@uniflow.tylnp43.mongodb.net/collaboration-tool
```

### Server Configuration
- **Port**: 5000 (configurable via PORT environment variable)
- **CORS**: Enabled for localhost:3000 and localhost:3001
- **Auto-cleanup**: Rooms expire after 24 hours of inactivity

### Client Configuration
- **Port**: 3001 (to avoid conflicts)
- **Proxy**: Configured to proxy API requests to backend
- **Socket.IO**: Connects to localhost:5000

## 🏗️ Architecture

```
├── server/                 # Backend Express.js application
│   ├── models/            # MongoDB Mongoose models
│   ├── server.js          # Main server file with Socket.IO
│   └── .env              # Environment variables
├── client/                # React frontend application
│   ├── src/              # React components and styles
│   └── public/           # Static assets
├── public/               # Electron main process files
│   ├── electron.js       # Electron main process
│   └── preload.js        # Electron preload script
└── desktop-launcher.js   # Desktop app launcher script
```

## 🔒 Security Features

- **Context Isolation**: Electron security best practices
- **CORS Protection**: Restricted cross-origin requests
- **Input Validation**: Sanitized user inputs
- **External Link Handling**: Safe external URL opening
- **Certificate Validation**: Proper SSL/TLS handling

## 📊 Real-Time Features

### WebSocket Events
- `join-room` - User joins a collaboration room
- `create-room` - Create a new collaboration room
- `text-change` - Document content updates
- `cursor-position` - Real-time cursor tracking
- `user-joined` - New user notifications
- `user-left` - User disconnect notifications

### Data Persistence
- **MongoDB Storage**: All rooms and content persisted
- **In-Memory Fallback**: Continues working if database is unavailable
- **Auto-Sync**: Real-time synchronization between database and memory

## 🎯 Performance Optimizations

- **Debounced Updates**: Cursor position updates throttled
- **Efficient Re-renders**: React optimization techniques
- **Memory Management**: Automatic cleanup of disconnected users
- **Lazy Loading**: Components loaded on demand

## 🐛 Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3001 and 5000 are available
2. **MongoDB Connection**: Verify the database password in `.env`
3. **Dependencies**: Run `npm run install-all` if modules are missing
4. **Electron Issues**: Clear node_modules and reinstall if desktop app fails

### Development Mode
```bash
# Enable Electron dev tools
ELECTRON_IS_DEV=1 npm run electron
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- MongoDB Atlas for cloud database hosting
- Electron for desktop application framework
- React team for the amazing frontend library

---

**Ready to collaborate in real-time? Start the application and invite your team! 🎉**
