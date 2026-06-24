import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card stack">
        <div className="stack">
          <span className="eyebrow">Join us</span>
          <h1 className="page-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>Create account</h1>
          <p className="page-subheading">Start learning with a smoother, more polished experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="stack">
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>

        <p className="page-subheading text-center">
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
