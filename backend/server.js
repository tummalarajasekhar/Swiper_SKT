// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// File upload with multer
const storage = multer.memoryStorage();  // In-memory storage for uploading images
const upload = multer({ storage: storage });

// MongoDB schema for posts
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  imageUrl: String,
});

const Post = mongoose.model('Post', postSchema);

// CREATE Post (with image upload)
app.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'posts', resource_type: 'image' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Error uploading image', error });
        }

        const post = new Post({
          title: req.body.title,
          content: req.body.content,
          imageUrl: result.secure_url,  // Cloudinary URL
        });

        await post.save();

        res.status(200).json({ message: 'Post uploaded successfully!', post });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

// READ all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

// READ a single post
app.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
});

// UPDATE a post (with image update option)
app.put('/post/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedData = {
      title: req.body.title,
      content: req.body.content,
    };

    if (req.file) {
      // If a new image is uploaded, upload it to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'posts', resource_type: 'image' },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Error uploading image', error });
          }

          updatedData.imageUrl = result.secure_url;  // Cloudinary URL
          await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
          res.status(200).json({ message: 'Post updated successfully!' });
        }
      );
      uploadStream.end(req.file.buffer);
    } else {
      // If no new image, update without it
      await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
      res.status(200).json({ message: 'Post updated successfully!' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
});

// DELETE a post
app.delete('/post/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
});

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
