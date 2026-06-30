import React from 'react';
import { ExternalLink, Star } from 'lucide-react';

const averageRating = (reviews = []) => {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length;
};

const ProductCard = ({ item, onBuy, extraLabel }) => {
  const rating = averageRating(item.reviews);

  return (
    <article className="card card-surface">
      {item.imageUrl && (
        <img className="card-media" src={item.imageUrl} alt={item.name} />
      )}
      <div className="card-body stack">
        <div className="section-header" style={{ marginBottom: 0, alignItems: 'start' }}>
          <div className="stack" style={{ gap: '0.35rem' }}>
            {item.featured && <span className="badge badge-warning" style={{ width: 'fit-content' }}>Featured</span>}
            <h3 className="card-title">{item.name}</h3>
            {extraLabel && <p className="card-copy">{extraLabel}</p>}
          </div>
          {rating > 0 && (
            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Star size={14} fill="currentColor" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        <p className="card-copy">{item.description}</p>

        {item.techStack && (
          <span className="badge badge-neutral" style={{ width: 'fit-content' }}>{item.techStack}</span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {item.originalPrice > item.price && (
            <span style={{ textDecoration: 'line-through', color: 'var(--muted)', fontSize: '0.9rem' }}>
              ₹{item.originalPrice}
            </span>
          )}
          <strong style={{ fontSize: '1.25rem' }}>₹{item.price}</strong>
        </div>

        {item.reviews?.length > 0 && (
          <div className="stack" style={{ gap: '0.5rem', marginTop: '0.25rem' }}>
            <p className="card-copy" style={{ fontWeight: 600, margin: 0 }}>Reviews</p>
            {item.reviews.slice(0, 2).map((review) => (
              <div key={review._id} style={{ padding: '0.75rem', background: 'var(--surface-strong)', borderRadius: '12px' }}>
                <p className="card-copy" style={{ margin: 0, fontWeight: 600 }}>{review.author}</p>
                <p className="card-copy" style={{ margin: 0, fontSize: '0.9rem' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="toolbar-actions">
          {item.deployLink && (
            <a href={item.deployLink} target="_blank" rel="noreferrer" className="btn-secondary">
              <ExternalLink size={16} />
              Live demo
            </a>
          )}
          <button type="button" className="btn-primary" onClick={() => onBuy(item)}>
            Buy now
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
