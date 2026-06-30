import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';

const emptyForm = { name: '', email: '', phone: '', message: '' };

const PurchaseModal = ({ product, productType, onClose, onSuccess }) => {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axios.post(apiUrl('/api/purchases'), {
        productType,
        productId: product._id,
        productName: product.name,
        ...form,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="card modal-card stack">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <h2 className="card-title">Buy {product.name}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <p className="card-copy" style={{ marginTop: '-0.5rem' }}>
          Fill in your details. Our team will contact you shortly.
        </p>

        <form className="stack" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input className="form-input" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Message (optional)</label>
            <textarea className="form-textarea" value={form.message} onChange={(e) => handleChange('message', e.target.value)} />
          </div>

          {error && <p className="card-copy" style={{ color: 'var(--danger)' }}>{error}</p>}

          <div className="toolbar-actions" style={{ justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseModal;
