// Brand color palette from guidelines
export const colors = {
  // Primary Colors
  primary: {
    darkBlue: '#013534', // R1-G48-B81
    mint: '#44D0B6', // R66-C2DB-B159
    teal: '#117378', // R19-G115-B120
    white: '#FFFFFF',
  },
  // Secondary Colors
  secondary: {
    sage: '#83C149', // R131-G193-B73
    olive: '#324225', // R50-G66-B37
    coral: '#F38D8B', // R228-G149-B139
    sand: '#D3B888', // R211-G184-B136
    beige: '#E7D8AF', // R231-G216-B175
    paleGreen: '#C9D8AB', // R201-G216-B171
    brown: '#736F6A', // R115-G111-B106
  },
  // UI Elements
  ui: {
    background: '#F8F9FA',
    card: '#FFFFFF',
    border: '#E2E8F0',
    hover: '#F1F5F9',
    focus: '#EBF4FF',
  },
  // Text
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
    muted: '#718096',
    light: '#A0AEC0',
  },
  // Status
  status: {
    success: '#38A169',
    warning: '#DD6B20',
    error: '#E53E3E',
    info: '#3182CE',
  }
};

// Typography
export const typography = {
  fontFamily: {
    primary: '"Montserrat", sans-serif',
    secondary: '"Noto Sans", sans-serif',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
};

// Spacing
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};

// Borders
export const borders = {
  none: 'none',
  sm: '1px solid',
  md: '2px solid',
  lg: '4px solid',
  radius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// Animation
export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },
  easing: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

const theme = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  animation,
  breakpoints,
};

export default theme; 