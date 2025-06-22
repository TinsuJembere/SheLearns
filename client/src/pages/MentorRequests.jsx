import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function MentorRequests() {
  const { user } = useAuth();
  const [tab, setTab] = useState('requests');
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/mentorship/requests');
        setRequests(response.data);
        if (response.data.length > 0) {
          setSelected(response.data[0]);
          // Set student profile directly from the request
          setStudentProfile(response.data[0].student);
        }
      } catch (error) {
        console.error('Error fetching mentorship requests:', error);
      }
    };

    fetchRequests();
  }, []);

  // Update student profile when selected request changes
  useEffect(() => {
    if (selected?.student) {
      setStudentProfile(selected.student);
    }
  }, [selected]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="flex flex-1 max-w-7xl mx-auto w-full pt-6 pb-2 px-4 gap-6">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden md:flex flex-col gap-2 pr-2">
          <nav className="flex-1 flex flex-col gap-1">
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><span>🏠</span>Dashboard</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><span>👤</span>Profile</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><span>💬</span>Chat</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><span>📚</span>Learning</a>
            <a href="#" className="px-4 py-2 rounded font-semibold bg-yellow-100 text-yellow-600 flex items-center gap-2"><span>🤝</span>Mentorship Requests</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><span>⚙️</span>Settings</a>
          </nav>
          <div className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-lg font-bold text-yellow-600">
              {mentorProfile.avatar ? <img src={mentorProfile.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" /> : 'MS'}
            </div>
            <div>
              <div className="font-semibold text-gray-800 text-sm">{mentorProfile.name}</div>
              <div className="text-xs text-gray-500">{mentorProfile.role}</div>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col md:flex-row gap-6">
          {/* Requests/Message List */}
          <section className="w-full md:w-96 bg-white rounded-xl shadow border border-gray-100 flex flex-col">
            <div className="flex border-b">
              <button
                className={`flex-1 px-4 py-3 font-semibold text-sm rounded-t transition ${tab === 'requests' ? 'text-yellow-600 border-b-2 border-yellow-400 bg-yellow-50' : 'text-gray-700 border-b-2 border-transparent hover:bg-yellow-50'}`}
                onClick={() => setTab('requests')}
              >
                Requests (2)
              </button>
              <button
                className={`flex-1 px-4 py-3 font-semibold text-sm rounded-t transition ${tab === 'messages' ? 'text-yellow-600 border-b-2 border-yellow-400 bg-yellow-50' : 'text-gray-700 border-b-2 border-transparent hover:bg-yellow-50'}`}
                onClick={() => setTab('messages')}
              >
                Messages (0)
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {mockRequests.map((req) => (
                <div
                  key={req.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b cursor-pointer transition ${selected.id === req.id ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelected(req)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${req.unread ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-500'}`}>
                    {req.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm truncate">{req.name}</span>
                      {req.unread && <span className="w-2 h-2 bg-yellow-400 rounded-full" />}
                      <span className="text-xs text-gray-400 ml-auto">{req.time}</span>
                    </div>
                    <div className="text-xs text-gray-600 truncate font-medium">{req.subject}</div>
                    <div className="text-xs text-gray-500 truncate">{req.preview}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {/* Detail Panel */}
          <section className="flex-1 bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-24 h-24 rounded-full overflow-hidden">
                {studentProfile?.avatar ? (
                  <img src={studentProfile.avatar} alt="Student Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-yellow-100 flex items-center justify-center text-2xl font-bold text-yellow-600">
                    {selected?.initials || 'S'}
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-lg text-gray-900">{selected?.name}</div>
                <div className="text-xs text-gray-500">{studentProfile?.role || 'Student'}</div>
              </div>
            </div>
            <div className="mb-2">
              <span className="font-bold text-yellow-600">{selected?.subject}</span>
              <button className="ml-2 text-xs text-gray-500 underline">Show More</button>
            </div>
            <div className="text-gray-700 text-sm mb-4 whitespace-pre-line">{selected?.message}</div>
            <div className="text-xs text-gray-400 mb-4">2 minutes ago, {selected?.date}</div>
            
            {/* Student Profile Details */}
            <div className="space-y-4">
              {studentProfile && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">About</h3>
                    <p className="text-sm text-gray-600">{studentProfile?.bio || 'No bio available'}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {studentProfile?.skills?.map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {studentProfile?.languages?.map((lang, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded hover:bg-gray-200 transition">Not right now</button>
              <button className="flex-1 bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition">Interested</button>
            </div>
            <button className="text-xs text-gray-400 underline self-start mt-4">Report</button>
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