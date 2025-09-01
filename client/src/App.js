import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [modalType, setModalType] = useState('join'); // 'join' or 'create'
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cursors, setCursors] = useState(new Map());
  
  const textareaRef = useRef(null);
  const cursorUpdateTimeout = useRef(null);

  useEffect(() => {
    const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    const newSocket = io(serverUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      toast.success('Connected to server!');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      toast.error('Disconnected from server');
    });

    newSocket.on('room-created', (data) => {
      setRoomId(data.roomId);
      toast.success(`Room ${data.roomId} created! Share this ID with others.`);
    });

    newSocket.on('room-joined', (data) => {
      setCurrentRoom(data.roomId);
      setContent(data.content);
      setCurrentUser(data.user);
      setShowModal(false);
      toast.success(`Joined room ${data.roomId}`);
    });

    newSocket.on('text-changed', (data) => {
      setContent(data.content);
    });

    newSocket.on('user-joined', (user) => {
      toast.info(`${user.username} joined the room`);
    });

    newSocket.on('user-left', (data) => {
      toast.info(`${data.username} left the room`);
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.delete(data.userId);
        return newCursors;
      });
    });

    newSocket.on('users-update', (usersList) => {
      setUsers(usersList);
    });

    newSocket.on('cursor-update', (data) => {
      setCursors(prev => {
        const newCursors = new Map(prev);
        newCursors.set(data.userId, {
          position: data.position,
          username: data.username
        });
        return newCursors;
      });
    });

    newSocket.on('error', (error) => {
      toast.error(error);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleCreateRoom = () => {
    if (!username.trim()) {
      toast.error('Please enter your username');
      return;
    }
    socket.emit('create-room', { username });
  };

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) {
      toast.error('Please enter both username and room ID');
      return;
    }
    socket.emit('join-room', { roomId: roomId.toUpperCase(), username });
  };

  const handleTextChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    if (socket && currentRoom) {
      socket.emit('text-change', {
        roomId: currentRoom,
        content: newContent,
        username
      });
    }
  };

  const handleCursorMove = (e) => {
    if (cursorUpdateTimeout.current) {
      clearTimeout(cursorUpdateTimeout.current);
    }
    
    cursorUpdateTimeout.current = setTimeout(() => {
      if (socket && currentRoom) {
        socket.emit('cursor-position', {
          roomId: currentRoom,
          position: e.target.selectionStart,
          username
        });
      }
    }, 100);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(currentRoom);
    toast.success('Room ID copied to clipboard!');
  };

  const leaveRoom = () => {
    setCurrentRoom('');
    setContent('');
    setUsers([]);
    setCursors(new Map());
    setCurrentUser(null);
    setShowModal(true);
    setModalType('join');
    setRoomId('');
    toast.info('Left the room');
  };

  if (showModal) {
    return (
      <div className="app">
        <div className="modal-overlay">
          <div className="modal">
            <h2>✨ Real-Time Collaboration</h2>
            <p className="modal-subtitle">
              {modalType === 'join' 
                ? 'Join an existing collaboration room or create a new one'
                : 'Create a new room and invite others to collaborate'
              }
            </p>
            
            <div className="input-group">
              <label className="input-label">Your Name</label>
              <input
                type="text"
                placeholder="Enter your display name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                maxLength={20}
              />
            </div>
            
            {modalType === 'join' && (
              <div className="input-group">
                <label className="input-label">Room ID</label>
                <input
                  type="text"
                  placeholder="Enter 6-character room code"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="input"
                  maxLength={6}
                />
              </div>
            )}
            
            <div className="modal-buttons">
              {modalType === 'join' ? (
                <>
                  <button onClick={handleJoinRoom} className="btn btn-secondary">
                    🚀 Join Collaboration
                  </button>
                  <button 
                    onClick={() => setModalType('create')} 
                    className="btn btn-outline"
                  >
                    ✨ Create New Room
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleCreateRoom} className="btn btn-create">
                    ✨ Create New Room
                  </button>
                  <button 
                    onClick={() => setModalType('join')} 
                    className="btn btn-outline"
                  >
                    ⬅️ Back to Join
                  </button>
                </>
              )}
            </div>
            
            <div className="connection-status">
              <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" theme="dark" />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header glass">
        <div className="header-content">
          <h1>📝 Collaboration Room: {currentRoom}</h1>
          <div className="header-actions">
            <button onClick={copyRoomId} className="btn btn-outline btn-sm">
              📋 Copy Room ID
            </button>
            <button onClick={leaveRoom} className="btn btn-outline btn-sm">
              🚪 Leave Room
            </button>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="editor-section">
          <div className="editor-container glass">
            <div className="editor-header">
              <h3>📄 Shared Document</h3>
              <div className="document-stats">
                <span>📊 {content.length} characters</span>
                <span>👥 {users.length} users</span>
              </div>
            </div>
            <div className="editor-wrapper">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextChange}
                onSelect={handleCursorMove}
                onKeyUp={handleCursorMove}
                onClick={handleCursorMove}
                placeholder="Start typing to collaborate in real-time..."
                className="editor"
              />
              <div className="cursors-overlay">
                {Array.from(cursors.entries()).map(([userId, cursor]) => (
                  <div
                    key={userId}
                    className="cursor-indicator"
                    style={{
                      left: `${cursor.position * 0.6}ch`,
                      top: `${Math.floor(cursor.position / 80) * 1.5}em`
                    }}
                  >
                    <div className="cursor-line"></div>
                    <div className="cursor-label">{cursor.username}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="users-panel glass-dark">
            <h3>👥 Active Users ({users.length})</h3>
            <div className="users-list">
              {users.map((user) => (
                <div key={user.id} className="user-item">
                  <div 
                    className="user-avatar"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.avatar}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user.username}</span>
                    {user.id === currentUser?.id && (
                      <span className="user-badge">You</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="activity-panel glass-dark">
            <h3>📈 Room Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Room ID</span>
                <span className="stat-value">{currentRoom}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Characters</span>
                <span className="stat-value">{content.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Words</span>
                <span className="stat-value">
                  {content.trim() ? content.trim().split(/\s+/).length : 0}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Lines</span>
                <span className="stat-value">{content.split('\n').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};

export default App;
