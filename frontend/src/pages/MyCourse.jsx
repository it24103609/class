import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'www.youtube.com/embed/');
  }
  return url.replace('watch?v=', 'embed/');
};

const MyCourse = () => {
  const { enrollmentId } = useParams();
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState(null);
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  }), [user?.token]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch enrollment details
        const { data: myEnrollments } = await axios.get(apiUrl('/api/enroll/myenrollments'), config);
        const found = myEnrollments.find((e) => e._id === enrollmentId);
        if (!found) {
          setError('Enrollment not found.');
          setLoading(false);
          return;
        }
        setEnrollment(found);

        // Fetch course days
        const { data: courseDays } = await axios.get(apiUrl(`/api/coursedays/${found.course._id}`), config);
        setDays(courseDays);
        if (courseDays.length > 0) setSelectedDay(courseDays[0]);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load course content.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enrollmentId, user?.token]);

  if (!user) {
    return (
      <div className="container section">
        <div className="empty-state">
          <p className="card-copy">Please login to access your course.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container section">
        <div className="empty-state">Loading course content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container section">
        <div className="empty-state">
          <p className="card-copy" style={{ color: 'var(--danger)' }}>{error}</p>
          <Link to="/dashboard" className="btn-secondary" style={{ marginTop: '1rem' }}>Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <div className="stack">
          <span className="eyebrow">Course Content</span>
          <h1 className="page-heading" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            {enrollment?.course?.name}
          </h1>
        </div>
        <div className="toolbar-actions">
          <Link to="/dashboard" className="btn-secondary">← Dashboard</Link>
        </div>
      </div>

      {days.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
          <h2 className="card-title">Content coming soon</h2>
          <p className="card-copy">The admin hasn't added day content yet. Check back soon!</p>
        </div>
      ) : (
        <div className="dashboard-layout" style={{ alignItems: 'flex-start' }}>
          {/* Day Sidebar */}
          <div className="content-panel dashboard-sidebar" style={{ padding: '1.25rem' }}>
            <h3 className="card-title" style={{ marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.6 }}>
              Course Days
            </h3>
            <div className="stack" style={{ gap: '0.5rem' }}>
              {days.map((day) => (
                <button
                  key={day._id}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: selectedDay?._id === day._id
                      ? '2px solid var(--primary)'
                      : '1px solid var(--border, rgba(255,255,255,0.1))',
                    background: selectedDay?._id === day._id
                      ? 'var(--primary-alpha, rgba(99,102,241,0.15))'
                      : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: 'inherit',
                    fontFamily: 'inherit'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                    Day {day.dayNumber}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: 1.3 }}>{day.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Day Content */}
          {selectedDay && (
            <div className="content-panel stack" style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-primary">Day {selectedDay.dayNumber}</span>
                <h2 className="card-title" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', margin: 0 }}>{selectedDay.title}</h2>
              </div>

              {/* Preview Image */}
              {selectedDay.imageUrl && (
                <div style={{ borderRadius: '16px', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <img
                    src={selectedDay.imageUrl}
                    alt={`Day ${selectedDay.dayNumber} preview`}
                    style={{ width: '100%', maxHeight: '320px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}

              {/* YouTube Video */}
              {selectedDay.youtubeLink && (
                <div style={{ borderRadius: '16px', overflow: 'hidden', marginTop: '0.5rem' }}>
                  <iframe
                    width="100%"
                    height="380"
                    src={toEmbedUrl(selectedDay.youtubeLink)}
                    title={`Day ${selectedDay.dayNumber} video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 0, display: 'block' }}
                  />
                </div>
              )}

              {/* Notes */}
              {selectedDay.notes && (
                <div style={{
                  background: 'var(--surface-2, rgba(255,255,255,0.04))',
                  border: '1px solid var(--border, rgba(255,255,255,0.08))',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  marginTop: '0.5rem'
                }}>
                  <h3 className="card-title" style={{ marginBottom: '1rem', fontSize: '1rem' }}>📝 Notes</h3>
                  <p className="card-copy" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{selectedDay.notes}</p>
                </div>
              )}

              {!selectedDay.imageUrl && !selectedDay.youtubeLink && !selectedDay.notes && (
                <div className="empty-state">
                  <p className="card-copy">No content added for this day yet.</p>
                </div>
              )}

              {/* Navigation */}
              <div className="toolbar-actions" style={{ marginTop: '1.5rem' }}>
                {days.findIndex(d => d._id === selectedDay._id) > 0 && (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      const idx = days.findIndex(d => d._id === selectedDay._id);
                      setSelectedDay(days[idx - 1]);
                    }}
                  >
                    ← Previous Day
                  </button>
                )}
                {days.findIndex(d => d._id === selectedDay._id) < days.length - 1 && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      const idx = days.findIndex(d => d._id === selectedDay._id);
                      setSelectedDay(days[idx + 1]);
                    }}
                  >
                    Next Day →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyCourse;
