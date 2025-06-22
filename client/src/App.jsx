import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MentorDiscovery from './pages/MentorDiscovery';
import AIChat from './pages/AIChat';
import MentorRequests from './pages/MentorRequests';
import Chats from './pages/Chats';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import BlogList from './pages/BlogList';
import BlogSubmit from './pages/BlogSubmit';
import BlogModeration from './pages/BlogModeration';
import BlogPostPage from './pages/BlogPostPage';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/mentors" element={<MentorDiscovery />} />
          <Route path="/learning-path" element={<Chats />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/mentor-requests" element={<MentorRequests />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/submit" element={<BlogSubmit />} />
          <Route path="/blog/moderate" element={<BlogModeration />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
