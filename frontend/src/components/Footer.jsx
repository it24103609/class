import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="container">
        <div className="footer-grid">
          <div className="stack">
            <Link to="/" className="navbar-brand" style={{ width: 'fit-content' }}>
              <img src="/logo.png" alt="Quick Learn Academy" />
            </Link>
            <p className="page-subheading">
              A polished learning platform built to help people grow with confidence, clarity, and momentum.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Contact</h4>
            <ul className="footer-list">
              <li>hello@quicklearn.com</li>
              <li>+1 234 567 890</li>
              <li>Mon - Fri, 9AM - 6PM</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Quick Learn Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
