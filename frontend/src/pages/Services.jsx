import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Building2 } from 'lucide-react';

const services = [
  {
    icon: BookOpen,
    title: 'Premium courses',
    description: 'Well-structured learning paths for programming, design, and business.',
    cta: { label: 'Browse courses', to: '/courses' },
  },
  {
    icon: Users,
    title: '1-on-1 mentorship',
    description: 'Personal guidance and support for learners who want faster progress.',
    cta: { label: 'Register now', to: '/register' },
  },
  {
    icon: Building2,
    title: 'Corporate training',
    description: 'Tailored training programs for teams that need practical upskilling.',
    cta: { label: 'Contact support', to: '/about' },
  },
];

const Services = () => {
  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">Services</span>
          <h1 className="page-heading">Everything is styled to feel consistent and usable.</h1>
          <p className="page-subheading">A cleaner services page that looks good on mobile too.</p>
        </div>
      </div>

      <div className="service-grid">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <article key={service.title} className="card">
              <div className="card-body stack">
                <div className="icon-button" style={{ width: '56px', height: '56px' }}>
                  <Icon size={26} />
                </div>
                <h2 className="card-title">{service.title}</h2>
                <p className="card-copy">{service.description}</p>
                <Link to={service.cta.to} className="btn-secondary" style={{ width: 'fit-content' }}>
                  {service.cta.label}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
