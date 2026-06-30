import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

const statusOptions = ['pending', 'contacted', 'completed'];

const AdminCvRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  }), [user?.token]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(apiUrl('/api/cv'), config);
      setRegistrations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchRegistrations();
  }, [user?.role]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await axios.put(apiUrl(`/api/cv/${id}/status`), { status }, config);
      await fetchRegistrations();
    } catch (error) {
      alert(error.response?.data?.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this CV registration?')) return;
    try {
      await axios.delete(apiUrl(`/api/cv/${id}`), config);
      await fetchRegistrations();
    } catch (error) {
      alert('Could not delete registration');
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
          <h1 className="page-heading">CV registrations</h1>
          <p className="page-subheading">Users who registered for the ₹1,000 modern CV service from the home page.</p>
        </div>
        <Link to="/admin" className="btn-secondary">Back to dashboard</Link>
      </div>

      {loading ? (
        <div className="empty-state">Loading registrations...</div>
      ) : registrations.length === 0 ? (
        <div className="empty-state"><p className="card-copy">No CV registrations yet.</p></div>
      ) : (
        <div className="enrollment-grid">
          {registrations.map((item) => (
            <article key={item._id} className="card">
              <div className="card-body stack">
                <div className="section-header" style={{ marginBottom: 0, alignItems: 'start' }}>
                  <div className="stack" style={{ gap: '0.35rem' }}>
                    <h3 className="card-title">{item.name}</h3>
                    <p className="card-copy">{item.email} • {item.phone}</p>
                  </div>
                  <span className={`badge ${item.status === 'completed' ? 'badge-success' : item.status === 'contacted' ? 'badge-primary' : 'badge-neutral'}`}>
                    {item.status}
                  </span>
                </div>
                {item.education && <p className="card-copy"><strong>Education:</strong> {item.education}</p>}
                {item.experience && <p className="card-copy"><strong>Experience:</strong> {item.experience}</p>}
                {item.skills && <p className="card-copy"><strong>Skills:</strong> {item.skills}</p>}
                {item.message && <p className="card-copy">{item.message}</p>}
                <p className="card-copy" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <div className="toolbar-actions">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className={item.status === status ? 'btn-primary' : 'btn-secondary'}
                      onClick={() => updateStatus(item._id, status)}
                      disabled={updatingId === item._id}
                    >
                      {status}
                    </button>
                  ))}
                  <button type="button" className="btn-ghost" onClick={() => handleDelete(item._id)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCvRegistrations;
