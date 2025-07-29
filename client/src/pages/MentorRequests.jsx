import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FiArrowLeft, FiMenu } from 'react-icons/fi'; // Import icons for mobile navigation

function MentorRequests() {
  const { user } = useAuth();
  const [tab, setTab] = useState('requests');
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State for Mobile View Management ---
  const [activePanel, setActivePanel] = useState('list'); // 'list' or 'details'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar

  // Helper to get initials (similar to previous component)
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  };

  // Fetch mentorship requests
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/mentorship/requests');
      setRequests(response.data);
      if (response.data.length > 0) {
        setSelected(response.data[0]);
        setStudentProfile(response.data[0].student);
      } else {
        setSelected(null);
        setStudentProfile(null);
      }
    } catch (err) {
      console.error('Error fetching mentorship requests:', err);
      setError('Failed to load mentorship requests.');
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies as it fetches initial data

  useEffect(() => {
    if (user) { // Only fetch if user is logged in
      fetchRequests();
    } else {
      setLoading(false); // If no user, stop loading and clear data
      setRequests([]);
      setSelected(null);
      setStudentProfile(null);
    }
  }, [user, fetchRequests]); // Depend on user and fetchRequests

  // Update student profile when selected request changes
  useEffect(() => {
    if (selected?.student) {
      setStudentProfile(selected.student);
    } else {
      setStudentProfile(null); // Clear student profile if no selected request or student
    }
  }, [selected]);

  // Handle selecting a request in the list
  const handleSelectRequest = (req) => {
    setSelected(req);
    setActivePanel('details'); // Switch to details view on mobile
  };

  // Use the user object for mentor profile in the sidebar
  const mentorProfile = user;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Mobile Header for Sidebar Toggle */}
      <header className="md:hidden sticky top-0 bg-white shadow-sm z-10 p-4 flex items-center justify-between border-b">
        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 hover:text-yellow-600">
          <FiMenu size={24} />
        </button>
        <span className="font-bold text-lg text-gray-800">SheLearns</span>
        {/* You can add a user avatar/profile link here for mobile */}
        {user && (
           <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-bold text-yellow-600 overflow-hidden">
             {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" /> : getInitials(user.name)}
           </div>
        )}
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full pt-6 pb-2 px-4 gap-6 relative"> {/* Added relative for sidebar positioning */}
        {/* Sidebar - Hidden on small, shown on md+ */}
        {/* Added overlay for mobile when sidebar is open */}
        <div
          className={`${isSidebarOpen ? 'fixed inset-0 bg-black bg-opacity-50 z-20' : 'hidden'} md:hidden`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        <aside className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 left-0 w-64 bg-white z-30 shadow-lg p-4 flex flex-col gap-2 transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:w-56 md:flex-shrink-0 md:shadow-none md:border-r md:p-0 md:pr-2 md:bg-transparent
          lg:w-64 lg:pr-2 lg:bg-transparent
        `}>
          {/* Close button for mobile sidebar */}
          <div className="md:hidden flex justify-end mb-4">
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-600 hover:text-yellow-600">
              <FiArrowLeft size={24} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-1">
            {/* Note: In a real app, these should be <Link> components from react-router-dom */}
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><span>🏠</span>Dashboard</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><span>👤</span>Profile</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><span>💬</span>Chat</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><span>📚</span>Learning</a>
            <a href="#" className="px-4 py-2 rounded font-semibold bg-yellow-100 text-yellow-600 flex items-center gap-2"><span>🤝</span>Mentorship Requests</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><span>⚙️</span>Settings</a>
          </nav>
          {mentorProfile && (
            <div className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-lg font-bold text-yellow-600 overflow-hidden">
                {mentorProfile.avatar ? <img src={mentorProfile.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" /> : getInitials(mentorProfile.name)}
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{mentorProfile.name}</div>
                <div className="text-xs text-gray-500">{mentorProfile.role}</div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col md:flex-row gap-6">
          {/* Requests/Message List Panel */}
          <section className={`
            ${activePanel === 'list' ? 'flex w-full' : 'hidden'}
            md:flex md:w-96 bg-white rounded-xl shadow border border-gray-100 flex-col
          `}>
            <div className="flex border-b">
              <button
                className={`flex-1 px-4 py-3 font-semibold text-sm rounded-t transition ${tab === 'requests' ? 'text-yellow-600 border-b-2 border-yellow-400 bg-yellow-50' : 'text-gray-700 border-b-2 border-transparent hover:bg-yellow-50'}`}
                onClick={() => setTab('requests')}
              >
                Requests ({requests.filter(r => r.status === 'pending').length}) {/* Dynamically show count */}
              </button>
              <button
                className={`flex-1 px-4 py-3 font-semibold text-sm rounded-t transition ${tab === 'messages' ? 'text-yellow-600 border-b-2 border-yellow-400 bg-yellow-50' : 'text-gray-700 border-b-2 border-transparent hover:bg-yellow-50'}`}
                onClick={() => setTab('messages')}
              >
                Messages (0) {/* This is still hardcoded */}
              </button>
            </div>
            {loading ? (
              <div className="text-center text-gray-400 flex-1 flex items-center justify-center">Loading requests...</div>
            ) : error ? (
              <div className="text-center text-red-500 flex-1 flex items-center justify-center p-4">{error}</div>
            ) : requests.length === 0 ? (
              <div className="text-center text-gray-500 flex-1 flex items-center justify-center italic p-4">
                No mentorship requests found.
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {/* Filter requests based on 'tab' if you have messages, or a 'status' */}
                {requests.map((req) => (
                  <div
                    key={req._id} // Changed to _id
                    className={`flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition ${selected?._id === req._id ? 'bg-yellow-50' : 'hover:bg-gray-50'}`} // Changed to _id
                    onClick={() => handleSelectRequest(req)} // Use the new handler for mobile nav
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${req.unread ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-500'}`}>
                      {req.student?.avatar ? <img src={req.student.avatar} alt={req.student.name} className="w-full h-full rounded-full object-cover" /> : getInitials(req.student?.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm truncate">{req.student?.name}</span>
                        {/* Assuming 'unread' status is part of the request object */}
                        {req.status === 'pending' && <span className="w-2 h-2 bg-yellow-400 rounded-full" />}
                        <span className="text-xs text-gray-400 ml-auto">{new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> {/* Use actual timestamp */}
                      </div>
                      <div className="text-xs text-gray-600 truncate font-medium">{req.subject || 'Mentorship Request'}</div>
                      <div className="text-xs text-gray-500 truncate">{req.message || 'New request'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Detail Panel */}
          <section className={`
            ${activePanel === 'details' ? 'flex flex-1 w-full' : 'hidden'}
            md:flex md:flex-1 bg-white rounded-xl shadow border border-gray-100 p-6 flex-col
          `}>
            {/* Mobile Header for Back Button */}
            <div className="md:hidden flex items-center w-full pb-4 border-b mb-4">
              <button onClick={() => setActivePanel('list')} className="text-gray-600 hover:text-yellow-600 mr-3">
                <FiArrowLeft size={24} />
              </button>
              <h2 className="font-semibold text-lg">Request Details</h2>
            </div>

            {selected && studentProfile ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    {studentProfile.avatar ? (
                      <img src={studentProfile.avatar} alt="Student Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-yellow-100 flex items-center justify-center text-2xl font-bold text-yellow-600">
                        {getInitials(studentProfile.name)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">{studentProfile.name}</div>
                    <div className="text-xs text-gray-500">{studentProfile.role || 'Student'}</div>
                    <div className="text-xs text-gray-500">{studentProfile.email}</div> {/* Display email if available */}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="font-bold text-yellow-600">{selected.subject || 'Mentorship Request'}</span>
                  {/* <button className="ml-2 text-xs text-gray-500 underline">Show More</button> */} {/* Removed "Show More" as it had no functionality */}
                </div>
                <div className="text-gray-700 text-sm mb-4 whitespace-pre-line flex-1 overflow-y-auto">{selected.message || 'No message provided.'}</div>
                <div className="text-xs text-gray-400 mb-4">{new Date(selected.createdAt).toLocaleString()}</div> {/* Use actual timestamp */}

                {/* Student Profile Details */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">About</h3>
                    <p className="text-sm text-gray-600">{studentProfile.bio || 'No bio available'}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {(studentProfile.skills || []).map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {(studentProfile.languages || []).map((lang, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"> {/* Changed to gray-100 for languages */}
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {selected.status === 'pending' ? (
                    <>
                      <button className="flex-1 bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition">Decline</button>
                      <button className="flex-1 bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition">Accept</button>
                    </>
                  ) : (
                    <span className="flex-1 text-center text-gray-600 font-semibold mt-4">
                      Request {selected.status}
                    </span>
                  )}
                </div>
                {/* <button className="text-xs text-gray-400 underline self-start mt-4">Report</button> */} {/* Removed Report button as it had no functionality */}
              </>
            ) : (
              <div className="text-gray-400 flex-1 flex items-center justify-center">Select a request to view details.</div>
            )}
          </section>
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

export default MentorRequests;
