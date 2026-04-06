import React from 'react';

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}) {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const disabledClass = disabled ? 'btn--disabled' : '';

  const className = [baseClass, variantClass, sizeClass, disabledClass]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (disabled) return;
    console.log('Button clicked:', children);
    if (onClick) onClick();
  };

  return (
    <button
      className={className}
      onClick={handleClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

export default Button;
