import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../config/api';
import ProductCard from '../components/ProductCard';
import PurchaseModal from '../components/PurchaseModal';

const MobileApps = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios
      .get(apiUrl('/api/mobileapps'))
      .then((response) => setApps(response.data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Portfolio</span>
          <h1 className="page-heading">Mobile apps</h1>
          <p className="page-subheading">
            Modern mobile applications with demos, reviews, and easy purchase requests.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="content-panel" style={{ marginBottom: '1.5rem' }}>
          <p className="card-copy" style={{ color: 'var(--success)', margin: 0 }}>{successMessage}</p>
        </div>
      )}

      {loading ? (
        <div className="empty-state">Loading mobile apps...</div>
      ) : apps.length === 0 ? (
        <div className="empty-state">
          <p className="card-copy">No mobile apps available yet. Check back soon.</p>
        </div>
      ) : (
        <div className="course-grid">
          {apps.map((app) => (
            <ProductCard
              key={app._id}
              item={app}
              extraLabel={app.platform}
              onBuy={setSelectedProduct}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <PurchaseModal
          product={selectedProduct}
          productType="mobileapp"
          onClose={() => setSelectedProduct(null)}
          onSuccess={() => setSuccessMessage('✅ Your purchase request was sent. We will contact you soon.')}
        />
      )}
    </div>
  );
};

export default MobileApps;
