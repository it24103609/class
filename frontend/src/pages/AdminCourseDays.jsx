import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

const emptyDayForm = {
  dayNumber: '',
  title: '',
  notes: '',
  youtubeLink: '',
  imageUrl: '',
};

const AdminCourseDays = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [days, setDays] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [form, setForm] = useState(emptyDayForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  }), [user?.token]);

  const fetchDays = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(apiUrl(`/api/coursedays/${courseId}`), config);
      setDays(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== 'admin') return;

    // Fetch course name
    axios.get(apiUrl(`/api/courses/${courseId}`)).then(({ data }) => {
      setCourseName(data.name);
    }).catch(console.error);

    fetchDays();
  }, [courseId, user?.role]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyDayForm);
    setEditingId(null);
  };

  const loadDayForEdit = (day) => {
    setEditingId(day._id);
    setForm({
      dayNumber: day.dayNumber,
      title: day.title,
      notes: day.notes || '',
      youtubeLink: day.youtubeLink || '',
      imageUrl: day.imageUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await axios.put(apiUrl(`/api/coursedays/${editingId}`), form, config);
      } else {
        await axios.post(apiUrl('/api/coursedays'), { ...form, course: courseId }, config);
      }
      await fetchDays();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Could not save day');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dayId) => {
    if (!window.confirm('Delete this day?')) return;
    try {
      await axios.delete(apiUrl(`/api/coursedays/${dayId}`), config);
      await fetchDays();
      if (editingId === dayId) resetForm();
    } catch (error) {
      alert('Could not delete day');
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
          <span className="eyebrow">Admin · Courses</span>
          <h1 className="page-heading">Manage Days</h1>
          {courseName && <p className="page-subheading">{courseName}</p>}
        </div>
        <div className="toolbar-actions">
          <Link to="/admin/courses" className="btn-secondary">← Back to Courses</Link>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              + New Day
            </button>
          )}
        </div>
      </div>

      <div className="split-layout" style={{ gap: '2rem', alignItems: 'flex-start' }}>
        {/* Form */}
        <form className="admin-form content-panel" onSubmit={handleSubmit} style={{ flex: '0 0 380px' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 className="card-title">{editingId ? 'Edit Day' : 'Add New Day'}</h2>
            {editingId && <span className="badge badge-primary" style={{ marginTop: '0.4rem' }}>Editing</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Day Number</label>
            <input
              type="number"
              className="form-input"
              placeholder="1"
              value={form.dayNumber}
              onChange={(e) => handleChange('dayNumber', e.target.value)}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="form-input"
              placeholder="e.g. Introduction to Python"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">YouTube Link</label>
            <input
              className="form-input"
              placeholder="https://youtube.com/watch?v=..."
              value={form.youtubeLink}
              onChange={(e) => handleChange('youtubeLink', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Preview Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://example.com/day1-banner.jpg"
              value={form.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
            />
            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="preview"
                style={{ marginTop: '0.5rem', maxHeight: '100px', borderRadius: '8px', objectFit: 'cover' }}
              />
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Write lesson notes, topics covered, assignments..."
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>

          <div className="toolbar-actions">
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Day' : 'Add Day'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </form>

        {/* Days List */}
        <div className="content-panel" style={{ flex: 1 }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h2 className="card-title">Course Days ({days.length})</h2>
            <p className="card-copy">All day-wise content added for this course.</p>
          </div>

          {loading ? (
            <div className="empty-state">Loading days...</div>
          ) : days.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📅</div>
              <p className="card-copy">No days added yet. Use the form to add Day 1.</p>
            </div>
          ) : (
            <div className="stack" style={{ gap: '1rem' }}>
              {days.map((day) => (
                <article key={day._id} className="card">
                  <div className="card-body stack">
                    <div className="section-header" style={{ marginBottom: 0, alignItems: 'flex-start' }}>
                      <div className="stack" style={{ gap: '0.3rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="badge badge-neutral">Day {day.dayNumber}</span>
                          {day.youtubeLink && <span className="badge badge-primary">📹 Video</span>}
                          {day.imageUrl && <span className="badge badge-neutral">🖼 Image</span>}
                        </div>
                        <h3 className="card-title" style={{ margin: 0 }}>{day.title}</h3>
                      </div>
                      <div className="toolbar-actions">
                        <button className="btn-secondary" onClick={() => loadDayForEdit(day)} type="button">Edit</button>
                        <button className="btn-ghost" onClick={() => handleDelete(day._id)} type="button">Delete</button>
                      </div>
                    </div>
                    {day.notes && (
                      <p className="card-copy" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        {day.notes.slice(0, 120)}{day.notes.length > 120 ? '...' : ''}
                      </p>
                    )}
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

export default AdminCourseDays;
