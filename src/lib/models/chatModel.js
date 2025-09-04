import mongoose from "mongoose";
const ChatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'model', 'system']
  },
  parts: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});
const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  messages: [ChatMessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 30
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ChatSessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);