import React from 'react';

const values = [
  {
    title: 'Practical learning',
    description: 'Courses focus on skills people can actually use in the real world.',
  },
  {
    title: 'Friendly support',
    description: 'Students and admins get a calmer, cleaner experience across the app.',
  },
  {
    title: 'Built to scale',
    description: 'The layout stays usable on mobile, tablet, and desktop without extra effort.',
  },
];

const About = () => {
  return (
    <div className="container section">
      <div className="section-header">
        <div className="stack">
          <span className="eyebrow">About us</span>
          <h1 className="page-heading">Learning that feels structured, modern, and human.</h1>
          <p className="page-subheading">
            Quick Learn Academy is a premium online learning space built to help people grow skills with less friction.
          </p>
        </div>
      </div>

      <div className="split-layout">
        <div className="content-panel stack">
          <h2 className="card-title">Our mission</h2>
          <p className="card-copy">
            We want online learning to feel calm and effective, not crowded or confusing. That means better spacing,
            clearer hierarchy, and layouts that adapt gracefully to smaller screens.
          </p>
          <p className="card-copy">
            The platform now has a stronger visual language across homepage, content pages, and admin tools.
          </p>
        </div>

        <div className="stack-lg">
          {values.map((value) => (
            <div key={value.title} className="card">
              <div className="card-body stack">
                <h3 className="card-title">{value.title}</h3>
                <p className="card-copy">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
