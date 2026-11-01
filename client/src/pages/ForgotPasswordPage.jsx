
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Card from '../components/Card';
import API from '../api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await API.post('/api/auth/forgot-password', {
                email
            });

            const result = response.data;

            setMessage(result.message || 'If your account is eligible, a reset link will be sent.');
            setSubmitted(true);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                'Something went wrong.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '520px', margin: '3rem auto' }}>
            <Card style={{ padding: '2.5rem' }}>
                <Mail size={40} color="var(--color-forest)" />

                <h2 style={{ color: 'var(--color-forest)', marginTop: '1rem' }}>
                    Forgot Password?
                </h2>

                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                    Enter the email address associated with your account. If it is eligible,
                    we'll send you a link to reset your password.
                </p>

                {error && (
                    <div style={{ color: 'var(--color-brick)', marginBottom: '1rem' }}>
                        <AlertCircle size={16} style={{ verticalAlign: 'middle' }} /> {error}
                    </div>
                )}

                {submitted ? (
                    <div>
                        <CheckCircle size={30} color="var(--color-forest)" />
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                            {message}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                            Check your inbox and spam folder.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'} <ArrowRight size={16} />
                        </button>
                    </form>
                )}

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link to="/login" style={{ color: 'var(--color-brick)', fontWeight: 600 }}>
                        Back to Sign In
                    </Link>
                </div>
            </Card>
        </div>
    );
}
