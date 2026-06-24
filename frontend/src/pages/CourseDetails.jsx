import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { apiUrl, assetUrl } from '../config/api';

const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtu.be/')) {
    return url.replace('youtu.be/', 'www.youtube.com/embed/');
  }
  return url.replace('watch?v=', 'embed/');
};

const CourseDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [inquiry, setInquiry] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(apiUrl(`/api/courses/${id}`))
      .then((response) => setCourse(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  const handleEnrollClick = () => {
    if (!user) {
      alert('Please login to enroll');
      return;
    }
    setShowModal(true);
  };

  const submitInquiry = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(apiUrl('/api/enroll'), { courseId: id, inquiryMessage: inquiry }, config);
      setMessage('Inquiry sent successfully. We will contact you soon.');
      setShowModal(false);
      setInquiry('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting inquiry');
    }
  };

  if (!course) {
    return <div className="container section">Loading...</div>;
  }

  return (
    <div className="container section">
      <div className="split-layout">
        <div className="content-panel stack">
          {course.image && (
            <img
              src={assetUrl(course.image)}
              alt={course.name}
              className="card-media"
              style={{ borderRadius: '24px' }}
            />
          )}
          <span className="badge badge-primary" style={{ width: 'fit-content' }}>{course.category}</span>
          <h1 className="page-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{course.name}</h1>
          <p className="page-subheading">{course.durationMonths} months • ${course.price}</p>
          <p className="card-copy">{course.description}</p>
          <button onClick={handleEnrollClick} className="btn-primary" style={{ width: 'fit-content' }}>
            Enroll now
          </button>
          {message && <p className="card-copy" style={{ color: 'var(--success)' }}>{message}</p>}
        </div>

        <div className="content-panel stack">
          <h2 className="card-title">Course preview</h2>
          {course.youtubeLink ? (
            <div className="card" style={{ overflow: 'hidden' }}>
              <iframe
                width="100%"
                height="360"
                src={toEmbedUrl(course.youtubeLink)}
                title="Course video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 0, display: 'block' }}
              />
            </div>
          ) : (
            <div className="empty-state">
              <p className="card-copy">No video preview available yet.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="card modal-card stack">
            <div className="section-header" style={{ marginBottom: 0 }}>
              <h2 className="card-title">Enrollment inquiry</h2>
              <button className="icon-button" onClick={() => setShowModal(false)} aria-label="Close modal">×</button>
            </div>
            <textarea
              className="form-textarea"
              rows="4"
              placeholder="Any questions or messages?"
              value={inquiry}
              onChange={(event) => setInquiry(event.target.value)}
            />
            <div className="toolbar-actions" style={{ justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={submitInquiry} className="btn-primary">Submit inquiry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
