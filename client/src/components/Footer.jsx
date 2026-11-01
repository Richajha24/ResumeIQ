import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: 'var(--color-card)',
      borderTop: '1px solid var(--color-border)',
      padding: '2rem 1.5rem',
      marginTop: 'auto',
      color: 'var(--color-text-muted)',
      fontSize: '0.875rem'
    }}>
      <div style={{
        maxWidth: '1140px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: 'var(--color-forest)', fontSize: '1.05rem' }}>
            Resume<span style={{ color: 'var(--color-brick)' }}>IQ</span>
          </span>
          <span style={{ marginLeft: '0.75rem' }}>
            AI-Powered Resume Analyzer & ATS Score Checker
          </span>
        </div>
        <div>
          © {new Date().getFullYear()} ResumeIQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
