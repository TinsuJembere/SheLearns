import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function BlogSubmit() {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">You must be logged in to submit a story.</div>;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      await axios.post('/api/blog', form);
      setSuccess('Story submitted for review!');
      setForm({ title: '', content: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Share Your Story</h2>
        {success && <div className="mb-4 text-green-600">{success}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Content</label>
          <textarea name="content" value={form.content} onChange={handleChange} required rows={8} className="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Story'}
        </button>
      </form>
    </div>
  );
}

export default BlogSubmit; 