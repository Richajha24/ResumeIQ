import React from 'react';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep = 1 }) {
  const steps = [
    { num: 1, title: 'Upload Resume' },
    { num: 2, title: 'Job Description' },
    { num: 3, title: 'Confirm & Analyze' },
    { num: 4, title: 'Analysis Results' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      margin: '0 auto 2rem auto',
      maxWidth: '750px',
      padding: '0.75rem 1rem',
      backgroundColor: 'var(--color-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)'
    }}>
      {steps.map((step, idx) => {
        const isDone = currentStep > step.num;
        const isCurrent = currentStep === step.num;

        return (
          <React.Fragment key={step.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: isDone ? 'var(--color-forest)' : (isCurrent ? 'var(--color-brick)' : '#E8E1D5'),
                color: (isDone || isCurrent) ? '#FFFFFF' : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}>
                {isDone ? <Check size={14} /> : `0${step.num}`}
              </div>
              <span style={{
                fontSize: '0.875rem',
                fontWeight: isCurrent ? 600 : 500,
                color: isCurrent ? 'var(--color-forest)' : (isDone ? 'var(--color-text-main)' : 'var(--color-text-muted)')
              }}>
                {step.title}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: isDone ? 'var(--color-forest)' : 'var(--color-border)',
                minWidth: '20px'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
