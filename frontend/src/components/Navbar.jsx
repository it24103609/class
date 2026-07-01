import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Moon, Sun, LogOut, LayoutDashboard } from 'lucide-react';
import './Navbar.css';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/websites', label: 'Websites' },
  { to: '/mobileapps', label: 'Mobile Apps' },
  { to: '/courses', label: 'Courses' },
  { to: '/blog', label: 'Blog' },
   
  
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar-container">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <img src="/logo.png" alt="Quick Learn Academy" />
          </Link>

          <nav className="navbar-links">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-actions">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn-ghost desktop-only">
                  <LayoutDashboard size={18} />
                  {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="icon-button" aria-label="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost desktop-only">
                  Login
                </Link>
                <Link to="/register" className="btn-primary desktop-only">
                  Register
                </Link>
              </>
            )}

            <button onClick={toggleTheme} className="icon-button" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              className="icon-button mobile-menu-toggle"
              onClick={() => setMenuOpen((current) => !current)}
              aria-label="Toggle menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-panel">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
              {user ? (
                <>
                  <NavLink to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMenuOpen(false)}>
                    {user.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
                  </NavLink>
                  <button className="btn-secondary" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <div className="toolbar-actions">
                  <Link to="/login" className="btn-secondary" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary" onClick={() => setMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;