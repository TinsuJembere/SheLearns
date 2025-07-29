import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';
import { FiMail, FiLinkedin, FiGithub, FiSearch, FiBookmark, FiArrowLeft } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Chats() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // --- State for Mobile View Management ---
  // Controls which of the three main panels is visible on mobile ('conversations', 'chat', or 'profile')
  const [activePanel, setActivePanel] = useState('conversations');

  // Effect to set initial selected chat and panel if conversations exist
  useEffect(() => {
    if (user) {
      const fetchConvs = async () => {
        setLoadingConvs(true);
        setError(null);
        try {
          const res = await axios.get('/api/chats');
          setConversations(res.data);
          // If no chat is selected and conversations exist, select the first one
          if (res.data.length > 0 && !selectedChatId) {
            setSelectedChatId(res.data[0]._id);
            // On initial load, keep conversations panel active on mobile
            // If you want to auto-open the first chat, change this to setActivePanel('chat');
          }
        } catch (err) {
          setError('Failed to load conversations');
        } finally {
          setLoadingConvs(false);
        }
      };
      fetchConvs();
    } else {
      setLoadingConvs(false);
      setConversations([]);
      setSelectedChatId(null); // Clear selected chat if user logs out
      setActivePanel('conversations'); // Reset panel view
    }
  }, [user]); // Only re-run when user changes

  // Callback to refetch conversations (used after starting a new chat)
  const refetchConversations = useCallback(async () => {
    setLoadingConvs(true);
    setError(null);
    try {
      const res = await axios.get('/api/chats');
      setConversations(res.data);
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoadingConvs(false);
    }
  }, []);


  // Fetch users for search (only once on component mount)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/profile/users');
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users for search:", err);
        // Handle error gracefully, e.g., set an error state
      }
    };
    fetchUsers();
  }, []);

  const handleSelectChat = async (chatId) => {
    if (selectedChatId === chatId) {
      // If same chat is clicked, and we're on mobile, and the profile panel is open, go back to chat
      if (activePanel === 'profile') {
        setActivePanel('chat');
      }
      return; // No need to re-fetch if already selected
    }

    setSelectedChatId(chatId);
    setActivePanel('chat'); // Switch to chat view on mobile
    // Mark as read and update UI instantly
    try {
      await axios.post(`/api/chats/${chatId}/read`);
      setConversations(prev =>
        prev.map(c => c._id === chatId ? { ...c, unreadCount: 0 } : c)
      );
    } catch (err) {
      console.error("Failed to mark chat as read", err);
    }
  };

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]); // Clear messages if no chat is selected
      return;
    }
    const fetchMsgs = async () => {
      setLoadingMsgs(true);
      setError(null);
      try {
        const res = await axios.get(`/api/chats/${selectedChatId}`);
        setMessages(res.data);
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setLoadingMsgs(false);
      }
    };
    fetchMsgs();
  }, [selectedChatId]); // Re-fetch messages when selectedChatId changes

  // Helper: get the other participant (not the logged-in user)
  const getOtherParticipant = useCallback((chat) => {
    if (!chat || !user) return null;

    const isSelfChat =
      (chat.participants.length === 1 && chat.participants[0]?._id === user._id) ||
      (chat.participants.length === 2 && chat.participants[0]?._id === user._id && chat.participants[1]?._id === user._id);

    if (isSelfChat) {
      return chat.participants[0]; // For any self-chat, the participant is the user.
    }

    // For a normal 2-person chat
    return chat.participants.find((p) => p._id !== user._id);
  }, [user]);

  // Prepare sidebar conversations
  const sidebarConvs = conversations.map((chat) => {
    const isSelfChat =
      (chat.participants.length === 1 && chat.participants[0]?._id === user?._id) ||
      (chat.participants.length === 2 && chat.participants[0]?._id === user?._id && chat.participants[1]?._id === user?._id);
    const other = getOtherParticipant(chat);

    return {
      _id: chat._id,
      name: isSelfChat ? 'Saved Messages' : other?.name || 'Unknown',
      avatar: isSelfChat ? (user?.avatar || '/avatar.jpg') : (other?.avatar || '/avatar.jpg'),
      role: isSelfChat ? 'You' : (other?.role || ''),
      lastMessage: chat.lastMessage || (chat.messages?.[0]?.fileUrl ? `File: ${chat.messages[0].fileName}` : chat.messages?.[0]?.text) || 'No messages yet',
      time: new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unreadCount: chat.unreadCount || 0,
      isSelfChat,
    };
  });

  // Prepare selected conversation for ChatWindow
  const selectedChat = conversations.find((c) => c._id === selectedChatId);
  const isSelfChat = selectedChat ? (
    (selectedChat.participants.length === 1 && selectedChat.participants[0]?._id === user?._id) ||
    (selectedChat.participants.length === 2 && selectedChat.participants[0]?._id === user?._id && selectedChat.participants[1]?._id === user?._id)
  ) : false;
  const other = getOtherParticipant(selectedChat);

  const chatWindowData = selectedChat
    ? {
        name: isSelfChat ? 'Saved Messages' : (other?.name || 'Unknown'),
        avatar: isSelfChat ? (user?.avatar || '/avatar.jpg') : (other?.avatar || '/avatar.jpg'), // Ensure avatar is correct
        role: isSelfChat ? 'You' : (other?.role || ''),
        messages: messages.map((msg) => {
          const senderId = msg.sender?._id || msg.sender;
          const isSentByCurrentUser = senderId === user?._id;

          return {
            ...msg,
            id: msg._id,
            isSentByCurrentUser: isSentByCurrentUser,
          };
        }),
      }
    : null;

  // Search logic
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const q = search.trim().toLowerCase();
    setSearchResults(
      users.filter(
        (u) =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
      )
    );
  }, [search, users]);

  // Start chat with user
  const handleStartChat = async (userId) => {
    try {
      const res = await axios.post('/api/chats', { userId });
      const chat = res.data;
      await refetchConversations(); // Refetch conversations to get fully populated participants
      setSelectedChatId(chat._id);
      setSearch('');
      setSearchResults([]);
      setActivePanel('chat'); // Switch to chat view on mobile
    } catch (err) {
      alert(err.response?.data?.message || 'Could not start chat');
    }
  };

  // Add new message to state
  const handleAddNewMessage = (newMessage) => {
    // Ensure the message belongs to the currently selected chat
    if (newMessage.chat === selectedChatId) {
      const messageWithTimestamp = {
        ...newMessage,
        createdAt: newMessage.createdAt || new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, messageWithTimestamp]);
    }
    // Also, update the lastMessage in the conversations list
    setConversations(prevConvs =>
      prevConvs.map(conv => {
        if (conv._id === newMessage.chat) {
          return {
            ...conv,
            lastMessage: newMessage.fileUrl ? `File: ${newMessage.fileName}` : newMessage.text,
            updatedAt: newMessage.createdAt,
          };
        }
        return conv;
      })
    );
  };

  const handleUpdateMessage = (updatedMessage) => {
    setMessages(prev => prev.map(m => m._id === updatedMessage._id ? updatedMessage : m));
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(prev => prev.filter(m => m._id !== messageId));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content Area - max width and central alignment */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 py-6 gap-6">

        {/* This div holds the three main panels (Conversations, Chat, Profile) */}
        {/* On mobile, it will effectively show one panel at a time, each taking full width. */}
        {/* On desktop, it will flex into three columns. */}
        {/* Changed h-[70vh] to flex-1 to allow it to fill available height and scroll if needed */}
        <div className="flex flex-1 gap-6 min-h-[400px]">

          {/* Sidebar: Conversations List */}
          {/* On mobile: displayed if activePanel is 'conversations', takes full width */}
          {/* On desktop (md+): always displayed, fixed width w-72 */}
          <aside className={`${activePanel === 'conversations' ? 'flex w-full' : 'hidden'} md:flex md:w-72 bg-white rounded-xl border border-gray-100 shadow flex-col p-4 gap-2`}>
            <h2 className="font-semibold text-lg mb-2">Conversations</h2>
            {/* Search bar */}
            <div className="mb-3 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={user ? "Search users..." : "Log in to search for users"}
                className="w-full border rounded px-3 py-2 pr-8 disabled:bg-gray-100"
                disabled={!user}
              />
              <FiSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              {user && searching && searchResults.length > 0 && (
                <ul className="absolute z-20 left-0 right-0 bg-white border rounded shadow mt-1 max-h-56 overflow-y-auto">
                  {searchResults.map((u) => (
                    <li
                      key={u._id}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-yellow-50 cursor-pointer"
                      onClick={() => handleStartChat(u._id)}
                    >
                      <img src={u.avatar || '/avatar.jpg'} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-medium text-gray-900">{u._id === user._id ? 'Saved Messages (You)' : u.name}</span>
                      <span className="text-xs text-gray-500">{u.email}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {loadingConvs ? (
              <div className="text-gray-400 text-center flex-1 flex items-center justify-center">Loading...</div>
            ) : !user ? (
              <div className="text-gray-500 text-center flex-1 flex items-center justify-center italic p-4"> {/* Added p-4 for padding to prevent overflow */}
                <p>
                  <Link to="/login" className="underline text-yellow-600 hover:text-yellow-800">Log in</Link> to see your conversations.
                </p>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-gray-400 text-center flex-1 flex items-center justify-center italic">
                No conversations yet. Start one by searching for a user.
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {sidebarConvs.map((conv) => (
                  <li
                    key={conv._id}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${selectedChatId === conv._id ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}
                    onClick={() => handleSelectChat(conv._id)}
                  >
                    {conv.isSelfChat ? (
                      <span className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-2xl text-yellow-500"><FiBookmark /></span>
                    ) : (
                      <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{conv.name}</div>
                      <div className="text-xs text-gray-500 truncate">{conv.lastMessage}</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400">{conv.time}</span>
                      {conv.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-400 text-white mt-1">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* Main Chat Area */}
          {/* On mobile: displayed if activePanel is 'chat', takes full width */}
          {/* On desktop (md+): always displayed, takes remaining flexible space */}
          <section className={`${activePanel === 'chat' ? 'flex flex-1 w-full' : 'hidden'} md:flex md:flex-1 flex-col bg-white rounded-xl border border-gray-100 shadow min-h-[400px]`}>
            {/* Mobile Chat Header with Back Button and Profile Picture (clickable) */}
            <div className="md:hidden flex items-center justify-between p-4 border-b">
              <button onClick={() => setActivePanel('conversations')} className="text-gray-600 hover:text-yellow-600 mr-3">
                <FiArrowLeft size={24} />
              </button>
              {chatWindowData && (
                <>
                  {/* The single profile picture that is now clickable */}
                  {selectedChatId && other && !isSelfChat ? (
                    <button
                      onClick={() => setActivePanel('profile')}
                      className="flex-1 flex items-center gap-2 p-1 -ml-1 rounded-full hover:bg-gray-100 transition-colors" // Added padding and negative margin for better click area/alignment
                    >
                      <img src={chatWindowData.avatar} alt={chatWindowData.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-semibold text-gray-900">{chatWindowData.name}</span>
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center gap-2">
                      <img src={chatWindowData.avatar} alt={chatWindowData.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="font-semibold text-gray-900">{chatWindowData.name}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {user ? (
              selectedChatId && chatWindowData ? (
                <ChatWindow
                  chatId={selectedChatId}
                  loading={loadingMsgs}
                  {...chatWindowData}
                  onAddNewMessage={handleAddNewMessage}
                  onUpdateMessage={handleUpdateMessage}
                  onDeleteMessage={handleDeleteMessage}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 p-4"> {/* Added p-4 */}
                  <p>Select a conversation to start chatting.</p>
                </div>
              )
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 p-4"> {/* Added p-4 */}
                <p>
                  <Link to="/login" className="underline text-yellow-600 hover:text-yellow-800">Log in</Link> to view your chats.
                </p>
              </div>
            )}
          </section>

          {/* Profile Panel: Show other participant details */}
          {/* On mobile: displayed if activePanel is 'profile', takes full width */}
          {/* On desktop (md+): always displayed, fixed width w-72 */}
          <aside className={`${activePanel === 'profile' ? 'flex w-full' : 'hidden'} md:flex md:w-72 bg-white rounded-xl border border-gray-100 shadow flex-col items-center p-6 min-h-[400px]`}>
            {/* Mobile Profile Panel Header with Back Button */}
            <div className="md:hidden flex items-center w-full pb-4 border-b mb-4">
              <button onClick={() => setActivePanel('chat')} className="text-gray-600 hover:text-yellow-600 mr-3">
                <FiArrowLeft size={24} />
              </button>
              <h2 className="font-semibold text-lg">Profile Details</h2>
            </div>

            {other ? (
              <>
                <img src={isSelfChat ? (user?.avatar || '/avatar.jpg') : (other.avatar || '/avatar.jpg')} alt={isSelfChat ? 'You' : other.name} className="w-20 h-20 rounded-full object-cover mb-3" />
                <div className="font-bold text-lg text-gray-900 mb-1">{isSelfChat ? 'Saved Messages' : other.name}</div>
                <div className="text-xs text-yellow-600 font-semibold mb-2">{isSelfChat ? 'You' : other.role}</div>
                <div className="text-sm text-gray-600 mb-4 text-center">{isSelfChat ? user?.bio : (other.bio || 'No bio available.')}</div>
                <div className="flex gap-3 mb-4">
                  <a href={`mailto:${isSelfChat ? user?.email : other.email}`} className="text-gray-400 hover:text-yellow-500" title="Email"><FiMail size={20} /></a>
                  <a href={(isSelfChat ? user?.linkedin : other.linkedin) || '#'} className="text-gray-400 hover:text-yellow-500" title="LinkedIn" target="_blank" rel="noopener noreferrer"><FiLinkedin size={20} /></a>
                  <a href={(isSelfChat ? user?.github : other.github) || '#'} className="text-gray-400 hover:text-yellow-500" title="GitHub" target="_blank" rel="noopener noreferrer"><FiGithub size={20} /></a>
                </div>
                <div className="w-full">
                  <div className="font-semibold text-xs text-gray-500 mb-1">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {((isSelfChat ? user?.skills : other.skills) || ['Mentorship']).map((skill) => (
                      <span key={skill} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">{skill}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-400">Select a conversation</div>
            )}
          </aside>
        </div>
      </div>
      {/* Footer */}
      <footer className="py-10 px-4 bg-white border-t mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg text-gray-800">SheLearns</span>
          </div>
          <form className="flex items-center gap-2">
            <input type="email" placeholder="Stay updated with SheLearns!" className="border rounded px-3 py-2" />
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded">Subscribe</button>
          </form>
          <div className="flex gap-4 text-gray-400 text-xl">
            <a href="#" aria-label="Twitter"><svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337 3.1a9.864 9.864 0 0 1-3.127 1.195A4.916 4.916 0 0 0 16.616 2c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.762.127 1.124C7.728 7.89 4.1 6.13 1.671 3.149c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099A4.904 4.904 0 0 1 .964 8.1v.062c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.927-.086.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z" /></svg></a>
            <a href="#" aria-label="Facebook"><svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.675 0h-21.35C.597 0 0 .592 0 1.326v21.348C0 23.408.597 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.403 24 24 23.408 24 22.674V1.326C24 .592 23.403 0 22.675 0" /></svg></a>
            <a href="#" aria-label="LinkedIn"><svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76c.97 0 1.75.79 1.75 1.76s-.78 1.76-1.75 1.76zm15.25 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v5.62z" /></svg></a>
          </div>
        </div>
        <div className="text-center text-gray-400 text-xs mt-6">© 2023 SheLearns</div>
      </footer>
    </div>
  );
}
