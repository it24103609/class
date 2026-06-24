import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { apiUrl } from '../config/api';

const AdminBlog = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [published, setPublished] = useState(true);

  if (!user || user.role !== 'admin') {
    return (
      <div className="container section">
        <div className="empty-state">
          <h2 className="card-title">Not authorized</h2>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('published', published);
      if (image) formData.append('image', image);

      await axios.post(apiUrl('/api/blogs'), formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/blog');
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating blog post');
    }
  };

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Admin</span>
          <h1 className="page-heading">Create blog post</h1>
          <p className="page-subheading">A cleaner editor for publishing updates.</p>
        </div>
        <Link to="/admin" className="btn-secondary">Back to dashboard</Link>
      </div>

      <div className="content-panel" style={{ maxWidth: '820px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="stack">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="form-textarea" required />
          </div>
          <div className="form-group">
            <label className="form-label">Cover image</label>
            <input type="file" className="form-input" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </div>
          <label className="badge badge-neutral" style={{ width: 'fit-content' }}>
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Publish immediately
          </label>
          <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>
            Post blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminBlog;
