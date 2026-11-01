import React from 'react';

export default function Badge({ children, variant = 'forest', icon: Icon }) {
  let badgeClass = 'badge-forest';
  if (variant === 'brick') badgeClass = 'badge-brick';
  if (variant === 'gold') badgeClass = 'badge-gold';

  return (
    <span className={`badge ${badgeClass}`}>
      {Icon && <Icon size={13} />}
      {children}
    </span>
  );
}
