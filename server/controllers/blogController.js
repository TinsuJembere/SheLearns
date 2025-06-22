const BlogPost = require('../models/BlogPost');
const User = require('../models/User');

// Submit a new blog post (auto-approved)
exports.submitPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required.' });
    const post = new BlogPost({ 
      title, 
      content, 
      author: req.user.userId,
      status: 'approved' // Automatically approve posts
    });
    await post.save();
    res.status(201).json({ message: 'Blog post created successfully.', post });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all blog posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .populate('author', 'name role avatar')
      .sort('-createdAt');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get a single blog post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'name role avatar');
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update blog post
exports.updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required.' });
    
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this post.' });
    }

    post.title = title;
    post.content = content;
    await post.save();
    
    res.json({ message: 'Post updated successfully.', post });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete blog post
exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }
    
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};