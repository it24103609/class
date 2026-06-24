import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeStudents: 0,
    totalEnrollments: 0,
    featuredCourses: 0,
  });

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  }), [user?.token]);

  useEffect(() => {
    if (user?.role === 'admin') {
      axios
        .get(apiUrl('/api/enroll/stats'), config)
        .then((response) => setStats(response.data))
        .catch((error) => console.error(error));
    }
  }, [user?.role]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="container section">
        <div className="empty-state">
          <h2 className="card-title">Not authorized</h2>
          <p className="card-copy">You need admin access to open this dashboard.</p>
        </div>
      </div>
    );
  }

  const metricItems = [
    { label: 'Total Courses', value: stats.totalCourses },
    { label: 'Active Students', value: stats.activeStudents },
    { label: 'Enrollments', value: stats.totalEnrollments },
    { label: 'Featured Courses', value: stats.featuredCourses },
  ];

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Admin panel</span>
          <h1 className="page-heading">Dashboard overview</h1>
          <p className="page-subheading">A clean control center for courses, enrollments, and publishing.</p>
        </div>
        <div className="toolbar-actions">
          <Link to="/admin/courses" className="btn-primary">Manage courses</Link>
          <Link to="/admin/enrollments" className="btn-secondary">View enrollments</Link>
        </div>
      </div>

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="stack">
            <div>
              <h2 className="card-title">Admin tools</h2>
              <p className="card-copy">Everything grouped in one place.</p>
            </div>
            <nav className="dashboard-nav">
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/courses">Manage Courses</Link>
              <Link to="/admin/enrollments">Enrollments</Link>
              <Link to="/admin/blog">Create Blog</Link>
            </nav>
          </div>
        </aside>

        <div className="dashboard-main">
          <div className="dashboard-cards">
            {metricItems.map((item) => (
              <div key={item.label} className="card metric-card">
                <p className="metric-label">{item.label}</p>
                <p className="metric-value">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="split-layout">
            <div className="content-panel">
              <div className="stack">
                <h2 className="card-title">Quick actions</h2>
                <p className="card-copy">Jump straight into the most common admin tasks.</p>
                <div className="toolbar-actions">
                  <Link to="/admin/courses" className="btn-primary">Create or edit courses</Link>
                  <Link to="/admin/enrollments" className="btn-secondary">Review student inquiries</Link>
                  <Link to="/admin/blog" className="btn-secondary">Publish a blog post</Link>
                </div>
              </div>
            </div>

            <div className="content-panel">
              <div className="stack">
                <h2 className="card-title">What’s working now</h2>
                <div className="stack" style={{ gap: '0.75rem' }}>
                  <span className="badge badge-success">Secure admin API</span>
                  <span className="badge badge-primary">Course CRUD</span>
                  <span className="badge badge-warning">Enrollment status updates</span>
                  <span className="badge badge-neutral">Mobile-friendly layout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
