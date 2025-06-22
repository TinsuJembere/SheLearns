const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: String,
  date: String,
}, { _id: false });

const statsSchema = new mongoose.Schema({
  mentorships: { type: Number, default: 0 },
  students: { type: Number, default: 0 },
  projects: { type: Number, default: 0 },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['student', 'mentor', 'admin'], required: true },
  avatar: { type: String },
  bio: { type: String },
  // Mentor-only fields
  skills: [{ type: String }],
  languages: [{ type: String }],
  expertise: [{ type: String }],
  stats: statsSchema,
  achievements: [achievementSchema],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 