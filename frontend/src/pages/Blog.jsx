import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl, assetUrl } from '../config/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(apiUrl('/api/blogs'))
      .then((response) => setBlogs(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Blog</span>
          <h1 className="page-heading">Ideas, updates, and learning tips.</h1>
          <p className="page-subheading">A cleaner reading layout that adapts nicely to mobile screens.</p>
        </div>
      </div>

      {blogs.length === 0 ? (
        <div className="empty-state">
          <p className="card-copy">No blog posts found.</p>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <article key={blog._id} className="card card-surface">
              {blog.image && (
                <img
                  src={assetUrl(blog.image)}
                  alt={blog.title}
                  className="card-media"
                />
              )}
              <div className="card-body stack">
                <div className="toolbar-actions" style={{ justifyContent: 'space-between' }}>
                  <span className="badge badge-neutral">By {blog.author?.name || 'Admin'}</span>
                  <span className="text-muted">{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="card-title">{blog.title}</h2>
                <p className="card-copy">{blog.content.slice(0, 150)}{blog.content.length > 150 ? '...' : ''}</p>
                <button className="btn-secondary" style={{ width: 'fit-content' }}>Read more</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
