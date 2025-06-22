import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BlogPostPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${id}`);
        setBlog(res.data);
      } catch (err) {
        setError('Failed to load the blog post.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!blog) return <div className="text-center p-8">Blog post not found.</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
        {blog.author && (
          <div className="flex items-center mb-6">
            <img src={blog.author.avatar} alt={blog.author.name} className="w-12 h-12 rounded-full mr-4 object-cover" />
            <div>
              <p className="font-semibold text-gray-800">{blog.author.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        )}
        <div className="prose lg:prose-xl max-w-none text-gray-700">
          {blog.content}
        </div>
      </div>
    </div>
  );
}

export default BlogPostPage; 