
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import Card from '../components/Card';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [registered, setRegistered] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);

    try {
      const result = await register(fullName, email, password, mobile);

      setEmailSent(result.emailSent !== false);
      setRegistered(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
        throw new Error(result.error || 'Could not resend verification email.');
      }

      setResendMessage('If your account needs verification, a new email has been sent.');
    } catch (err) {
      setError(err.message || 'Could not resend verification email.');
    } finally {
      setResending(false);
    }
  };

  if (registered) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '520px', margin: '2rem auto' }}>
        <Card style={{ padding: '2.5rem', textAlign: 'center' }}>
          <CheckCircle size={48} color="var(--color-forest)" style={{ marginBottom: '1rem' }} />

          <h2 style={{ fontSize: '1.8rem', color: 'var(--color-forest)', marginBottom: '0.75rem' }}>
            Check your inbox
          </h2>

          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            Your account has been created. We sent a verification link to:
          </p>

          <p style={{ fontWeight: 600, margin: '1rem 0', overflowWrap: 'anywhere' }}>
            {email}
          </p>

          {emailSent ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Open the email and click <strong>Verify Email</strong> to activate your account.
              The link expires in 24 hours.
            </p>
          ) : (
            <p style={{ color: 'var(--color-brick)', fontSize: '0.9rem' }}>
              Your account was created, but the email could not be sent. Please try resending it.
            </p>
          )}

          {error && <p style={{ color: 'var(--color-brick)', marginTop: '1rem' }}>{error}</p>}

          {resendMessage && (
            <p style={{ color: 'var(--color-forest)', marginTop: '1rem', fontSize: '0.9rem' }}>
              {resendMessage}
            </p>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleResend}
            disabled={resending}
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }}
          >
            {resending ? 'Sending...' : 'Resend Verification Email'}
          </button>

          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            Already verified? <Link to="/login" style={{ color: 'var(--color-brick)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '520px', margin: '2rem auto' }}>
      <Card style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', color: 'var(--color-forest)' }}>
          Create Candidate Account
        </h2>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Register to evaluate resumes against target job descriptions and track score history.
        </p>

        {error && (
          <div style={{
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
          }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password * (Min 6 chars)</label>
            <input
              type="password"
              className="form-input"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number (Optional)</label>
            <input
              type="tel"
              className="form-input"
              placeholder="+91 98765 43210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }}
          >
            {submitting ? 'Creating Account...' : 'Create Account'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{
          marginTop: '1.75rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)',
          borderTop: '1px solid var(--color-border)',
          paddingTop: '1.25rem'
        }}>
          Already registered?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-brick)' }}>
            Sign In Here
          </Link>
        </div>
      </Card>
    </div>
  );
}
