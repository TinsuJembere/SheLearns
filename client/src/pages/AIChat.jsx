import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiMenu, FiArrowLeft, FiPlus } from 'react-icons/fi'; // Import icons

function AIChat() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error messages
  const { user, token } = useAuth();

  // --- State for Mobile View Management ---
  const [activePanel, setActivePanel] = useState('list'); // 'list' or 'chat'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar

  // Ref for scrolling chat messages to bottom
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversations on component mount
  useEffect(() => {
    if (user && token) {
      loadConversations();
    } else {
      // Clear states if user logs out or token becomes unavailable
      setConversations([]);
      setCurrentConversation(null);
      setMessages([]);
      setActivePanel('list'); // Ensure we're on the list view if logged out
    }
  }, [user, token]);

  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      setMessages(currentConversation.messages || []);
      // On mobile, switch to chat panel when a conversation is selected
      if (window.innerWidth < 768) { // Check for mobile breakpoint
        setActivePanel('chat');
      }
    } else {
      setMessages([]);
    }
  }, [currentConversation]);

  const loadConversations = async () => {
    setError(null); // Clear previous errors
    try {
      const response = await axios.get('http://localhost:5000/api/ai/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
      // Automatically select the first conversation if available after loading
      if (!currentConversation && response.data.length > 0) {
        setCurrentConversation(response.data[0]);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations. Please try again or log in.');
    }
  };

  const createNewChat = async () => {
    setError(null); // Clear previous errors
    // On mobile, switch to chat panel immediately for new chat
    if (window.innerWidth < 768) {
      setActivePanel('chat');
    }

    try {
      // Original logic: Directly make API call and then update state
      const response = await axios.post('http://localhost:5000/api/ai/conversations', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newConversation = {
        _id: response.data.conversationId,
        title: response.data.title,
        messages: [], // Initially empty as per original logic
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setConversations([newConversation, ...conversations]);
      setCurrentConversation(newConversation);
      setMessages([]); // Clears messages for the new chat
    } catch (err) {
      console.error('Error creating new conversation:', err);
      setError('Failed to create new chat. Please ensure you are logged in and try again.');
    }
  };

  const selectConversation = async (conversationId) => {
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(`http://localhost:5000/api/ai/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentConversation(response.data);
      // On mobile, switch to chat panel when a conversation is selected
      if (window.innerWidth < 768) {
        setActivePanel('chat');
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
      setError('Failed to load conversation details. It might have been deleted.');
    }
  };

  const deleteConversation = async (conversationId, e) => {
    e.stopPropagation(); // Prevent selecting the conversation when clicking delete
    setError(null); // Clear previous errors
    try {
      await axios.delete(`http://localhost:5000/api/ai/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setConversations(conversations.filter(conv => conv._id !== conversationId));
      
      if (currentConversation && currentConversation._id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
        setActivePanel('list'); // Go back to list view if current conversation is deleted
      }
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError('Failed to delete conversation.');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    // Ensure input is not empty and user is logged in
    if (!input.trim() || !user) {
        setError("Please log in and type a message to send.");
        return;
    }

    // Original logic: require a current conversation to be selected/created first
    if (!currentConversation) {
        setError("Please click '+ New Chat' to start a conversation, or select an existing one.");
        return;
    }

    const userMsg = {
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    setError(null); // Clear error before new send attempt

    try {
      const res = await axios.post(
        'http://localhost:5000/api/ai/ask',
        {
          question: userMsg.text,
          conversationId: currentConversation._id // Always send with a current conversation ID
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

      // Update the title of the conversation in the list based on AI's response
      // This is crucial if the backend assigns a title after the first message
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv._id === currentConversation._id
            ? { ...conv, title: res.data.conversationTitle || conv.title, updatedAt: new Date() }
            : conv
        )
      );
      // Also update currentConversation state directly
      setCurrentConversation(prev => {
        if (prev && prev._id === currentConversation._id) {
          return {
            ...prev,
            title: res.data.conversationTitle || prev.title,
            updatedAt: new Date(),
            // Ensure messages are also updated in currentConversation for persistence
            messages: [...(prev.messages || []), userMsg, aiMsg]
          };
        }
        return prev;
      });

    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'An error occurred while processing your request. Please try again.';
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
      {/* Mobile Header with Menu Toggle */}
      <header className="md:hidden sticky top-0 bg-white shadow-sm z-10 p-4 flex items-center justify-between border-b">
        {activePanel === 'list' && (
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 hover:text-yellow-600">
            <FiMenu size={24} />
          </button>
        )}
        {activePanel === 'chat' && (
          <button onClick={() => setActivePanel('list')} className="text-gray-600 hover:text-yellow-600">
            <FiArrowLeft size={24} />
          </button>
        )}
        <span className="font-bold text-lg text-gray-800">
          {activePanel === 'list' ? 'Conversations' : (currentConversation?.title || 'AI Chat')}
        </span>
        {activePanel === 'list' && ( // Add new chat button for mobile list view
          <button
            onClick={createNewChat}
            disabled={!user}
            className="bg-yellow-400 text-white p-2 rounded-full hover:bg-yellow-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="New Chat"
          >
            <FiPlus size={20} />
          </button>
        )}
         {activePanel === 'chat' && currentConversation && ( // Add delete button for mobile chat view
          <button
            onClick={(e) => deleteConversation(currentConversation._id, e)}
            className="text-red-500 hover:text-red-700 p-2"
            title="Delete current conversation"
          >
            ×
          </button>
        )}
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full pt-6 pb-2 px-4 gap-6 relative">
        {/* Sidebar - Overlay for mobile */}
        <div
          className={`${isSidebarOpen ? 'fixed inset-0 bg-black bg-opacity-50 z-20' : 'hidden'} md:hidden`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        {/* Sidebar content */}
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 left-0 w-64 bg-white z-30 shadow-lg p-4 flex flex-col gap-4 transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-72 md:shadow-none md:border-r md:p-0 md:pr-2 md:bg-transparent
        `}>
          {/* Close button for mobile sidebar */}
          <div className="md:hidden flex justify-end mb-2">
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-600 hover:text-yellow-600">
              <FiArrowLeft size={24} />
            </button>
          </div>
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
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity ml-2"
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
        <main className={`
          flex-1 flex flex-col bg-white rounded-xl shadow border border-gray-100
          ${activePanel === 'chat' ? 'flex w-full' : 'hidden'}
          md:flex
        `}>
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="font-bold text-lg text-gray-900">AI Learning Companion</h2>
              {currentConversation ? (
                <p className="text-sm text-gray-500 mt-1">
                  {currentConversation.title} • {formatDate(currentConversation.updatedAt)}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">Select a conversation or click '+ New Chat' to begin.</p>
              )}
            </div>
            {/* Display general error messages here */}
            {error && (
              <div className="text-red-500 text-sm font-medium text-right">{error}</div>
            )}
            <div className="text-xs text-gray-400"></div> {/* Placeholder for other info */}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
            {messages.length === 0 && !loading && !currentConversation && (
              <div className="text-center text-gray-500 mt-8">
                <p>Start a conversation with your AI learning companion!</p>
                <p className="text-sm mt-2">Ask questions about programming, get help with projects, or discuss learning strategies.</p>
                {user ? (
                    <p className="text-sm mt-2">Click <span className="font-semibold text-yellow-600">+ New Chat</span> to begin.</p>
                ) : (
                    <p className="text-sm mt-2">Please <Link to="/login" className="underline text-yellow-600 hover:text-yellow-800">log in</Link> to start chatting.</p>
                )}
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
                  <div className="text-xs text-right text-gray-500 mt-1">
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
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </div>

          {/* Chat Input */}
          <div className="border-t px-6 py-4">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={user ? (currentConversation ? "Ask me anything..." : "Please create a new chat or select one...") : "Please log in to start chatting"}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100"
                disabled={!user || loading || !currentConversation} // Disabled if no user or no currentConversation
              />
              <button
                type="submit"
                className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!user || loading || !input.trim() || !currentConversation} // Disabled if no user, loading, empty input, or no currentConversation
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
                <path d="M24 4.557a9.93 9.93 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337 3.1a9.864 9.864 0 0 1-3.127 1.195A4.916 4.916 0 0 0 16.616 2c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.762.127 1.124C7.728 7.89 4.1 6.13 1.671 3.149c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099A4.904 4.904 0 0 1 .964 8.1v.062c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.675 0h-21.35C.597 0 0 .592 0 1.326v21.348C0 23.408.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.408 24 22.674V1.326C24 .592 23.403 0 22.675 0" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76c.97 0 1.75.79 1.75 1.76s-.78 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v5.62z" />
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
