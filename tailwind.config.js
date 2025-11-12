/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Three-tone purposeful palette
      colors: {
        // Warm accent - Amber glow
        accent: {
          50: '#FFF9F0',
          100: '#FFF2E0',
          200: '#FFE4C2',
          300: '#FFD39B',
          400: '#FFB865',
          500: '#FF9F3D', // Primary accent
          600: '#E8861F',
          700: '#C76F12',
          800: '#9E5A0F',
          900: '#7A450C',
        },
        // Cool neutral - Slate with blue undertones
        neutral: {
          50: '#F8FAFB',
          100: '#F1F4F7',
          200: '#E3E9EF',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096', // Primary neutral
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#0F1419',
        },
        // Deep grounding - Rich charcoal
        ground: {
          50: '#F7F7F8',
          100: '#EEEEF0',
          200: '#D9D9DD',
          300: '#B8B8C0',
          400: '#8A8A96',
          500: '#5C5C6B',
          600: '#404050',
          700: '#2B2B38', // Primary ground
          800: '#1C1C26',
          900: '#121218',
        },
      },
      // Typography - Geometric sans + Humanist serif
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        display: ['Space Grotesk', 'Inter var', 'sans-serif'], // For headings
      },
      // Typographic scale with 10px baseline
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.005em' }],   // 14px
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],           // 16px
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.005em' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],    // 20px
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.015em' }],   // 24px
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],  // 30px
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],  // 36px
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],      // 48px
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      // Spacing - 10px baseline rhythm (0.625rem base)
      spacing: {
        '0.5': '0.3125rem',  // 5px
        '1': '0.625rem',     // 10px
        '1.5': '0.9375rem',  // 15px
        '2': '1.25rem',      // 20px
        '2.5': '1.5625rem',  // 25px
        '3': '1.875rem',     // 30px
        '4': '2.5rem',       // 40px
        '5': '3.125rem',     // 50px
        '6': '3.75rem',      // 60px
      },
      // Border radius - soft and consistent
      borderRadius: {
        'sm': '0.5rem',      // 8px
        DEFAULT: '0.75rem',  // 12px
        'md': '0.875rem',    // 14px
        'lg': '1.125rem',    // 18px
        'xl': '1.5rem',      // 24px
        '2xl': '2rem',       // 32px
      },
      // Box shadows - soft, color-tinted, no pure black
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(31, 41, 55, 0.08)',
        'sm': '0 2px 4px -1px rgba(31, 41, 55, 0.06), 0 1px 2px -1px rgba(31, 41, 55, 0.04)',
        DEFAULT: '0 4px 6px -1px rgba(31, 41, 55, 0.08), 0 2px 4px -2px rgba(31, 41, 55, 0.05)',
        'md': '0 8px 16px -4px rgba(31, 41, 55, 0.10), 0 4px 8px -4px rgba(31, 41, 55, 0.06)',
        'lg': '0 18px 36px -8px rgba(31, 41, 55, 0.12), 0 8px 16px -8px rgba(31, 41, 55, 0.08)',
        'xl': '0 24px 48px -12px rgba(31, 41, 55, 0.18), 0 12px 24px -12px rgba(31, 41, 55, 0.12)',
        // Tinted shadows
        'accent': '0 4px 14px -2px rgba(255, 159, 61, 0.25), 0 2px 6px -2px rgba(255, 159, 61, 0.15)',
        'accent-lg': '0 18px 36px -8px rgba(255, 159, 61, 0.30), 0 8px 16px -8px rgba(255, 159, 61, 0.20)',
        // Elevated state
        'elevated': '0 12px 24px -6px rgba(31, 41, 55, 0.15), 0 6px 12px -6px rgba(31, 41, 55, 0.10)',
        // Inner shadows for depth
        'inner': 'inset 0 2px 4px 0 rgba(31, 41, 55, 0.06)',
        'inner-lg': 'inset 0 4px 8px 0 rgba(31, 41, 55, 0.10)',
      },
      // Animations - Framer Motion inspired
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '40': '40ms',
        '220': '220ms',
        '280': '280ms',
      },
      // Gradient overlays
      backgroundImage: {
        'warm-overlay': 'linear-gradient(135deg, rgba(255, 159, 61, 0.18) 0%, rgba(255, 180, 101, 0.12) 100%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF9F3D 0%, #FFB865 100%)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(255, 159, 61, 0.1) 0%, rgba(255, 180, 101, 0.05) 100%)',
      },
      // Backdrop blur for frosted glass
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      // Keyframes for micro-interactions
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in-up': 'fade-in-up 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};