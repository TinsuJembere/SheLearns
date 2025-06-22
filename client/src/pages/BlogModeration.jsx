import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function BlogModeration() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/blog/pending');
        setPosts(res.data);
      } catch (err) {
        setError('Failed to load pending stories.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [user, actionMsg]);

  const handleAction = async (id, action) => {
    setActionMsg(null);
    setError(null);
    try {
      await axios.put(`/api/blog/${id}/${action}`);
      setActionMsg(`Story ${action}d.`);
    } catch (err) {
      setError('Action failed.');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Admin access only.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Moderate Stories</h1>
        {actionMsg && <div className="mb-4 text-green-600">{actionMsg}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : posts.length === 0 ? (
          <div>No pending stories.</div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded shadow p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <div className="mb-2 text-gray-700 whitespace-pre-line">{post.content}</div>
                <div className="text-sm text-gray-500 mb-2">
                  By {post.author?.name || 'Unknown'} ({post.author?.role || ''})
                  <span className="ml-2">| {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    onClick={() => handleAction(post._id, 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    onClick={() => handleAction(post._id, 'reject')}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogModeration; 