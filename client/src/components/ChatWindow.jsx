import { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FiPaperclip, FiEdit, FiTrash2, FiSave, FiXCircle } from 'react-icons/fi';

export default function ChatWindow({ conversation, chatId, onMessageSent, onMessageUpdated, onMessageDeleted, currentUser }) {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messages = conversation?.messages || [];
  const mentorName = conversation?.name || '';
  const mentorRole = conversation?.role || 'Mentor';
  const mentorAvatar = conversation?.avatar || '';
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedMessage && !event.target.closest('.message-container')) {
        setSelectedMessage(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedMessage]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !chatId) return;
    setSending(true);
    try {
      const res = await axios.post(`/api/chats/${chatId}/messages`, { text: input });
      setInput('');
      if (onMessageSent) onMessageSent(res.data);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file || !chatId) return;

    const formData = new FormData();
    formData.append('chatFile', file);

    setSending(true);
    try {
      const res = await axios.post(`/api/chats/${chatId}/files`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (onMessageSent) onMessageSent(res.data);
    } catch (err) {
      console.error('File upload failed:', err);
      alert('File upload failed. Max size: 10MB.');
    } finally {
      setSending(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`/api/chats/${chatId}/messages/${messageId}`);
      if (onMessageDeleted) onMessageDeleted(messageId);
      setSelectedMessage(null);
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('Failed to delete message.');
    }
  };

  const handleStartEdit = (message) => {
    setEditingMessage(message);
    setEditedText(message.text);
    setSelectedMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditedText('');
  };

  const handleSaveEdit = async () => {
    if (!editedText.trim() || !editingMessage) return;
    try {
      const res = await axios.put(
        `/api/chats/${chatId}/messages/${editingMessage._id}`,
        { text: editedText }
      );
      if (onMessageUpdated) onMessageUpdated(res.data);
      handleCancelEdit();
    } catch (err) {
      console.error('Failed to edit message:', err);
      alert('Failed to edit message.');
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    return '📁';
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={mentorAvatar} alt={mentorName} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-gray-900">{mentorName}</div>
            <div className="text-xs text-yellow-600 font-semibold">{mentorRole}</div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-yellow-500 text-xl">⋮</button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-yellow-50/30">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-10">No messages yet.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => {
              const senderId = msg.sender?._id || msg.sender;
              const isSentByCurrentUser = currentUser && senderId === currentUser._id;
              
              const avatarUrl = isSentByCurrentUser 
                ? (currentUser?.avatar || '/avatar.jpg')
                : (conversation?.avatar || '/avatar.jpg');
              
              // Don't render if message has no content
              if (!msg.text && !msg.fileUrl) {
                return null;
              }

              const isEditing = editingMessage && editingMessage._id === msg._id;

              return (
                <div key={msg._id} className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'} items-end gap-2 relative message-container`} onClick={() => isSentByCurrentUser && !isEditing && setSelectedMessage(msg)}>
                  {!isSentByCurrentUser && <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />}
                  
                  <div className={`max-w-[70%] px-4 py-2 rounded-lg shadow-sm ${
                    isSentByCurrentUser 
                      ? 'bg-yellow-400 text-white rounded-br-none' 
                      : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                  }`}>
                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} className="bg-white/20 text-white rounded p-1 border border-white/50" autoFocus />
                        <div className="flex justify-end gap-2">
                          <button onClick={handleSaveEdit} className="text-sm font-semibold hover:underline">Save</button>
                          <button onClick={handleCancelEdit} className="text-sm hover:underline">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {msg.fileUrl ? (
                          <div className="flex items-end gap-3">
                            <a href={`http://localhost:5000${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                              <span className="text-2xl">{getFileIcon(msg.fileType)}</span>
                              <span className={`font-semibold hover:underline ${isSentByCurrentUser ? 'text-white' : 'text-blue-600'}`}>
                                {msg.fileName}
                              </span>
                            </a>
                            <span className={`text-xs whitespace-nowrap self-end ${isSentByCurrentUser ? 'text-yellow-100' : 'text-gray-400'}`}>
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-baseline gap-2">
                            <span>{msg.text}</span>
                            <span className={`text-xs whitespace-nowrap ${isSentByCurrentUser ? 'text-yellow-100' : 'text-gray-400'}`}>
                              {msg.isEdited && '(edited)'}
                            </span>
                            <span className={`text-xs whitespace-nowrap ${isSentByCurrentUser ? 'text-yellow-100' : 'text-gray-400'}`}>
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {isSentByCurrentUser && <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />}
                  
                  {selectedMessage && selectedMessage._id === msg._id && (
                    <div className="absolute z-10 top-full right-10 mt-1 flex gap-1 bg-white border rounded-lg shadow-xl p-1">
                      <button onClick={(e) => { e.stopPropagation(); handleStartEdit(msg); }} className="p-2 hover:bg-gray-100 rounded-md text-gray-700" title="Edit"><FiEdit size={16}/></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }} className="p-2 hover:bg-gray-100 rounded-md text-red-500" title="Delete"><FiTrash2 size={16}/></button>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      {/* Input */}
      <form className="flex items-center gap-2 border-t px-6 py-4 bg-white sticky bottom-0" onSubmit={handleSend}>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} disabled={sending} />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="p-2 text-gray-500 hover:text-yellow-500 rounded-full hover:bg-yellow-100 disabled:opacity-50"
          disabled={sending}
          title="Attach file"
        >
          <FiPaperclip size={20} />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 font-semibold disabled:opacity-50"
          disabled={sending || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
} 