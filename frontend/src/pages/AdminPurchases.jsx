import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

const statusOptions = ['pending', 'contacted', 'completed'];

const AdminPurchases = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  }), [user?.token]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(apiUrl('/api/purchases'), config);
      setInquiries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchInquiries();
  }, [user?.role]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await axios.put(apiUrl(`/api/purchases/${id}/status`), { status }, config);
      await fetchInquiries();
    } catch (error) {
      alert(error.response?.data?.message || 'Could not update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this purchase inquiry?')) return;
    try {
      await axios.delete(apiUrl(`/api/purchases/${id}`), config);
      await fetchInquiries();
    } catch (error) {
      alert('Could not delete inquiry');
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
          <h1 className="page-heading">Purchase inquiries</h1>
          <p className="page-subheading">Buy requests from Websites and Mobile Apps pages.</p>
        </div>
        <Link to="/admin" className="btn-secondary">Back to dashboard</Link>
      </div>

      {loading ? (
        <div className="empty-state">Loading inquiries...</div>
      ) : inquiries.length === 0 ? (
        <div className="empty-state"><p className="card-copy">No purchase inquiries yet.</p></div>
      ) : (
        <div className="enrollment-grid">
          {inquiries.map((item) => (
            <article key={item._id} className="card">
              <div className="card-body stack">
                <div className="section-header" style={{ marginBottom: 0, alignItems: 'start' }}>
                  <div className="stack" style={{ gap: '0.35rem' }}>
                    <h3 className="card-title">{item.productName}</h3>
                    <p className="card-copy">{item.name} • {item.email} • {item.phone}</p>
                  </div>
                  <span className={`badge ${item.status === 'completed' ? 'badge-success' : item.status === 'contacted' ? 'badge-primary' : 'badge-neutral'}`}>
                    {item.status}
                  </span>
                </div>
                <span className="badge badge-warning" style={{ width: 'fit-content' }}>
                  {item.productType === 'website' ? 'Website' : 'Mobile App'}
                </span>
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

export default AdminPurchases;
