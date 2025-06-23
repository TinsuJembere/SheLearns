import { FiChevronRight, FiUsers, FiFileText, FiSettings, FiUserCheck, FiUserX, FiUser, FiCheckCircle, FiAlertTriangle, FiXCircle, FiDatabase, FiServer } from 'react-icons/fi';

const admin = {
  name: 'Admin User',
  avatar: '/avatar.jpg',
};

const stats = [
  { label: 'Total Users', value: '1,250', desc: 'Across all roles' },
  { label: 'Active Mentors', value: '320', desc: 'Currently mentoring' },
  { label: 'Learning Paths Engaged', value: '580', desc: 'Students actively learning' },
  { label: 'New Sign-ups Today', value: '15', desc: 'Including Students & Mentors' },
];

const userStats = {
  total: 1250,
  active: 320,
  newToday: 15,
};

const moderation = {
  flagged: 7,
};

const recentActivity = [
  { text: 'Mentor Sarah approved a new blog post.', time: '10 mins ago' },
  { text: 'User Amina completed "Web Dev Basics" pathway.', time: '30 mins ago' },
  { text: 'Blog story "My Journey to Tech" was approved.', time: '2 hours ago' },
  { text: 'New learning pathway "Web Dev Basics" added.', time: '3 hours ago' },
  { text: 'User Fatima Zahra joined as a mentor.', time: '4 hours ago' },
  { text: 'User Nia Makena completed "Communication in Tech".', time: 'yesterday' },
];

const userStatus = [
  { name: 'Amina Yusuf', status: 'active' },
  { name: 'Fatima Zahra', status: 'active' },
  { name: 'Nia Makena', status: 'warning' },
  { name: 'Lina Devi', status: 'banned' },
];

const systemHealth = [
  { label: 'Database Status', status: 'Operational', icon: <FiDatabase />, color: 'text-green-600' },
  { label: 'Server Status', status: 'Operational', icon: <FiServer />, color: 'text-green-600' },
  { label: 'Error Level', status: 'Low', icon: <FiAlertTriangle />, color: 'text-yellow-500' },
];

export default function AdminDashboard() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="flex flex-1 max-w-7xl mx-auto w-full pt-6 pb-2 px-4 gap-6">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden md:flex flex-col gap-2 pr-2">
          <nav className="flex-1 flex flex-col gap-1">
            <a href="#" className="px-4 py-2 rounded font-semibold bg-yellow-100 text-yellow-600 flex items-center gap-2"><FiChevronRight />Dashboard</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><FiUsers />Users</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><FiFileText />Content</a>
            <a href="#" className="px-4 py-2 rounded font-medium text-gray-700 hover:bg-yellow-50 flex items-center gap-2"><FiSettings />Settings</a>
          </nav>
          <div className="mt-auto flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow">
            <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="font-semibold text-gray-800 text-sm">{admin.name}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-gray-600 max-w-2xl">Welcome to the SheLearns Admin Panel. Here you can manage users, moderate content, and oversee platform performance to ensure a safe and empowering environment.</p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-2">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col items-center">
                <span className="font-bold text-2xl text-gray-900 mb-1">{stat.value}</span>
                <span className="text-xs text-gray-500 font-semibold mb-1">{stat.label}</span>
                <span className="text-xs text-gray-400">{stat.desc}</span>
              </div>
            ))}
          </div>
          {/* User Management & Moderation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* User Management */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">User Management</span>
                <button className="text-xs text-yellow-500 font-semibold hover:underline">View All Users</button>
              </div>
              <div className="flex gap-8 mb-2">
                <div>
                  <div className="font-bold text-lg text-gray-900">{userStats.total}</div>
                  <div className="text-xs text-gray-500">Total Registered Users</div>
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">{userStats.active}</div>
                  <div className="text-xs text-gray-500">Active Mentors</div>
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">{userStats.newToday}</div>
                  <div className="text-xs text-gray-500">New Sign-ups Today</div>
                </div>
              </div>
            </div>
            {/* Content Moderation */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col items-center justify-center">
              <span className="font-semibold text-gray-800 mb-2">Content Moderation</span>
              <div className="text-4xl text-yellow-500 font-bold mb-1">{moderation.flagged}</div>
              <div className="text-xs text-gray-500 mb-2">Stories pending review</div>
              <button className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition text-xs">Review Posts</button>
            </div>
          </div>
          {/* Activity & User Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col md:col-span-2">
              <span className="font-semibold text-gray-800 mb-2">Recent Activity</span>
              <ul className="flex flex-col gap-1 text-sm">
                {recentActivity.map((a, i) => (
                  <li key={i} className="flex justify-between text-gray-700">
                    <span>{a.text}</span>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* User Status Overview */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col">
              <span className="font-semibold text-gray-800 mb-2">User Status Overview</span>
              <ul className="flex flex-col gap-2">
                {userStatus.map((u, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    <span className="flex-1 text-gray-700 text-sm">{u.name}</span>
                    {u.status === 'active' && <FiCheckCircle className="text-green-500" title="Active" />}
                    {u.status === 'warning' && <FiAlertTriangle className="text-yellow-500" title="Warning" />}
                    {u.status === 'banned' && <FiXCircle className="text-red-500" title="Banned" />}
                  </li>
                ))}
              </ul>
              <button className="text-xs text-yellow-500 font-semibold hover:underline mt-2">View All Users</button>
            </div>
          </div>
          {/* System Health */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow border border-gray-100 p-5 flex flex-col">
              <span className="font-semibold text-gray-800 mb-2">System Health</span>
              <ul className="flex flex-col gap-2">
                {systemHealth.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className={s.color}>{s.icon}</span>
                    <span className="flex-1 text-gray-700 text-sm">{s.label}</span>
                    <span className={`text-xs font-semibold ${s.color}`}>{s.status}</span>
                  </li>
                ))}
              </ul>
              <button className="text-xs text-yellow-500 font-semibold hover:underline mt-2">View System Logs</button>
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