import { useState } from 'react';
import { FiChevronRight, FiUser, FiMessageCircle, FiBookOpen, FiSettings, FiEdit2 } from 'react-icons/fi';

const user = {
  name: 'Amina',
  avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
};

const stats = [
  { label: 'Learning Hours', value: '120+', icon: '⏰' },
  { label: 'Pathways Completed', value: '3', icon: '🎓' },
  { label: 'Badges Earned', value: '8', icon: '🏅' },
];

const mentor = {
  name: 'Dr. Aisha Omar',
  avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  status: 'Connected',
  progress: 73,
};

const learning = [
  {
    title: 'Web Development Basics',
    desc: 'Building websites with HTML, CSS, JS',
    progress: 60,
  },
  {
    title: 'Data Science Fundamental',
    desc: 'Python, Pandas, Data Analysis',
    progress: 40,
  },
  {
    title: 'Cybersecurity Essentials',
    desc: 'Protecting yourself online',
    progress: 12,
  },
];

const chats = [
  { name: 'Mentor Sarah', avatar: 'https://randomuser.me/api/portraits/women/50.jpg', last: '2m ago' },
  { name: 'Fatima Zahra', avatar: 'https://randomuser.me/api/portraits/women/51.jpg', last: '7m ago' },
  { name: 'Nia Makena', avatar: 'https://randomuser.me/api/portraits/women/52.jpg', last: '12m ago' },
];

const highlights = [
  { title: 'My Journey from Village to Coder', author: 'Aisha Aden', time: '2h ago' },
  { title: 'How SheLearns Changed My Career Path', author: 'Fatima Zahra', time: '5h ago' },
  { title: 'Building My First AI Bot with SheLearns', author: 'Nia Makena', time: '1d ago' },
];

const events = [
  { title: 'Mentor Session with Dr. Aisha', date: 'Mar 10, 4:00pm' },
  { title: 'Intro to Python Workshop', date: 'Mar 12, 6:00pm' },
  { title: 'SheLearns Community Meeting', date: 'Mar 15, 5:00pm' },
];

export default function Dashboard() {
  const [sidebarOpen] = useState(true);
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="flex flex-1 max-w-7xl mx-auto w-full pt-6 pb-2 px-4 gap-6">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden md:flex flex-col gap-2 pr-2">
          <nav className="flex-1 flex flex-col gap-1">
            <a href="#" className="px-4 py-2 rounded font-semibold bg-yellow-100 text-yellow-600 flex items-center gap-2"><FiChevronRight />Dashboard</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><FiUser />Profile</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><FiMessageCircle />Chat</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><FiBookOpen />Learning</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><FiSettings />Settings</a>
          </nav>
          <div className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow">
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-gray-800 text-sm">{user.name}</div>
              <div className="text-xs text-gray-500">Student</div>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Welcome & Switch View */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name} <span className="inline-block">👋</span></h1>
            <button className="bg-yellow-50 border border-yellow-400 text-yellow-600 font-semibold px-4 py-1.5 rounded hover:bg-yellow-100 transition text-sm">Switch to Mentor View</button>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col items-center">
                <span className="text-2xl mb-1">{stat.icon}</span>
                <span className="font-bold text-2xl text-gray-900 mb-1">{stat.value}</span>
                <span className="text-xs text-gray-500 font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
          {/* Mentor & Learning */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mentor Card */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-2">
                <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">Your Mentor</div>
                  <div className="text-sm text-gray-700 font-bold">{mentor.name}</div>
                  <span className="text-xs text-green-600 font-semibold">{mentor.status}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-2">Mentorship Progress</div>
              <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                <div className="h-2 bg-yellow-400 rounded-full" style={{ width: mentor.progress + '%' }} />
              </div>
              <div className="text-xs text-gray-500 mb-4">{mentor.progress}% Completed</div>
              <div className="flex gap-2">
                <button className="flex-1 bg-yellow-50 border border-yellow-400 text-yellow-600 font-semibold px-3 py-1.5 rounded hover:bg-yellow-100 transition text-xs">Manage Mentor</button>
                <button className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded hover:bg-gray-50 transition text-xs">View Mentor Profile</button>
              </div>
            </div>
            {/* My Learning */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">My Learning</span>
                <button className="text-xs text-yellow-500 font-semibold hover:underline">View All</button>
              </div>
              <div className="flex flex-col gap-3">
                {learning.map((item, i) => (
                  <div key={i} className="bg-yellow-50 rounded-lg p-3 flex flex-col gap-1">
                    <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500 mb-1">{item.desc}</div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-1">
                      <div className="h-2 bg-yellow-400 rounded-full" style={{ width: item.progress + '%' }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Progress: {item.progress}%</span>
                      <button className="bg-yellow-400 text-white font-semibold px-3 py-1 rounded text-xs hover:bg-yellow-500 transition">Continue Pathway</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Lower Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recent Chats */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col">
              <div className="font-semibold text-gray-800 mb-2">Recent Chats</div>
              <div className="flex flex-col gap-2">
                {chats.map((chat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={chat.avatar} alt={chat.name} className="w-8 h-8 rounded-full object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm">{chat.name}</div>
                      <div className="text-xs text-gray-400">{chat.last}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Community Highlights */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">Community Highlights</span>
                <button className="text-xs text-yellow-500 font-semibold hover:underline">View All</button>
              </div>
              <div className="flex flex-col gap-2">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{h.title}</span>
                    <span className="text-xs text-gray-400">by {h.author} • {h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Events & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col">
              <div className="font-semibold text-gray-800 mb-2">Upcoming Events</div>
              <div className="flex flex-col gap-2">
                {events.map((e, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-sm">{e.title}</span>
                    <span className="text-xs text-gray-400">{e.date}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col md:col-span-2">
              <div className="font-semibold text-gray-800 mb-2">Quick Actions</div>
              <div className="flex gap-2 flex-wrap">
                <button className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition text-xs">Connect with a Mentor</button>
                <button className="bg-white border border-yellow-400 text-yellow-600 font-semibold px-4 py-2 rounded hover:bg-yellow-50 transition text-xs">Update Profile</button>
              </div>
            </div>
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