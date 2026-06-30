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
    cvRegistrations: 0,
    pendingCvRegistrations: 0,
    totalWebsites: 0,
    totalMobileApps: 0,
    purchaseInquiries: 0,
    pendingPurchases: 0,
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
  }, [user?.role, config]);

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
    { label: 'CV Registrations', value: stats.cvRegistrations },
    { label: 'Websites', value: stats.totalWebsites },
    { label: 'Mobile Apps', value: stats.totalMobileApps },
    { label: 'Purchase Inquiries', value: stats.purchaseInquiries },
    { label: 'Pending CV / Purchases', value: stats.pendingCvRegistrations + stats.pendingPurchases },
  ];

  const adminLinks = [
    { to: '/admin/courses', label: 'Manage Courses' },
    { to: '/admin/enrollments', label: 'Enrollments' },
    { to: '/admin/blog', label: 'Create Blog' },
    { to: '/admin/websites', label: 'Manage Websites' },
    { to: '/admin/mobileapps', label: 'Manage Mobile Apps' },
    { to: '/admin/cv-registrations', label: 'CV Registrations' },
    { to: '/admin/purchases', label: 'Purchase Inquiries' },
  ];

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Admin panel</span>
          <h1 className="page-heading">Dashboard overview</h1>
          <p className="page-subheading">Control center for courses, CV service, websites, mobile apps, and purchases.</p>
        </div>
        <div className="toolbar-actions">
          <Link to="/admin/courses" className="btn-primary">Manage courses</Link>
          <Link to="/admin/cv-registrations" className="btn-secondary">CV registrations</Link>
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
              {adminLinks.map((link) => (
                <Link key={link.to} to={link.to}>{link.label}</Link>
              ))}
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
                  <Link to="/admin/courses" className="btn-primary">Courses</Link>
                  <Link to="/admin/websites" className="btn-secondary">Websites</Link>
                  <Link to="/admin/mobileapps" className="btn-secondary">Mobile Apps</Link>
                  <Link to="/admin/cv-registrations" className="btn-secondary">CV service</Link>
                  <Link to="/admin/purchases" className="btn-secondary">Purchases</Link>
                </div>
              </div>
            </div>

            <div className="content-panel">
              <div className="stack">
                <h2 className="card-title">New features</h2>
                <div className="stack" style={{ gap: '0.75rem' }}>
                  <span className="badge badge-success">Home page CV registration (₹1,000)</span>
                  <span className="badge badge-primary">Websites with buy form</span>
                  <span className="badge badge-warning">Mobile apps with buy form</span>
                  <span className="badge badge-neutral">All data stored in admin dashboard</span>
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
