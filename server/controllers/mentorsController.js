const User = require('../models/User');

exports.getMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
}; 