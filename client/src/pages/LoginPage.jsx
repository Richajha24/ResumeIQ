
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  AlertCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Card from '../components/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setUnverified(false);
    setResendMessage('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');

      if (err.code === 'EMAIL_NOT_VERIFIED') {
        setUnverified(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendMessage('');
    setError('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Could not send verification email.');
      }

      setResendMessage(
        'If your account needs verification, a new email will be sent.'
      );
    } catch (err) {
      setError(err.message || 'Could not resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        maxWidth: '920px',
        margin: '2rem auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'stretch'
      }}
    >
      {/* Left Branding Side */}
      <div
        style={{
          backgroundColor: 'var(--color-forest)',
          color: 'var(--color-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              marginBottom: '1.5rem',
              color: 'var(--color-card)'
            }}
          >
            Resume<span style={{ color: 'var(--color-gold)' }}>IQ</span>
          </div>

          <h2
            style={{
              color: 'var(--color-card)',
              fontSize: '2rem',
              marginBottom: '1rem',
              lineHeight: 1.3
            }}
          >
            Elevate your resume compatibility.
          </h2>

          <p style={{ color: '#D0D8D2', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Sign in to access your analysis history, review ATS formatting
            warnings, and optimize your resume for target positions.
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            marginTop: '2rem',
            fontSize: '0.85rem',
            color: '#E2E8E4'
          }}
        >
          <strong>Your ResumeIQ workspace</strong>
          <p style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>
            Your resume analyses, compatibility scores, and saved reports
            are waiting for you.
          </p>
        </div>
      </div>

      {/* Right Login Form */}
      <Card style={{ padding: '2.5rem' }}>
        <h2
          style={{
            fontSize: '1.75rem',
            marginBottom: '0.25rem',
            color: 'var(--color-forest)'
          }}
        >
          Candidate Sign In
        </h2>

        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.9rem',
            marginBottom: '1.75rem'
          }}
        >
          Enter your registered email address and password.
        </p>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--color-brick-light)',
              border: '1px solid rgba(164, 61, 53, 0.3)',
              color: 'var(--color-brick)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {unverified && (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="btn btn-primary"
            style={{
              width: '100%',
              marginBottom: '1rem',
              padding: '0.75rem'
            }}
          >
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </button>
        )}

        {resendMessage && (
          <p
            style={{
              color: 'var(--color-forest)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <CheckCircle size={16} /> {resendMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>

            <div style={{ position: 'relative' }}>
              <Mail
                size={17}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }}
              />

              <input
                type="email"
                className="form-input"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>

            <div style={{ position: 'relative' }}>
              <Lock
                size={17}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }}
              />

              <input
                type="password"
                className="form-input"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <Link
                to="/forgot-password"
                style={{
                  color: 'var(--color-brick)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '0.85rem'
            }}
          >
            {submitting ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div
          style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '1.25rem'
          }}
        >
          Don't have an account yet?{' '}
          <Link
            to="/register"
            style={{ fontWeight: 600, color: 'var(--color-brick)' }}
          >
            Create an Account
          </Link>
        </div>
      </Card>
    </div>
  );
}
