const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    length: 6
  },
  content: {
    type: String,
    default: ''
  },
  users: [{
    id: String,
    username: String,
    color: String,
    avatar: String,
    lastSeen: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
});

// Auto-delete rooms after 24 hours of inactivity
roomSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Room', roomSchema);
