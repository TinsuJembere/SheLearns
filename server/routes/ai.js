const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  askAI, 
  getConversations, 
  getConversation, 
  createNewConversation, 
  deleteConversation 
} = require('../controllers/aiController');

router.post('/ask', protect, askAI);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:conversationId', protect, getConversation);
router.post('/conversations', protect, createNewConversation);
router.delete('/conversations/:conversationId', protect, deleteConversation);

module.exports = router;
