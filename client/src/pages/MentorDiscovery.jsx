import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function MentorDiscovery() {
  const { user } = useAuth();
  const [list, setList] = useState([]); // mentors or requests
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(0);
  const [actionMsg, setActionMsg] = useState(null);
  const [studentNotifications, setStudentNotifications] = useState(0);

  // Fetch mentors for students, requests for mentors
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setActionMsg(null);
      try {
        if (user?.role === 'mentor') {
          const res = await axios.get('/api/mentor-requests');
          setList(res.data.filter(r => r.mentor._id === user._id));
          setNotification(res.data.filter(r => r.mentor._id === user._id && r.status === 'pending').length);
          if (res.data.length > 0) setSelected(res.data[0]);
        } else {
          const res = await axios.get('/api/mentors');
          setList(res.data);
          if (res.data.length > 0) setSelected(res.data[0]);
        }
      } catch (err) {
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [user]);

  // When student views a request with status accepted/rejected and notified=false, mark as notified
  useEffect(() => {
    if (user?.role === 'student' && selected && ['accepted','rejected'].includes(selected.status) && !selected.notified) {
      axios.patch(`/api/mentor-requests/${selected._id}/notify`).then(() => {
        setStudentNotifications((n) => Math.max(0, n - 1));
      });
    }
  }, [selected, user]);

  // Request mentorship (student)
  const handleRequest = async (mentorId) => {
    setActionMsg(null);
    try {
      await axios.post('/api/mentor-requests', { mentorId });
      setActionMsg('Mentor request sent!');
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Request failed.');
    }
  };

  // Accept/decline mentorship (mentor)
  const handleRespond = async (requestId, status) => {
    setActionMsg(null);
    try {
      await axios.put(`/api/mentor-requests/${requestId}`, { status });
      setActionMsg(`Request ${status}.`);
      // Refresh list
      const res = await axios.get('/api/mentor-requests');
      setList(res.data.filter(r => r.mentor._id === user._id));
      setNotification(res.data.filter(r => r.mentor._id === user._id && r.status === 'pending').length);
      setSelected(res.data.find(r => r._id === requestId));
    } catch (err) {
      setActionMsg('Action failed.');
    }
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return (parts[0][0] || '') + (parts[1]?.[0] || '');
  };

  // Get profile data for right panel
  let profile = null;
  if (user?.role === 'mentor' && selected) {
    // Show student profile for request
    profile = selected.student;
  } else if (selected) {
    // Show mentor profile
    profile = selected;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 max-w-5xl mx-auto w-full px-4 py-8 gap-6">
        {/* Left: List */}
        <aside className="w-96 bg-white rounded-xl border border-gray-100 shadow flex flex-col p-4 gap-2 h-[70vh] min-h-[400px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold text-lg text-gray-900">
              {user?.role === 'mentor' ? 'Requests' : 'Mentors'}
            </span>
            {user?.role === 'mentor' && notification > 0 && (
              <span className="ml-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">{notification}</span>
            )}
            {user?.role === 'student' && studentNotifications > 0 && (
              <span className="ml-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full">{studentNotifications}</span>
            )}
          </div>
          {loading ? (
            <div className="text-center text-gray-400 flex-1 flex items-center justify-center">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 flex-1 flex items-center justify-center">{error}</div>
          ) : (
            <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {list.map((item) => (
                <li
                  key={item._id}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition ${selected?._id === item._id ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelected(item)}
                >
                  <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center font-bold text-yellow-700 text-lg overflow-hidden">
                    {user?.role === 'mentor'
                      ? (
                        item.student?.avatar ? (
                          <img src={item.student.avatar} alt={item.student.name} className="w-full h-full object-cover rounded-full" />
                        ) : getInitials(item.student?.name)
                      )
                      : (
                        item.avatar ? (
                          <img src={item.avatar} alt={item.name} className="w-full h-full object-cover rounded-full" />
                        ) : getInitials(item.name)
                      )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {user?.role === 'mentor' ? item.student?.name : item.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.role === 'mentor' ? item.status : item.role}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt || item.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
        {/* Right: Profile/Details */}
        <section className="flex-1 flex flex-col bg-white rounded-xl border border-gray-100 shadow min-h-[400px] p-6">
          {profile ? (
            <>
              {/* Student notification alert */}
              {user?.role === 'student' && selected && ['accepted','rejected'].includes(selected.status) && !selected.notified && (
                <div className="mb-4 flex items-center gap-2 text-yellow-600 font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12.001v2.157c0 .538-.214 1.055-.595 1.438L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  Your mentorship request was {selected.status}.
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={profile.avatar || '/avatar.jpg'}
                  alt={profile.name}
                  className="w-14 h-14 rounded-full object-cover border-4 border-yellow-100"
                />
                <div>
                  <div className="font-bold text-lg text-gray-900">{profile.name}</div>
                  <div className="text-xs text-yellow-600 font-semibold">{profile.role}</div>
                  <div className="text-xs text-gray-500">{profile.email}</div>
                </div>
              </div>
              <div className="mb-2 font-semibold text-gray-800">Bio</div>
              <div className="text-gray-700 mb-4 whitespace-pre-line">{profile.bio || 'No bio provided.'}</div>
              <div className="mb-2 font-semibold text-gray-800">Skills</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(profile.skills || []).map((skill, i) => (
                  <span key={i} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">{skill}</span>
                ))}
              </div>
              <div className="mb-2 font-semibold text-gray-800">Languages</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {(profile.languages || []).map((lang, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">{lang}</span>
                ))}
              </div>
              {/* Mentor: show Accept/Decline for requests; Student: show Request button for mentors */}
              {user?.role === 'mentor' && selected && selected.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded"
                    onClick={() => handleRespond(selected._id, 'accepted')}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded"
                    onClick={() => handleRespond(selected._id, 'rejected')}
                  >
                    Decline
                  </button>
                </div>
              )}
              {user?.role === 'student' && selected && (
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded"
                    onClick={() => handleRequest(selected._id)}
                  >
                    Request Mentorship
                  </button>
                </div>
              )}
              {actionMsg && <div className="mt-4 text-center text-yellow-700 font-semibold">{actionMsg}</div>}
            </>
          ) : (
            <div className="text-gray-400 flex-1 flex items-center justify-center">Select a {user?.role === 'mentor' ? 'request' : 'mentor'} to view details.</div>
          )}
        </section>
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

export default MentorDiscovery; 