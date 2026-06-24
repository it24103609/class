import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card stack">
        <div className="stack">
          <span className="eyebrow">Welcome back</span>
          <h1 className="page-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>Sign in</h1>
          <p className="page-subheading">Pick up where you left off.</p>
        </div>

        <form onSubmit={handleSubmit} className="stack">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
          </div>
          <button type="submit" className="btn-primary">Login</button>
        </form>

        <p className="page-subheading text-center">
          Don’t have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
