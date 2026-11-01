import React from 'react';

export default function ScoreCircle({ score = 0, size = 160, matchRating = 'Moderate Match' }) {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine accent color within ResumeIQ palette
  let strokeColor = '#2F4034'; // Forest Green for high match
  if (score < 60) strokeColor = '#A43D35'; // Brick Red for low match
  else if (score < 75) strokeColor = '#D6A83D'; // Warm Gold for moderate match

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem'
    }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#EFE8DA"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>

        {/* Center Label */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: size > 140 ? '2.75rem' : '2rem',
            fontWeight: 'bold',
            color: 'var(--color-forest)',
            lineHeight: 1
          }}>
            {score}
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            letterSpacing: '0.05em'
          }}>
            / 100
          </span>
        </div>
      </div>

      {matchRating && (
        <span className={`badge ${score >= 75 ? 'badge-forest' : (score >= 60 ? 'badge-gold' : 'badge-brick')}`} style={{
          fontSize: '0.9rem',
          padding: '0.35rem 1rem',
          fontWeight: 600
        }}>
          {matchRating}
        </span>
      )}
    </div>
  );
}
