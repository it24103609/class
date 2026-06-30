import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

const emptyForm = {
  name: '',
  description: '',
  imageUrl: '',
  deployLink: '',
  price: '',
  originalPrice: '',
  techStack: '',
  published: true,
  featured: false,
};

const emptyReview = { author: '', rating: 5, comment: '' };

const AdminWebsites = () => {
  const { user } = useAuth();
  const [websites, setWebsites] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [reviews, setReviews] = useState([]);
  const [reviewDraft, setReviewDraft] = useState(emptyReview);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  }), [user?.token]);

  const fetchWebsites = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(apiUrl('/api/websites/admin/list'), config);
      setWebsites(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchWebsites();
  }, [user?.role]);

  const resetForm = () => {
    setForm(emptyForm);
    setReviews([]);
    setReviewDraft(emptyReview);
    setSelectedId(null);
  };

  const loadWebsite = (website) => {
    setSelectedId(website._id);
    setForm({
      name: website.name || '',
      description: website.description || '',
      imageUrl: website.imageUrl || '',
      deployLink: website.deployLink || '',
      price: website.price || '',
      originalPrice: website.originalPrice || '',
      techStack: website.techStack || '',
      published: Boolean(website.published),
      featured: Boolean(website.featured),
    });
    setReviews(website.reviews || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addReview = () => {
    if (!reviewDraft.author || !reviewDraft.comment) return;
    setReviews((current) => [...current, { ...reviewDraft, rating: Number(reviewDraft.rating) }]);
    setReviewDraft(emptyReview);
  };

  const removeReview = (index) => {
    setReviews((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, reviews };
      if (selectedId) {
        await axios.put(apiUrl(`/api/websites/${selectedId}`), payload, config);
      } else {
        await axios.post(apiUrl('/api/websites'), payload, config);
      }
      await fetchWebsites();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Could not save website');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this website?')) return;
    try {
      await axios.delete(apiUrl(`/api/websites/${id}`), config);
      await fetchWebsites();
      if (selectedId === id) resetForm();
    } catch (error) {
      alert('Could not delete website');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container section">
        <div className="empty-state">
          <h2 className="card-title">Not authorized</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Admin</span>
          <h1 className="page-heading">Manage websites</h1>
          <p className="page-subheading">Add website cards with image, demo link, price, and reviews.</p>
        </div>
        <div className="toolbar-actions">
          <Link to="/admin" className="btn-secondary">Back</Link>
          <button type="button" className="btn-primary" onClick={resetForm}>New website</button>
        </div>
      </div>

      <div className="split-layout">
        <form className="admin-form content-panel" onSubmit={handleSubmit}>
          <h2 className="card-title">{selectedId ? 'Edit website' : 'Create website'}</h2>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={(e) => handleChange('description', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input type="url" className="form-input" value={form.imageUrl} onChange={(e) => handleChange('imageUrl', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Deploy / demo link</label>
            <input type="url" className="form-input" value={form.deployLink} onChange={(e) => handleChange('deployLink', e.target.value)} />
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.9rem' }}>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input type="number" className="form-input" value={form.price} onChange={(e) => handleChange('price', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Original price</label>
              <input type="number" className="form-input" value={form.originalPrice} onChange={(e) => handleChange('originalPrice', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Tech stack</label>
              <input className="form-input" placeholder="React, Node.js" value={form.techStack} onChange={(e) => handleChange('techStack', e.target.value)} />
            </div>
          </div>

          <div className="content-panel" style={{ padding: '1rem' }}>
            <h3 className="card-title">Reviews</h3>
            <div className="grid" style={{ gridTemplateColumns: '1fr 100px 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
              <input className="form-input" placeholder="Author" value={reviewDraft.author} onChange={(e) => setReviewDraft({ ...reviewDraft, author: e.target.value })} />
              <input type="number" min="1" max="5" className="form-input" value={reviewDraft.rating} onChange={(e) => setReviewDraft({ ...reviewDraft, rating: e.target.value })} />
              <input className="form-input" placeholder="Comment" value={reviewDraft.comment} onChange={(e) => setReviewDraft({ ...reviewDraft, comment: e.target.value })} />
              <button type="button" className="btn-secondary" onClick={addReview}>Add</button>
            </div>
            {reviews.map((review, index) => (
              <div key={index} className="toolbar-actions" style={{ marginTop: '0.5rem' }}>
                <span className="badge badge-neutral">{review.author} • {review.rating}★ — {review.comment}</span>
                <button type="button" className="btn-ghost" onClick={() => removeReview(index)}>Remove</button>
              </div>
            ))}
          </div>

          <div className="toolbar-actions" style={{ marginTop: '1rem' }}>
            <label className="badge badge-neutral"><input type="checkbox" checked={form.published} onChange={(e) => handleChange('published', e.target.checked)} /> Published</label>
            <label className="badge badge-neutral"><input type="checkbox" checked={form.featured} onChange={(e) => handleChange('featured', e.target.checked)} /> Featured</label>
          </div>

          <div className="toolbar-actions" style={{ marginTop: '1rem' }}>
            <button className="btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : selectedId ? 'Update' : 'Create'}</button>
          </div>
        </form>

        <div className="content-panel">
          {loading ? <div className="empty-state">Loading...</div> : (
            <div className="stack-lg">
              {websites.map((website) => (
                <article key={website._id} className="card">
                  {website.imageUrl && <img src={website.imageUrl} alt={website.name} className="card-media" />}
                  <div className="card-body stack">
                    <h3 className="card-title">{website.name}</h3>
                    <p className="card-copy">₹{website.price} • {website.reviews?.length || 0} reviews</p>
                    <div className="toolbar-actions">
                      <button className="btn-secondary" type="button" onClick={() => loadWebsite(website)}>Edit</button>
                      <button className="btn-ghost" type="button" onClick={() => handleDelete(website._id)}>Delete</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWebsites;
