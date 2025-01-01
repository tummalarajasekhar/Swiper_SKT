import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "https://swiper-skt.onrender.com"; // Update with your backend URL

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Example hardcoded credentials for demo purposes
    const validUsername = "admin";
    const validPassword = "srikrishna#admin@2024";

    if (
      credentials.username === validUsername &&
      credentials.password === validPassword
    ) {
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const FrontendMain = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    content: "",
    image: null,
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (isLoggedIn) fetchPosts();
  }, [isLoggedIn]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (formData.image) data.append("image", formData.image);

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/post/${formData.id}`, data);
      } else {
        await axios.post(`${API_BASE_URL}/upload-image`, data);
      }
      fetchPosts();
      resetForm();
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/post/${id}`);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (post) => {
    setFormData({
      id: post._id,
      title: post.title,
      content: post.content,
      image: null,
    });
    setIsEditMode(true);
  };

  const resetForm = () => {
    setFormData({ id: null, title: "", content: "", image: null });
    setIsEditMode(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="App">
      <h1>Image Management App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={formData.content}
          onChange={handleInputChange}
          required
        ></textarea>
        <input
          type="file"
          name="image"
          onChange={handleInputChange}
          accept="image/*"
        />
        <button type="submit">
          {isEditMode ? "Update Post" : "Create Post"}
        </button>
        {isEditMode && <button onClick={resetForm}>Cancel Edit</button>}
      </form>

      <div>
        {posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                style={{ width: "200px" }}
              />
            )}
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrontendMain;
