const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// List all chats for the logged-in user
exports.listChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user.userId })
      .populate('participants', 'name email role avatar bio skills')
      .sort('-updatedAt');
      
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const lastReadTime = chat.lastRead?.get(req.user.userId);
        let unreadCount = 0;

        if (lastReadTime) {
          unreadCount = await Message.countDocuments({
            chat: chat._id,
            sender: { $ne: req.user.userId },
            createdAt: { $gt: lastReadTime },
          });
        } else {
          // If never read, all messages from others are unread
          unreadCount = await Message.countDocuments({
            chat: chat._id,
            sender: { $ne: req.user.userId },
          });
        }
        
        // Return latest messages for preview
        const messages = await Message.find({ chat: chat._id })
          .sort('-createdAt')
          .limit(1);

        return {
          ...chat.toObject(),
          unreadCount: unreadCount,
          messages: messages, // just the latest for preview
        };
      })
    );

    res.json(chatsWithUnread);
  } catch (err) {
    console.error('List chats error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Start a new chat (or return existing)
exports.startChat = async (req, res) => {
  try {
    const { userId } = req.body; // userId to chat with
    if (!userId) return res.status(400).json({ message: 'User ID required.' });
    // ALLOW self-chat: do not block if userId === req.user.userId
    let chat;
    if (userId === req.user.userId) {
      // Check if a self-chat already exists
      chat = await Chat.findOne({ 
        $and: [
          { participants: { $size: 1 } },
          { participants: req.user.userId }
        ]
      });
      if (!chat) {
        chat = new Chat({ participants: [req.user.userId] });
        await chat.save();
      }
    } else {
      chat = await Chat.findOne({ participants: { $all: [req.user.userId, userId], $size: 2 } });
      if (!chat) {
        chat = new Chat({ participants: [req.user.userId, userId] });
        await chat.save();
      }
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get messages for a chat
exports.getMessages = async (req, res) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email role')
      .sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Send a message in a chat
exports.sendMessage = async (req, res) => {
  try {
    const chatId = req.params.id;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message text required.' });
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    const message = new Message({ chat: chatId, sender: req.user.userId, text });
    await message.save();
    chat.lastMessage = text;
    await chat.save();
    
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name email role avatar');
    res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Send a file in a chat
exports.sendFile = async (req, res) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized.' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    const { originalname, mimetype, path: fileUrl } = req.file; // Cloudinary URL
    
    const message = new Message({
      chat: chatId,
      sender: req.user.userId,
      fileName: originalname,
      fileType: mimetype,
      fileUrl: fileUrl,
    });
    await message.save();
    
    chat.lastMessage = `File: ${originalname}`;
    await chat.save();
    
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name email role avatar');
    res.status(201).json(populatedMessage);
    
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ message: 'Server error while uploading file.' });
  }
};

// Edit a message
exports.editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Message text required.' });

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found.' });

    // Ensure the user editing the message is the original sender
    if (message.sender.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this message.' });
    }

    message.text = text;
    message.isEdited = true;
    await message.save();

    const populatedMessage = await Message.findById(message._id).populate('sender', 'name email role avatar');
    res.json(populatedMessage);

  } catch (err) {
    console.error('Edit message error:', err);
    res.status(500).json({ message: 'Server error while editing message.' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found.' });

    // Ensure the user deleting the message is the original sender
    if (message.sender.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this message.' });
    }

    await message.deleteOne(); // Use deleteOne instead of remove

    res.json({ message: 'Message deleted successfully.' });

  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ message: 'Server error while deleting message.' });
  }
};

// Mark a chat as read
exports.markAsRead = async (req, res) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);

    if (!chat || !chat.participants.includes(req.user.userId)) {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    chat.lastRead.set(req.user.userId, new Date());
    await chat.save();

    res.json({ message: 'Chat marked as read.' });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
}; 