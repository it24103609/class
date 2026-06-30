import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl, assetUrl } from '../config/api';
import { FileText, Sparkles, ExternalLink } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const highlights = [
  'Practical curriculum',
  'Real mentor support',
  'Mobile-first experience',
];

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [featuredWebsites, setFeaturedWebsites] = useState([]);
  const [featuredMobileApps, setFeaturedMobileApps] = useState([]);
  const [showCvModal, setShowCvModal] = useState(false);
  const [cvForm, setCvForm] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    experience: '',
    skills: '',
    message: '',
  });
  const [cvSubmitting, setCvSubmitting] = useState(false);
  const [cvMessage, setCvMessage] = useState('');

  useEffect(() => {
    axios
      .get(apiUrl('/api/courses?featured=true'))
      .then((response) => setFeaturedCourses(response.data.slice(0, 3)))
      .catch((error) => console.error(error));

    axios
      .get(apiUrl('/api/websites'))
      .then((response) => setFeaturedWebsites(response.data.filter(w => w.featured).slice(0, 3)))
      .catch((error) => console.error(error));

    axios
      .get(apiUrl('/api/mobileapps'))
      .then((response) => setFeaturedMobileApps(response.data.filter(m => m.featured).slice(0, 3)))
      .catch((error) => console.error(error));
  }, []);

  const handleCvChange = (field, value) => {
    setCvForm((current) => ({ ...current, [field]: value }));
  };

  const submitCvRegistration = async (event) => {
    event.preventDefault();
    setCvSubmitting(true);
    setCvMessage('');

    try {
      await axios.post(apiUrl('/api/cv'), cvForm);
      setCvMessage('✅ Registration submitted! We will build your modern CV soon.');
      setShowCvModal(false);
      setCvForm({
        name: '',
        email: '',
        phone: '',
        education: '',
        experience: '',
        skills: '',
        message: '',
      });
    } catch (error) {
      setCvMessage(error.response?.data?.message || 'Could not submit registration');
    } finally {
      setCvSubmitting(false);
    }
  };

  const handleBuy = (item) => {
    // Redirect to the respective dedicated page
    window.location.href = item.deployLink || '/contact';
  };

  return (
    <div>
      {/* ========== HERO with Background Video ========== */}
      <section className="hero-video-section">
        <div className="hero-video-bg">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80"
          >
            <source
              src="https://cdn.coverr.co/videos/coverr-abstract-digital-network-5923/1080p.mp4"
              type="video/mp4"
            />
          </video>
          <div className="hero-video-overlay" />
        </div>

        <div className="container">
          <div className="hero-video-content">
            <span className="eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)' }}>
              Quick Learn Academy
            </span>
            <h1 className="hero-video-heading">
              Build skills with a modern learning experience.
            </h1>
            <p className="hero-video-subheading">
              A fresh, responsive education platform designed to help students move faster, learn better,
              and stay confident on any device.
            </p>

            <div className="hero-actions">
              <Link to="/courses" className="btn-primary btn-hero">Explore courses</Link>
              <Link to="/register" className="btn-hero-secondary">Get started</Link>
            </div>

            <div className="hero-points hero-points-light">
              {highlights.map((item) => (
                <span key={item} className="hero-point-light">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== Stats Strip ========== */}
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

      {/* ========== Featured Courses ========== */}
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
              <article key={course._id} className="card card-surface modern-card">
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

      {/* ========== Featured Websites ========== */}
      {featuredWebsites.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <div className="stack">
                <span className="eyebrow">Websites</span>
                <h2 className="page-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>Featured websites</h2>
                <p className="page-subheading">Professional, ready-to-deploy website templates and platforms.</p>
              </div>
              <Link to="/websites" className="btn-secondary">
                View all
                <ExternalLink size={16} />
              </Link>
            </div>

            <div className="course-grid">
              {featuredWebsites.map((website) => (
                <ProductCard key={website._id} item={website} onBuy={handleBuy} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== Featured Mobile Apps ========== */}
      {featuredMobileApps.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className="section-header">
              <div className="stack">
                <span className="eyebrow">Mobile Apps</span>
                <h2 className="page-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>Featured mobile apps</h2>
                <p className="page-subheading">Cross-platform mobile applications with modern tech stacks.</p>
              </div>
              <Link to="/mobileapps" className="btn-secondary">
                View all
                <ExternalLink size={16} />
              </Link>
            </div>

            <div className="course-grid">
              {featuredMobileApps.map((app) => (
                <ProductCard key={app._id} item={app} onBuy={handleBuy} extraLabel={app.platform} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== CV Promo ========== */}
      <section className="section">
        <div className="container">
          <div className="card card-surface cv-promo">
            <div className="cv-promo-grid">
              <div className="stack">
                <span className="badge badge-primary" style={{ width: 'fit-content' }}>
                  <Sparkles size={14} />
                  New service
                </span>
                <h2 className="page-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', margin: 0 }}>
                  Modern Professional CV
                </h2>
                <p className="page-subheading">
                  Get a clean, ATS-friendly, modern CV designed by experts. Perfect for jobs, internships, and interviews.
                </p>
                <ul className="cv-promo-list">
                  <li>Modern layout with professional typography</li>
                  <li>PDF + editable version included</li>
                  <li>Fast delivery with expert review</li>
                </ul>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '2rem', color: 'var(--primary)' }}>₹1,000</strong>
                  <span className="badge badge-success">Limited offer</span>
                </div>
                <button type="button" className="btn-primary" style={{ width: 'fit-content' }} onClick={() => setShowCvModal(true)}>
                  <FileText size={18} />
                  Register now
                </button>
                {cvMessage && (
                  <p className="card-copy" style={{ color: cvMessage.startsWith('✅') ? 'var(--success)' : 'var(--danger)' }}>
                    {cvMessage}
                  </p>
                )}
              </div>
              <div className="cv-promo-visual">
                <div className="cv-mock-card">
                  <div className="cv-mock-header" />
                  <div className="cv-mock-line long" />
                  <div className="cv-mock-line" />
                  <div className="cv-mock-line medium" />
                  <div className="cv-mock-block" />
                  <div className="cv-mock-line short" />
                  <div className="cv-mock-line medium" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Why It Works ========== */}
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

      {/* ========== CV Modal ========== */}
      {showCvModal && (
        <div className="modal-backdrop">
          <div className="card modal-card stack">
            <div className="section-header" style={{ marginBottom: 0 }}>
              <h2 className="card-title">Register for Modern CV</h2>
              <button className="icon-button" onClick={() => setShowCvModal(false)} aria-label="Close modal">×</button>
            </div>
            <p className="card-copy" style={{ marginTop: '-0.5rem' }}>
              Fill your details. Our team will contact you to create your ₹1,000 professional CV.
            </p>

            <form className="stack" onSubmit={submitCvRegistration}>
              <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.9rem' }}>
                <div className="form-group">
                  <label className="form-label">Full name</label>
                  <input className="form-input" value={cvForm.name} onChange={(e) => handleCvChange('name', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={cvForm.phone} onChange={(e) => handleCvChange('phone', e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={cvForm.email} onChange={(e) => handleCvChange('email', e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Education</label>
                <input className="form-input" placeholder="e.g. B.Tech CSE, Anna University" value={cvForm.education} onChange={(e) => handleCvChange('education', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Experience</label>
                <input className="form-input" placeholder="e.g. 2 years as Frontend Developer" value={cvForm.experience} onChange={(e) => handleCvChange('experience', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Skills</label>
                <input className="form-input" placeholder="e.g. React, Node.js, MongoDB" value={cvForm.skills} onChange={(e) => handleCvChange('skills', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Additional notes</label>
                <textarea className="form-textarea" value={cvForm.message} onChange={(e) => handleCvChange('message', e.target.value)} />
              </div>
              <div className="toolbar-actions" style={{ justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowCvModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={cvSubmitting}>
                  {cvSubmitting ? 'Submitting...' : 'Submit registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;