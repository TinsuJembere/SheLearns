const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar, getAllUsers } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/avatars'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.userId + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage });

router.get('/', protect, getProfile);
router.put('/', protect, updateProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/users', protect, getAllUsers);
router.get('/users/:userId', protect, (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .select('-password')
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    })
    .catch(err => {
      res.status(500).json({ message: 'Server error' });
    });
});

module.exports = router; 