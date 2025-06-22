import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // ✅ Import react-markdown
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function AIChat() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  // Load conversations on component mount
  useEffect(() => {
    if (user && token) {
      loadConversations();
    }
  }, [user, token]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      setMessages(currentConversation.messages || []);
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  const loadConversations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ai/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
    } catch (err) {
      console.error('Error loading conversations:', err);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/ai/conversations', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newConversation = {
        _id: response.data.conversationId,
        title: response.data.title,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setConversations([newConversation, ...conversations]);
      setCurrentConversation(newConversation);
      setMessages([]);
    } catch (err) {
      console.error('Error creating new conversation:', err);
    }
  };

  const selectConversation = async (conversationId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ai/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentConversation(response.data);
    } catch (err) {
      console.error('Error loading conversation:', err);
    }
  };

  const deleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:5000/api/ai/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setConversations(conversations.filter(conv => conv._id !== conversationId));
      
      if (currentConversation && currentConversation._id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/ai/ask',
        { 
          question: input,
          conversationId: currentConversation?._id 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMsg = {
        sender: 'bot',
        text: res.data.answer,
        timestamp: new Date()
      };

      setMessages((msgs) => [...msgs, aiMsg]);

      // Update conversation in the list if it's a new conversation
      if (!currentConversation) {
        const newConversation = {
          _id: res.data.conversationId,
          title: res.data.conversationTitle,
          messages: [...messages, userMsg, aiMsg],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setCurrentConversation(newConversation);
        setConversations([newConversation, ...conversations]);
      } else {
        // Update existing conversation in the list
        setConversations(prev => 
          prev.map(conv => 
            conv._id === currentConversation._id 
              ? { ...conv, title: res.data.conversationTitle, updatedAt: new Date() }
              : conv
          )
        );
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'An error occurred while processing your request.';
      setMessages((msgs) => [
        ...msgs,
        {
          sender: 'bot',
          text: errorMessage,
          timestamp: new Date()
        },
      ]);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <div className="flex flex-1 max-w-7xl mx-auto w-full pt-6 pb-2 px-4 gap-6">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 hidden md:flex flex-col gap-4 pr-2">
          <button 
            onClick={createNewChat}
            disabled={!user}
            className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded mb-2 hover:bg-yellow-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            + New Chat
          </button>
          <div className="bg-white rounded-xl shadow border border-gray-100 flex-1 overflow-y-auto">
            <div className="p-2">
              <div className="font-semibold text-gray-700 mb-2 px-2">Recent Conversations</div>
              <ul className="flex flex-col gap-1">
                {!user ? (
                  <li className="px-3 py-2 text-sm text-gray-500 italic">
                    Please <Link to="/login" className="underline text-yellow-600 hover:text-yellow-800">log in</Link> to view and start conversations.
                  </li>
                ) : conversations.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-gray-500 italic">
                    No conversations yet
                  </li>
                ) : (
                  conversations.map((conv) => (
                    <li
                      key={conv._id}
                      onClick={() => selectConversation(conv._id)}
                      className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition text-sm font-medium group ${
                        currentConversation?._id === conv._id 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'hover:bg-yellow-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block flex-shrink-0" />
                        <span className="truncate">{conv.title}</span>
                      </div>
                      <button
                        onClick={(e) => deleteConversation(conv._id, e)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        title="Delete conversation"
                      >
                        ×
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-white rounded-xl shadow border border-gray-100">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="font-bold text-lg text-gray-900">AI Learning Companion</h2>
              {currentConversation && (
                <p className="text-sm text-gray-500 mt-1">
                  {currentConversation.title} • {formatDate(currentConversation.updatedAt)}
                </p>
              )}
            </div>
            <div className="text-xs text-gray-400"></div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
            {messages.length === 0 && !loading && (
              <div className="text-center text-gray-500 mt-8">
                <p>Start a conversation with your AI learning companion!</p>
                <p className="text-sm mt-2">Ask questions about programming, get help with projects, or discuss learning strategies.</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg shadow text-sm ${
                    msg.sender === 'user'
                      ? 'bg-yellow-400 text-white self-end'
                      : 'bg-gray-100 text-gray-800 self-start'
                  }`}
                >
                  {msg.sender === 'bot' ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                  <div className="text-xs text-right text-gray-300 mt-1">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 animate-pulse">AI is typing...</div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t px-6 py-4">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={user ? "Ask me anything..." : "Please log in to start chatting"}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100"
                disabled={!user || loading}
              />
              <button
                type="submit"
                className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!user || loading || !input.trim()}
              >
                Send
              </button>
            </form>
          </div>

          {/* Disclaimer */}
          <div className="px-6 py-2 text-xs text-gray-400 border-t bg-gray-50">
            Disclaimer: This information is generated by an AI mentor and should be cross-verified for important decisions.
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="py-10 px-4 bg-white border-t mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg text-gray-800">SheLearns</span>
          </div>
          <form className="flex items-center gap-2">
            <input type="email" placeholder="Stay updated with SheLearns!" className="border rounded px-3 py-2" />
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded">
              Subscribe
            </button>
          </form>
          <div className="flex gap-4 text-gray-400 text-xl">
            <a href="#" aria-label="Twitter">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M24 4.557a9.93..." />
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.675..." />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M19 0..." />
              </svg>
            </a>
          </div>
        </div>
        <div className="text-center text-gray-400 text-xs mt-6">© 2023 SheLearns</div>
      </footer>
    </div>
  );
}

export default AIChat;
