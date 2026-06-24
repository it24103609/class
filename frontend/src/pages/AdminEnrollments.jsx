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
          <p className="page-subheading">Track student inquiries and move them through your workflow.</p>
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
                <p className="card-copy">{enrollment.inquiryMessage || 'No inquiry message provided.'}</p>

                <div className="toolbar-actions">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={enrollment.status === status ? 'btn-primary' : 'btn-secondary'}
                      onClick={() => updateStatus(enrollment._id, status)}
                      disabled={updatingId === enrollment._id}
                    >
                      {status}
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
