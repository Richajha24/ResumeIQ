
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import Card from '../components/Card';

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Verifying your email address...');

    useEffect(() => {
        const verify = async () => {
            const token = searchParams.get('token');
            const email = searchParams.get('email');

            if (!token || !email) {
                setStatus('error');
                setMessage('The verification link is incomplete or invalid.');
                return;
            }

            try {
                const response = await fetch('/api/auth/verify-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, email })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Email verification failed.');
                }

                setStatus('success');
                setMessage(result.message || 'Your email has been verified successfully.');
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Unable to verify your email.');
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="animate-fade-in" style={{
            maxWidth: '520px',
            margin: '3rem auto'
        }}>
            <Card style={{ padding: '2.5rem', textAlign: 'center' }}>

                {status === 'loading' && (
                    <>
                        <Loader
                            size={44}
                            color="var(--color-forest)"
                            style={{ marginBottom: '1rem' }}
                        />
                        <h2 style={{ color: 'var(--color-forest)' }}>
                            Verifying your email
                        </h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle
                            size={48}
                            color="var(--color-forest)"
                            style={{ marginBottom: '1rem' }}
                        />
                        <h2 style={{ color: 'var(--color-forest)' }}>
                            Email Verified!
                        </h2>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <AlertCircle
                            size={48}
                            color="var(--color-brick)"
                            style={{ marginBottom: '1rem' }}
                        />
                        <h2 style={{ color: 'var(--color-forest)' }}>
                            Verification Failed
                        </h2>
                    </>
                )}

                <p style={{
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.7,
                    margin: '1rem 0 1.5rem'
                }}>
                    {message}
                </p>

                {status === 'success' && (
                    <Link
                        to="/login"
                        className="btn btn-primary"
                        style={{
                            display: 'inline-block',
                            padding: '0.85rem 1.5rem',
                            textDecoration: 'none'
                        }}
                    >
                        Continue to Sign In
                    </Link>
                )}

                {status === 'error' && (
                    <Link
                        to="/register"
                        className="btn btn-primary"
                        style={{
                            display: 'inline-block',
                            padding: '0.85rem 1.5rem',
                            textDecoration: 'none'
                        }}
                    >
                        Back to Registration
                    </Link>
                )}

            </Card>
        </div>
    );
}
