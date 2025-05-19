import React, { ReactNode } from 'react';

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export const H1: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1 className={`text-3xl font-bold tracking-tight text-gray-900 ${className}`}>
    {children}
  </h1>
);

export const H2: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h2 className={`text-2xl font-semibold tracking-tight text-gray-900 ${className}`}>
    {children}
  </h2>
);

export const H3: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold tracking-tight text-gray-900 ${className}`}>
    {children}
  </h3>
);

export const H4: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h4 className={`text-lg font-medium text-gray-900 ${className}`}>
    {children}
  </h4>
);

export const Text: React.FC<TypographyProps & { variant?: 'default' | 'secondary' | 'muted' }> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'text-gray-900',
    secondary: 'text-gray-700',
    muted: 'text-gray-500',
  };

  return (
    <p className={`text-base leading-relaxed ${variantClasses[variant]} ${className}`}>
      {children}
    </p>
  );
};

export const SmallText: React.FC<TypographyProps & { variant?: 'default' | 'secondary' | 'muted' }> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'text-gray-900',
    secondary: 'text-gray-700',
    muted: 'text-gray-500',
  };

  return (
    <p className={`text-sm leading-relaxed ${variantClasses[variant]} ${className}`}>
      {children}
    </p>
  );
};

export const Label: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <label className={`block text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

export const Caption: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`text-xs text-gray-500 ${className}`}>
    {children}
  </span>
); 