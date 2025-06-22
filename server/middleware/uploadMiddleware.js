const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'public/uploads/chat_files';

// Ensure the upload directory exists
fs.mkdirSync(uploadDir, { recursive: true });

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'file-' + Date.now() + path.extname(file.originalname));
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single('chatFile'); // 'chatFile' is the name of the form field

module.exports = upload; 