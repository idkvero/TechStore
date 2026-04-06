import React from 'react';

function Badge({ text, color = 'cyan' }) {
  if (!text) return null;

  return <span className={`badge badge--${color}`}>{text}</span>;
}

export default Badge;
