import React, { useState } from 'react'; // Import useState
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu visibility

  // Placeholder logo and profile image
  const logoUrl = '/shelearns.jpg';
  const profileUrl = user?.avatar || '/avatar.jpg';

  // Nav links configuration
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/learning-path', label: 'Chat' },
    { to: '/mentors', label: user?.role === 'mentor' ? 'Mentorship Requests' : 'Mentors' },
    { to: '/blog', label: 'Blog' },
    { to: '/ai-chat', label: 'AI Q&A' },
  ];

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Common JSX for all navigation links (including Admin and Auth)
  const allNavItems = (closeMenuFunction) => (
    <>
      {navLinks.map(link => (
        <Link
          key={link.to}
          to={link.to}
          className={`font-semibold px-3 py-2 rounded transition ${location.pathname === link.to ? 'bg-yellow-400 text-white' : 'text-gray-700 hover:bg-yellow-50'}`}
          onClick={closeMenuFunction} // Close menu on click
        >
          {link.label}
        </Link>
      ))}
      {/* Admin Dashboard link if user is admin */}
      {user?.role === 'admin' && (
        <Link
          to="/admin"
          className={
            'font-medium transition px-3 py-2 rounded ' + // Added padding and rounded for consistency
            (location.pathname === '/admin'
              ? 'text-yellow-500 bg-yellow-50' // Added bg for consistency
              : 'text-gray-800 hover:text-yellow-500 hover:bg-yellow-50')
          }
          onClick={closeMenuFunction} // Close menu on click
        >
          Admin Dashboard
        </Link>
      )}

      {/* Profile or Auth Buttons - Also part of the mobile menu now */}
      <div className="md:hidden flex flex-col items-center gap-3 w-full mt-4 border-t pt-4"> {/* Only show on mobile, add top margin/border */}
        {user ? (
          <Link to="/profile" onClick={closeMenuFunction}>
            <img src={profileUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-yellow-200" /> {/* Larger for mobile */}
          </Link>
        ) : (
          <div className="flex flex-col gap-3 w-full"> {/* Stack buttons vertically on mobile */}
            <Link
              to="/signup"
              className="px-4 py-2 rounded font-semibold bg-yellow-400 text-white hover:bg-yellow-500 transition text-center"
              onClick={closeMenuFunction}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 rounded font-semibold border border-yellow-400 text-yellow-500 hover:bg-yellow-50 transition text-center"
              onClick={closeMenuFunction}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </>
  );

  return (
    <header className="border-b border-black/80 bg-white w-full">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 relative"> {/* Add relative for mobile menu positioning */}
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <img src={logoUrl} alt="SheLearns logo" className="w-7 h-7 rounded" />
          <span className="font-bold text-xl text-gray-900 whitespace-nowrap">SheLearns</span> {/* Ensure no wrap */}
        </div>

        {/* Desktop Navigation Links (Center) */}
        <div className="hidden md:flex flex-grow justify-center"> {/* Use flex-grow and justify-center to push to center */}
          <div className="flex gap-4 items-center">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-semibold px-3 py-2 rounded transition ${location.pathname === link.to ? 'text-yellow-400' : 'text-gray-700 hover:bg-yellow-50'}`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={
                  'font-medium transition px-3 py-2 rounded ' +
                  (location.pathname === '/admin'
                    ? 'text-yellow-500 bg-yellow-50'
                    : 'text-gray-800 hover:text-yellow-500 hover:bg-yellow-50')
                }
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Right Side: Profile or Auth Buttons */}
        <div className="hidden md:flex items-center gap-3"> {/* Hidden on mobile */}
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

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-600 hover:text-yellow-500 focus:outline-none">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* Increased size slightly */}
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Content (Conditionally Rendered) */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg p-4 z-30"> {/* Added shadow-lg, z-30 */}
            <ul className="flex flex-col items-start space-y-4 text-gray-700"> {/* Aligned items to start, added space */}
              {allNavItems(() => setIsOpen(false))} {/* Pass close function to all items */}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;