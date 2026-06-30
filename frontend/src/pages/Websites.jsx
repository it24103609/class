import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';
import ProductCard from '../components/ProductCard';
import PurchaseModal from '../components/PurchaseModal';

const Websites = () => {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios
      .get(apiUrl('/api/websites'))
      .then((response) => setWebsites(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Portfolio</span>
          <h1 className="page-heading">Ready-made websites</h1>
          <p className="page-subheading">
            Professionally built websites with live demos, reviews, and instant purchase requests.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="content-panel" style={{ marginBottom: '1.5rem' }}>
          <p className="card-copy" style={{ color: 'var(--success)', margin: 0 }}>{successMessage}</p>
        </div>
      )}

      {loading ? (
        <div className="empty-state">Loading websites...</div>
      ) : websites.length === 0 ? (
        <div className="empty-state">
          <p className="card-copy">No websites available yet. Check back soon.</p>
        </div>
      ) : (
        <div className="course-grid">
          {websites.map((website) => (
            <ProductCard
              key={website._id}
              item={website}
              onBuy={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          productType="website"
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => setSuccessMessage('✅ Your purchase request was sent. We will contact you soon.')}
        />
      )}
    </div>
  );
};

export default Websites;
