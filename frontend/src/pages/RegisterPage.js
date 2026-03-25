import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [step, setStep] = useState('register');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const [otp, setOtp] = useState('');

  const { register, verifyOtp, loading } = useAuth();

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register(name, email, password, role);
      toast.success('Registration successful! Check your email for the OTP.');
      setStep('verify');
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      await verifyOtp(email, otp);
      toast.success('Email verified! You can now log in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'OTP verification failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-card fade-in">
        {step === 'register' ? (
          <>
            <h1 className="auth-title">
              Create Account <span className="gradient-text">🚀</span>
            </h1>
            <p className="auth-subtitle">Join ShopElite to start shopping</p>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  className="form-input"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email"
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  className="form-input"
                  type="password"
                  placeholder="Min. 6 characters with a number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-role">Account Type</label>
                <select
                  id="reg-role"
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Shopper (User)</option>
                  <option value="admin">Seller (Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 8 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="auth-title">
              Verify Email <span className="gradient-text">📧</span>
            </h1>
            <p className="auth-subtitle">
              Enter the 6-digit OTP sent to <strong>{email}</strong>
            </p>

            <form onSubmit={handleVerify}>
              <div className="form-group">
                <label className="form-label" htmlFor="otp-input">OTP Code</label>
                <input
                  id="otp-input"
                  className="form-input"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 8 }}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <p className="auth-footer">
              <button
                onClick={() => setStep('register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-start)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: 'inherit'
                }}
              >
                ← Back to registration
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;