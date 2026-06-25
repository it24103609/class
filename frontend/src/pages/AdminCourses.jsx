import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl, assetUrl } from '../config/api';

const emptyForm = {
  name: '',
  price: '',
  originalPrice: '',
  durationMonths: '',
  category: 'Programming',
  description: '',
  youtubeLink: '',
  published: true,
  featured: false,
};

const AdminCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  }), [user?.token]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(apiUrl('/api/courses/admin/list'), config);
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchCourses();
    }
  }, [user?.role]);

  const resetForm = () => {
    setForm(emptyForm);
    setSelectedCourseId(null);
    setImageUrl('');
  };

  const loadCourse = (course) => {
    setSelectedCourseId(course._id);
    setForm({
      name: course.name || '',
      price: course.price || '',
      originalPrice: course.originalPrice || '',
      durationMonths: course.durationMonths || '',
      category: course.category || 'Programming',
      description: course.description || '',
      youtubeLink: course.youtubeLink || '',
      published: Boolean(course.published),
      featured: Boolean(course.featured),
    });
    setImageUrl(course.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = { ...form, imageUrl };

      if (selectedCourseId) {
        await axios.put(apiUrl(`/api/courses/${selectedCourseId}`), payload, config);
      } else {
        await axios.post(apiUrl('/api/courses'), payload, config);
      }

      await fetchCourses();
      resetForm();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Could not save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Delete this course?')) return;

    try {
      await axios.delete(apiUrl(`/api/courses/${courseId}`), config);
      await fetchCourses();
      if (selectedCourseId === courseId) resetForm();
    } catch (error) {
      console.error(error);
      alert('Could not delete course');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container section">
        <div className="empty-state">
          <h2 className="card-title">Not authorized</h2>
          <p className="card-copy">You need admin access to manage courses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Admin</span>
          <h1 className="page-heading">Course management</h1>
          <p className="page-subheading">Create, update, publish, and remove courses from one place.</p>
        </div>
        <div className="toolbar-actions">
          <Link to="/admin" className="btn-secondary">Back to dashboard</Link>
          <button type="button" className="btn-primary" onClick={resetForm}>New course</button>
        </div>
      </div>

      <div className="split-layout">
        <form className="admin-form content-panel" onSubmit={handleSubmit}>
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div className="stack">
              <h2 className="card-title">{selectedCourseId ? 'Edit course' : 'Create course'}</h2>
              <p className="card-copy">Keep the form clean and focused for fast updates.</p>
            </div>
            {selectedCourseId && <span className="badge badge-primary">Editing</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Course name</label>
            <input className="form-input" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.9rem' }}>
            <div className="form-group">
              <label className="form-label">Price (Sale)</label>
              <input type="number" className="form-input" value={form.price} onChange={(e) => handleChange('price', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Original Price</label>
              <input type="number" className="form-input" placeholder="e.g. 5000" value={form.originalPrice} onChange={(e) => handleChange('originalPrice', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration months</label>
              <input type="number" className="form-input" value={form.durationMonths} onChange={(e) => handleChange('durationMonths', e.target.value)} required />
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.9rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                <option>Programming</option>
                <option>Design</option>
                <option>Business</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">YouTube link</label>
              <input className="form-input" value={form.youtubeLink} onChange={(e) => handleChange('youtubeLink', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={form.description} onChange={(e) => handleChange('description', e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Cover image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            {imageUrl && (
              <img src={imageUrl} alt="preview" style={{ marginTop: '0.5rem', maxHeight: '120px', borderRadius: '8px', objectFit: 'cover' }} />
            )}
          </div>

          <div className="toolbar-actions" style={{ marginBottom: '1rem' }}>
            <label className="badge badge-neutral">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => handleChange('published', e.target.checked)}
              />
              Published
            </label>
            <label className="badge badge-neutral">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
              />
              Featured
            </label>
          </div>

          <div className="toolbar-actions">
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : selectedCourseId ? 'Update course' : 'Create course'}
            </button>
            {selectedCourseId && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="content-panel">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div className="stack">
              <h2 className="card-title">Existing courses</h2>
              <p className="card-copy">Tap edit to load a course into the form.</p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <p className="card-copy">No courses yet. Create the first one on the left.</p>
            </div>
          ) : (
            <div className="stack-lg">
              {courses.map((course) => (
                <article key={course._id} className="card">
                  {course.image && (
                    <img
                      src={assetUrl(course.image)}
                      alt={course.name}
                      className="card-media"
                    />
                  )}
                  <div className="card-body stack">
                    <div className="section-header" style={{ marginBottom: 0, alignItems: 'start' }}>
                      <div className="stack" style={{ gap: '0.45rem' }}>
                        <h3 className="card-title">{course.name}</h3>
                        <p className="card-copy">{course.category} • {course.durationMonths} months</p>
                      </div>
                      <div className="toolbar-actions">
                        {course.featured && <span className="badge badge-warning">Featured</span>}
                        {course.published ? <span className="badge badge-success">Published</span> : <span className="badge badge-neutral">Draft</span>}
                      </div>
                    </div>
                    <p className="card-copy">{course.description.slice(0, 140)}{course.description.length > 140 ? '...' : ''}</p>
                    <div className="toolbar-actions">
                      <button className="btn-secondary" onClick={() => loadCourse(course)} type="button">Edit</button>
                      <Link to={`/admin/courses/${course._id}/days`} className="btn-secondary">📅 Manage Days</Link>
                      <button className="btn-ghost" onClick={() => handleDelete(course._id)} type="button">Delete</button>
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

export default AdminCourses;
