import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
}

export function Button({
  children,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const baseStyle = {
    cursor: 'pointer',
    padding: '8px 16px',
    border: variant === 'outline' ? '1px solid #333' : 'none',
    backgroundColor: variant === 'primary' ? '#4a7dfc' : 'transparent',
    color: variant === 'primary' ? 'white' : '#333',
    borderRadius: '4px',
    fontSize: '14px',
    ...props.style,
  };

  return (
    <button style={baseStyle} {...props}>
      {children}
    </button>
  );
}
