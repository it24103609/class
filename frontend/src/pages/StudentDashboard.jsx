import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { apiUrl, assetUrl } from '../config/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  }), [user?.token]);

  useEffect(() => {
    if (user) {
      axios
        .get(apiUrl('/api/enroll/myenrollments'), config)
        .then((response) => setEnrollments(response.data))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [user?.token]);

  if (!user) {
    return (
      <div className="container section">
        <div className="empty-state">
          <p className="card-copy">Please login to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Student</span>
          <h1 className="page-heading">Welcome, {user.name}</h1>
          <p className="page-subheading">Your enrolled courses and progress in one clear view.</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading your enrollments...</div>
      ) : enrollments.length === 0 ? (
        <div className="empty-state">
          <p className="card-copy">
            You haven't enrolled in any courses yet.{' '}
            <Link to="/courses" style={{ color: 'var(--primary)', fontWeight: 700 }}>Browse courses</Link>
          </p>
        </div>
      ) : (
        <div className="enrollment-grid">
          {enrollments.map((enrollment) => (
            <article key={enrollment._id} className="card card-surface">
              {enrollment.course.image && (
                <img
                  src={assetUrl(enrollment.course.image)}
                  alt={enrollment.course.name}
                  className="card-media"
                />
              )}
              <div className="card-body stack">
                <div className="section-header" style={{ marginBottom: 0 }}>
                  <div className="stack" style={{ gap: '0.35rem' }}>
                    <h2 className="card-title">{enrollment.course.name}</h2>
                    <p className="card-copy">{enrollment.course.durationMonths} months</p>
                  </div>
                  <span className={`badge ${enrollment.status === 'completed' ? 'badge-success' : enrollment.status === 'enrolled' ? 'badge-primary' : 'badge-neutral'}`}>
                    {enrollment.status}
                  </span>
                </div>

                {enrollment.status === 'pending' && (
                  <div style={{
                    background: 'rgba(255, 193, 7, 0.08)',
                    border: '1px solid rgba(255, 193, 7, 0.25)',
                    borderRadius: '10px',
                    padding: '0.65rem 1rem',
                    fontSize: '0.85rem',
                    color: 'rgba(255,193,7,0.9)'
                  }}>
                    ⏳ Your enrollment code is being reviewed by the admin. You'll get access once confirmed.
                  </div>
                )}

                {enrollment.status === 'enrolled' && (
                  <Link
                    to={`/my-course/${enrollment._id}`}
                    className="btn-primary"
                    style={{ width: 'fit-content', textDecoration: 'none' }}
                  >
                    🚀 Go to Course
                  </Link>
                )}

                {enrollment.status === 'completed' && (
                  <Link
                    to={`/my-course/${enrollment._id}`}
                    className="btn-secondary"
                    style={{ width: 'fit-content', textDecoration: 'none' }}
                  >
                    📖 View Course
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
