// controllers/aiController.js
const axios = require('axios');
const AIConversation = require('../models/AIConversation');

exports.askAI = async (req, res) => {
  try {
    const { question, conversationId } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required.' });

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ message: 'AI service not configured.' });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [{ role: 'user', content: question }]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    
    // Save conversation
    let conversation;
    if (conversationId) {
      // Update existing conversation
      conversation = await AIConversation.findById(conversationId);
      if (!conversation || conversation.user.toString() !== req.user.userId) {
        return res.status(404).json({ message: 'Conversation not found.' });
      }
      
      conversation.messages.push(
        { sender: 'user', text: question },
        { sender: 'bot', text: answer }
      );
      
      // Update title if it's the first message
      if (conversation.messages.length === 2) {
        conversation.title = question.substring(0, 50) + (question.length > 50 ? '...' : '');
      }
    } else {
      // Create new conversation
      conversation = new AIConversation({
        user: req.user.userId,
        title: question.substring(0, 50) + (question.length > 50 ? '...' : ''),
        messages: [
          { sender: 'user', text: question },
          { sender: 'bot', text: answer }
        ]
      });
    }
    
    await conversation.save();
    
    res.json({ 
      answer, 
      conversationId: conversation._id,
      conversationTitle: conversation.title 
    });
  } catch (err) {
    console.error('AI error:', err.response?.data || err.message);
    res.status(500).json({ message: 'AI error.' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await AIConversation.find({ user: req.user.userId })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('title messages createdAt updatedAt');
    
    res.json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ message: 'Error fetching conversations.' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await AIConversation.findOne({
      _id: conversationId,
      user: req.user.userId
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found.' });
    }
    
    res.json(conversation);
  } catch (err) {
    console.error('Error fetching conversation:', err);
    res.status(500).json({ message: 'Error fetching conversation.' });
  }
};

exports.createNewConversation = async (req, res) => {
  try {
    const conversation = new AIConversation({
      user: req.user.userId,
      title: 'New Conversation',
      messages: []
    });
    
    await conversation.save();
    res.json({ conversationId: conversation._id, title: conversation.title });
  } catch (err) {
    console.error('Error creating conversation:', err);
    res.status(500).json({ message: 'Error creating conversation.' });
  }
};

exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await AIConversation.findOneAndDelete({
      _id: conversationId,
      user: req.user.userId
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found.' });
    }
    
    res.json({ message: 'Conversation deleted successfully.' });
  } catch (err) {
    console.error('Error deleting conversation:', err);
    res.status(500).json({ message: 'Error deleting conversation.' });
  }
};
