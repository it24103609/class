import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import heroImage from '../assets/hero.png';
import { apiUrl, assetUrl } from '../config/api';

const highlights = [
  'Practical curriculum',
  'Real mentor support',
  'Mobile-first experience',
];

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    axios
      .get(apiUrl('/api/courses?featured=true'))
      .then((response) => setFeaturedCourses(response.data.slice(0, 3)))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Quick Learn Academy</span>
            <h1 className="page-heading">Build skills with a modern learning experience.</h1>
            <p className="page-subheading">
              A fresh, responsive education platform designed to help students move faster, learn better,
              and stay confident on any device.
            </p>

            <div className="hero-actions">
              <Link to="/courses" className="btn-primary">Explore courses</Link>
              <Link to="/register" className="btn-secondary">Get started</Link>
            </div>

            <div className="hero-points">
              {highlights.map((item) => (
                <span key={item} className="hero-point">{item}</span>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <img src={heroImage} alt="Students learning online" />
            <div className="hero-visual-overlay" />
            <div className="hero-visual-content">
              <span className="badge badge-primary" style={{ width: 'fit-content' }}>Live learning</span>
              <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: 1.05 }}>Modern lessons, clear progress, better results.</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.88)' }}>Built for students, mentors, and admins who want clarity.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stats-strip">
          <div className="stat-card">
            <p className="stat-value">10k+</p>
            <p className="stat-label">Active learners</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">50+</p>
            <p className="stat-label">Premium courses</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">95%</p>
            <p className="stat-label">Success rate</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">24/7</p>
            <p className="stat-label">Support access</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="stack">
              <span className="eyebrow">Featured</span>
              <h2 className="page-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>Featured courses</h2>
              <p className="page-subheading">A quick look at the courses people keep coming back to.</p>
            </div>
            <Link to="/courses" className="btn-secondary">Browse all</Link>
          </div>

          <div className="course-grid">
            {featuredCourses.map((course) => (
              <article key={course._id} className="card card-surface">
                {course.image && (
                  <img
                    className="card-media"
                    src={assetUrl(course.image)}
                    alt={course.name}
                  />
                )}
                <div className="card-body stack">
                  <span className="badge badge-primary" style={{ width: 'fit-content' }}>Featured</span>
                  <h3 className="card-title">{course.name}</h3>
                  <p className="card-copy">{course.durationMonths} months • {course.category}</p>
                  <p className="card-copy">{course.description.slice(0, 120)}{course.description.length > 120 ? '...' : ''}</p>
                  <div className="section-header" style={{ marginBottom: 0 }}>
                    <strong style={{ fontSize: '1.25rem' }}>${course.price}</strong>
                    <Link to={`/courses/${course._id}`} className="btn-primary">View details</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-lg">
        <div className="container split-layout">
          <div className="content-panel">
            <span className="eyebrow">Why it works</span>
            <h2 className="page-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>A cleaner experience for every page.</h2>
            <p className="page-subheading">
              We rebuilt the visuals around a consistent system, so the whole site feels balanced on desktop and mobile.
            </p>
          </div>
          <div className="content-panel">
            <div className="stack">
              <div className="badge badge-success" style={{ width: 'fit-content' }}>Responsive layout</div>
              <div className="badge badge-primary" style={{ width: 'fit-content' }}>Modern cards</div>
              <div className="badge badge-warning" style={{ width: 'fit-content' }}>Admin ready</div>
              <div className="badge badge-neutral" style={{ width: 'fit-content' }}>Dark mode support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
