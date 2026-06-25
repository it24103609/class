import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { apiUrl, assetUrl } from '../config/api';

const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'www.youtube.com/embed/');
  }
  return url.replace('watch?v=', 'embed/');
};

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios
      .get(apiUrl(`/api/courses/${id}`))
      .then((response) => setCourse(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleEnrollClick = () => {
    if (!user) {
      alert('Please login to enroll');
      return;
    }
    setShowModal(true);
  };

  const submitCode = async () => {
    if (!enrollmentCode.trim()) {
      alert('Please enter your enrollment code');
      return;
    }
    setSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        apiUrl('/api/enroll'),
        { courseId: id, enrollmentCode: enrollmentCode.trim() },
        config
      );
      setMessage('✅ Code submitted! Your enrollment is pending admin approval.');
      setShowModal(false);
      setEnrollmentCode('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting code');
    } finally {
      setSubmitting(false);
    }
  };

  if (!course) {
    return <div className="container section">Loading...</div>;
  }

  return (
    <div className="container section">
      <div className="split-layout">
        <div className="content-panel stack">
          {course.image && (
            <img
              src={assetUrl(course.image)}
              alt={course.name}
              className="card-media"
              style={{ borderRadius: '24px' }}
            />
          )}
          <span className="badge badge-primary" style={{ width: 'fit-content' }}>{course.category}</span>
          <h1 className="page-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{course.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <p className="page-subheading" style={{ margin: 0 }}>{course.durationMonths} months •</p>
            {course.originalPrice > course.price && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ textDecoration: 'line-through', color: 'var(--muted)', fontSize: '0.9rem' }}>
                  Rs. {course.originalPrice}
                </span>
                <span className="badge badge-success" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                  {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% Offer
                </span>
              </div>
            )}
            <p className="page-subheading" style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>
              Rs. {course.price}
            </p>
          </div>
          <p className="card-copy">{course.description}</p>
          <button onClick={handleEnrollClick} className="btn-primary" style={{ width: 'fit-content' }}>
            Enroll now
          </button>
          {message && <p className="card-copy" style={{ color: message.startsWith('✅') ? 'var(--success)' : 'var(--danger)' }}>{message}</p>}
        </div>

        <div className="content-panel stack" style={{ position: 'sticky', top: '100px', alignSelf: 'flex-start', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📺</span>
            <h2 className="card-title" style={{ margin: 0, fontSize: '1.25rem' }}>Course preview</h2>
          </div>
          
          {course.youtubeLink ? (
            <div style={{ 
              overflow: 'hidden', 
              aspectRatio: '16/9', 
              borderRadius: '16px',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <iframe
                width="100%"
                height="100%"
                src={toEmbedUrl(course.youtubeLink)}
                title="Course video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 0, display: 'block' }}
              />
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <span style={{ fontSize: '2rem', opacity: 0.5 }}>🎬</span>
              <p className="card-copy" style={{ marginTop: '0.5rem' }}>No video preview available yet.</p>
            </div>
          )}
          
          <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface-strong)', borderRadius: '12px' }}>
            <p className="card-copy" style={{ fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>
              Enroll in this course to get full access to all lectures, notes, and day-by-day learning materials.
            </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="card modal-card stack">
            <div className="section-header" style={{ marginBottom: 0 }}>
              <h2 className="card-title">Enter your enrollment code</h2>
              <button className="icon-button" onClick={() => setShowModal(false)} aria-label="Close modal">×</button>
            </div>
            <p className="card-copy" style={{ marginTop: '-0.5rem' }}>
              Enter the code provided by the admin to enroll in this course.
            </p>
            <div className="form-group">
              <label className="form-label">Enrollment Code</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. CLASS-2024-XYZ"
                value={enrollmentCode}
                onChange={(e) => setEnrollmentCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitCode()}
              />
            </div>
            <div className="toolbar-actions" style={{ justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={submitCode} className="btn-primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
