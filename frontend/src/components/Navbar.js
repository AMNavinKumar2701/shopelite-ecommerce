import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiLogOut, FiUser, FiPackage } from 'react-icons/fi';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="gradient-text">🛒 ShopElite</span>
        </Link>

        <div className="navbar-nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <FiPackage style={{ marginRight: 4 }} />
            Products
          </Link>

          {isAuthenticated && !isAdmin && (
            <Link
              to="/cart"
              className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}
            >
              <FiShoppingCart style={{ marginRight: 4 }} />
              Cart
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <span className="nav-link" style={{ cursor: 'default', color: 'var(--accent)' }}>
                <FiUser style={{ marginRight: 4 }} />
                {user?.name} ({user?.role})
              </span>
              <button className="btn btn-secondary btn-sm" onClick={logout}>
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;