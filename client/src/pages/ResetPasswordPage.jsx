
import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import API from '../api';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token || !email) {
            setError('Invalid or incomplete password reset link.');
            return;
        }

        if (password.length < 6) {
            setError('Password must contain at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const response = await API.post('/api/auth/reset-password', {
                token,
                email,
                password
            });

            setSuccess(true);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.message ||
                'Password reset failed.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="animate-fade-in"
            style={{ maxWidth: '520px', margin: '3rem auto' }}
        >
            <Card style={{ padding: '2.5rem' }}>
                {success ? (
                    <>
                        <CheckCircle size={44} color="var(--color-forest)" />

                        <h2 style={{
                            color: 'var(--color-forest)',
                            marginTop: '1rem'
                        }}>
                            Password Updated!
                        </h2>

                        <p style={{
                            color: 'var(--color-text-muted)',
                            lineHeight: 1.7
                        }}>
                            Your password has been changed successfully.
                            You can now sign in using your new password.
                        </p>

                        <Link
                            to="/login"
                            className="btn btn-primary"
                            style={{
                                display: 'inline-block',
                                marginTop: '1rem',
                                padding: '0.85rem 1.5rem'
                            }}
                        >
                            Continue to Sign In
                        </Link>
                    </>
                ) : (
                    <>
                        <Lock size={40} color="var(--color-forest)" />

                        <h2 style={{
                            color: 'var(--color-forest)',
                            marginTop: '1rem'
                        }}>
                            Reset Password
                        </h2>

                        <p style={{
                            color: 'var(--color-text-muted)',
                            marginBottom: '1.5rem'
                        }}>
                            Choose a new password for your ResumeIQ account.
                        </p>

                        {error && (
                            <div style={{
                                color: 'var(--color-brick)',
                                marginBottom: '1rem'
                            }}>
                                <AlertCircle
                                    size={16}
                                    style={{ verticalAlign: 'middle' }}
                                />{' '}
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    className="form-input"
                                    minLength={6}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Confirm New Password
                                </label>

                                <input
                                    type="password"
                                    className="form-input"
                                    minLength={6}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem',
                                    marginTop: '1rem'
                                }}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </>
                )}
            </Card>
        </div>
    );
}
