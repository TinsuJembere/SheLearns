import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  // Placeholder logo and profile image
  const logoUrl = '/shelearns.jpg';
  const profileUrl = user?.avatar || '/avatar.jpg';

  // Nav links
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/learning-path', label: 'Chat' },
    { to: '/mentors', label: user?.role === 'mentor' ? 'Mentorship Requests' : 'Mentors' },
    { to: '/blog', label: 'Blog' },
    { to: '/ai-chat', label: 'AI Q&A' },
  ];

  return (
    <header className="border-b border-black/80 bg-white w-full">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <img src={logoUrl} alt="SheLearns logo" className="w-7 h-7 rounded" />
          <span className="font-bold text-xl text-gray-900">SheLearns</span>
        </div>
        {/* Nav Links */}
        <div className="flex gap-4 items-center">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-semibold px-3 py-2 rounded transition ${location.pathname === link.to ? 'bg-yellow-400 text-white' : 'text-gray-700 hover:bg-yellow-50'}`}
            >
              {link.label}
            </Link>
          ))}
          {/* Admin Dashboard link if user is admin */}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={
                'font-medium transition ' +
                (location.pathname === '/admin'
                  ? 'text-yellow-500'
                  : 'text-gray-800 hover:text-yellow-500')
              }
            >
              Admin Dashboard
            </Link>
          )}
        </div>
        {/* Right Side: Profile or Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/profile">
              <img src={profileUrl} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-yellow-200" />
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-4 py-1.5 rounded font-semibold bg-yellow-400 text-white hover:bg-yellow-500 transition"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded font-semibold border border-yellow-400 text-yellow-500 hover:bg-yellow-50 transition"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar; 