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
          <p className="page-subheading">Your course inquiries and progress in one clear view.</p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading your enrollments...</div>
      ) : enrollments.length === 0 ? (
        <div className="empty-state">
          <p className="card-copy">
            You haven’t inquired about any courses yet.{' '}
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
                <Link to={`/courses/${enrollment.course._id}`} className="btn-secondary" style={{ width: 'fit-content' }}>
                  View course
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
