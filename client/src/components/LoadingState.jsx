import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import Card from './Card';

export default function LoadingState({ onComplete }) {
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    'Resume uploaded',
    'Resume text extracted',
    'Comparing with job description',
    'Identifying skill gaps',
    'Generating recommendations'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 900);

    return () => clearInterval(timer);
  }, [stages.length]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '540px', margin: '3rem auto 0 auto', textCenter: 'center' }}>
      <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-bg)',
          border: '2px solid var(--color-forest)',
          color: 'var(--color-forest)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <Loader2 className="animate-pulse" size={28} style={{ animation: 'spin 1.5s linear infinite' }} />
        </div>

        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.4rem', color: 'var(--color-forest)' }}>
          Analyzing your resume...
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', marginBottom: '2rem' }}>
          Comparing your experience, skills and resume structure against the target role.
        </p>

        {/* Stages Checklist */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          textAlign: 'left',
          backgroundColor: 'var(--color-bg)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)'
        }}>
          {stages.map((stage, idx) => {
            const isFinished = idx < stageIndex;
            const isCurrent = idx === stageIndex;

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: isFinished ? 'var(--color-forest)' : (isCurrent ? 'var(--color-brick)' : 'transparent'),
                  border: isFinished ? 'none' : (isCurrent ? '2px solid var(--color-brick)' : '2px solid var(--color-border-dark)'),
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>
                  {isFinished ? <Check size={13} /> : (isCurrent ? '●' : '○')}
                </div>
                <span style={{
                  fontSize: '0.9rem',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isFinished ? 'var(--color-forest)' : (isCurrent ? 'var(--color-brick)' : 'var(--color-text-muted)')
                }}>
                  {stage}
                </span>
              </div>
            );
          })}
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Card>
    </div>
  );
}
