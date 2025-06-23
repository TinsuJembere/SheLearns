const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  listChats,
  startChat,
  getMessages,
  sendMessage,
  sendFile,
  editMessage,
  deleteMessage,
  markAsRead,
} = require('../controllers/chatsController');

router.get('/', protect, listChats);
router.post('/', protect, startChat);
router.get('/:id', protect, getMessages);
router.post('/:id/read', protect, markAsRead);
router.post('/:id/messages', protect, sendMessage);
router.put('/:id/messages/:messageId', protect, editMessage);
router.delete('/:id/messages/:messageId', protect, deleteMessage);
router.post('/:id/files', protect, upload.chatFile.single('file'), sendFile);

module.exports = router; 