import React from 'react';

export const ScrollReveal = ({ children, className = '' }) => (
  <div className={`scroll-reveal ${className}`.trim()}>{children}</div>
);

export default ScrollReveal;
