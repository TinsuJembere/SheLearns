const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update here

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.role === 'mentor') {
      Object.assign(user, updates);
    } else if (user.role === 'student') {
      if ('avatar' in updates) user.avatar = updates.avatar;
      if ('bio' in updates) user.bio = updates.bio;
      if ('skills' in updates) user.skills = updates.skills;
      if ('languages' in updates) user.languages = updates.languages;
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.avatar = req.file.path; // ✅ Cloudinary-hosted image URL
    await user.save();

    res.json({ url: req.file.path });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading avatar.' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};
