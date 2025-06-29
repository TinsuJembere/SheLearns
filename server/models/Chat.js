const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: String },
  lastRead: {
    type: Map,
    of: Date,
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema); 