import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const tags = [
  'All',
  'Mentorship',
  'Learning',
  'Career',
  'Coding',
  'Communication',
  'Tech Tips',
];

function BlogList() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const storiesPerPage = 8;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/blog');
        setBlogs(res.data);
      } catch (err) {
        setError('Failed to load blogs.');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchBlogs();

    // WebSocket connection
    const socket = io('https://shelearns.onrender.com', {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      path: '/socket.io'
    });

    // Connection handling
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socket.emit('join-blog-room');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setTimeout(() => {
        socket.connect();
      }, 2000); // Try to reconnect after 2 seconds
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setTimeout(() => {
        socket.connect();
      }, 2000); // Try to reconnect after 2 seconds
    });

    // Connection handling
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socket.emit('join-blog-room');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    // Listen for new blog posts
    socket.on('new-blog-post', () => {
      console.log('Received new blog post event');
      fetchBlogs();
    });

    // Cleanup
    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('new-blog-post');
    };
  }, []);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitSuccess(null);
    setSubmitError(null);
    try {
      await axios.post('/api/blog', form);
      setSubmitSuccess('Story submitted for review!');
      setForm({ title: '', content: '' });
      // Refresh blogs
      const res = await axios.get('/api/blog');
      setBlogs(res.data);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const paginatedBlogs = blogs.slice((page - 1) * storiesPerPage, page * storiesPerPage);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-2">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SheLearns Stories</h1>
        <p className="text-gray-600 mb-6 max-w-2xl">Dive into inspiring personal journeys, valuable mentor insights, and captivating stories from our vibrant tech community.</p>
      </div>

      {/* Blog Submission Form */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        {user ? (
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded shadow-md w-full mb-6">
            <h2 className="text-xl font-bold mb-4 text-center">Share Your Story</h2>
            {submitSuccess && <div className="mb-4 text-green-600">{submitSuccess}</div>}
            {submitError && <div className="mb-4 text-red-600">{submitError}</div>}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <input type="text" name="title" value={form.title} onChange={handleFormChange} required className="w-full border rounded px-3 py-2" />
            </div>
            <div className="mb-6">
              <label className="block mb-1 font-medium">Content</label>
              <textarea name="content" value={form.content} onChange={handleFormChange} required rows={5} className="w-full border rounded px-3 py-2" />
            </div>
            <button type="submit" className="w-full bg-yellow-400 text-white py-2 rounded font-semibold hover:bg-yellow-500 transition" disabled={submitLoading}>
              {submitLoading ? 'Submitting...' : 'Submit Story'}
            </button>
          </form>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded p-4 text-center mb-6">Log in to share your story!</div>
        )}
      </div>

      {/* Blog Posts */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="grid gap-8">
          {loading ? (
            <p>Loading blogs...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            paginatedBlogs.map(blog => (
              <div key={blog._id} className="flex items-center bg-white rounded-lg shadow-md overflow-hidden">
                {blog.author && blog.author.avatar && (
                  <img src={blog.author.avatar} alt={blog.author.name} className="w-48 h-48 object-cover" />
                )}
                <div className="p-6">
                  <span className="text-sm font-semibold text-gray-500 bg-gray-100 py-1 px-3 rounded-full">Student Journeys</span>
                  <h2 className="text-2xl font-bold my-2 text-gray-900">{blog.title}</h2>
                  <p className="text-gray-700 mb-4">{blog.content.substring(0, 150)}...</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <Link to={`/blog/${blog._id}`} className="text-yellow-500 font-semibold hover:underline">Read More &rarr;</Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 mb-8 flex justify-center">
        {Array.from({ length: Math.ceil(blogs.length / storiesPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 mx-1 rounded ${page === i + 1 ? 'bg-yellow-400 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* CTA Banner */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row items-center bg-yellow-100">
          <div className="flex-1 p-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Unlock More Stories & Insights!</h3>
            <p className="text-gray-700 mb-4">Join our newsletter for updates, inspiration, and community activities delivered straight to your inbox.</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="border rounded px-3 py-2" />
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded">Subscribe</button>
            </form>
          </div>
          <div className="flex-1 min-w-[200px] h-40 md:h-full relative flex items-end justify-end">
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80" alt="CTA" className="w-32 h-40 object-contain object-bottom" />
          </div>
        </div>
      </section>

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

export default BlogList; 