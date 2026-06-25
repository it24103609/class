import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { apiUrl } from '../config/api';

const statusOptions = ['pending', 'enrolled', 'completed'];

const AdminEnrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  }), [user?.token]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(apiUrl('/api/enroll'), config);
      setEnrollments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchEnrollments();
    }
  }, [user?.role]);

  const updateStatus = async (enrollmentId, status) => {
    setUpdatingId(enrollmentId);
    try {
      await axios.put(apiUrl(`/api/enroll/${enrollmentId}/status`), { status }, config);
      await fetchEnrollments();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container section">
        <div className="empty-state">
          <h2 className="card-title">Not authorized</h2>
          <p className="card-copy">Admin access is required to view enrollments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Admin</span>
          <h1 className="page-heading">Enrollments</h1>
          <p className="page-subheading">Review student codes and confirm or reject their enrollments.</p>
        </div>
        <div className="toolbar-actions">
          <Link to="/admin" className="btn-secondary">Back to dashboard</Link>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading enrollments...</div>
      ) : enrollments.length === 0 ? (
        <div className="empty-state">
          <p className="card-copy">No enrollments yet.</p>
        </div>
      ) : (
        <div className="enrollment-grid">
          {enrollments.map((enrollment) => (
            <article key={enrollment._id} className="card">
              <div className="card-body stack">
                <div className="section-header" style={{ marginBottom: 0, alignItems: 'start' }}>
                  <div className="stack" style={{ gap: '0.35rem' }}>
                    <h3 className="card-title">{enrollment.course?.name}</h3>
                    <p className="card-copy">{enrollment.user?.name} • {enrollment.user?.email}</p>
                  </div>
                  <span className={`badge ${enrollment.status === 'completed' ? 'badge-success' : enrollment.status === 'enrolled' ? 'badge-primary' : 'badge-neutral'}`}>
                    {enrollment.status}
                  </span>
                </div>

                {/* Enrollment Code — key info for admin to verify */}
                <div style={{
                  background: 'var(--surface-2, rgba(255,255,255,0.05))',
                  border: '1px solid var(--border, rgba(255,255,255,0.1))',
                  borderRadius: '10px',
                  padding: '0.6rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Code</span>
                  <code style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.08em' }}>
                    {enrollment.enrollmentCode || <em style={{ opacity: 0.4, fontStyle: 'italic', fontWeight: 400 }}>No code provided</em>}
                  </code>
                </div>

                {enrollment.inquiryMessage && (
                  <p className="card-copy">{enrollment.inquiryMessage}</p>
                )}

                <div className="toolbar-actions">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={enrollment.status === status ? 'btn-primary' : 'btn-secondary'}
                      onClick={() => updateStatus(enrollment._id, status)}
                      disabled={updatingId === enrollment._id}
                    >
                      {status === 'pending' ? '⏳ Pending' : status === 'enrolled' ? '✅ Confirm' : '🏆 Complete'}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEnrollments;
