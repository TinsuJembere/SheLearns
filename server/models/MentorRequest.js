const mongoose = require('mongoose');

const mentorRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  notified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('MentorRequest', mentorRequestSchema); 