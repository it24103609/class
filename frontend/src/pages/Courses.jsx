import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl, assetUrl } from '../config/api';

const categories = ['Programming', 'Design', 'Business'];

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const queryUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    return apiUrl(`/api/courses${params.toString() ? `?${params.toString()}` : ''}`);
  }, [search, category]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(queryUrl)
      .then((response) => setCourses(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [queryUrl]);

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Courses</span>
          <h1 className="page-heading">Find the right course for your next step.</h1>
          <p className="page-subheading">Search and filter work on a layout that stays comfortable on mobile.</p>
        </div>
      </div>

      <div className="toolbar">
        <div className="filters">
          <input
            className="form-input"
            type="search"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <h2 className="card-title">No courses found</h2>
          <p className="card-copy">Try a different search term or category.</p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <article key={course._id} className="card card-surface">
              {course.image && (
                <img
                  className="card-media"
                  src={assetUrl(course.image)}
                  alt={course.name}
                />
              )}
              <div className="card-body stack">
                <div className="toolbar-actions" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="badge badge-primary">{course.category}</span>
                  <div className="stack" style={{ gap: '0.15rem', textAlign: 'right' }}>
                    {course.originalPrice > course.price && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', justifyContent: 'flex-end' }}>
                        <span style={{ textDecoration: 'line-through', color: 'var(--muted)' }}>
                          Rs. {course.originalPrice}
                        </span>
                        <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                          {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% Offer
                        </span>
                      </div>
                    )}
                    <strong style={{ fontSize: '1.15rem' }}>Rs. {course.price}</strong>
                  </div>
                </div>
                <h2 className="card-title">{course.name}</h2>
                <p className="card-copy">{course.durationMonths} months</p>
                <p className="card-copy">{course.description.slice(0, 120)}{course.description.length > 120 ? '...' : ''}</p>
                <Link to={`/courses/${course._id}`} className="btn-primary" style={{ width: 'fit-content' }}>
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
