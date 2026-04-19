const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ─────────────────────────────────────────
         COLOR PALETTE - SOFT PREMIUM AESTHETIC
         ───────────────────────────────────────── */
      colors: {
        // Primary Brand Colors
        white: '#FFFFFF',
        black: '#000000',
        
        // Soft Beige - Main Background
        cream: {
          50: '#FEFDFB',
          100: '#F9F7F5',
          200: '#F5EDEC', // Main background
        },
        
        // Dark Brown - Primary Color for Buttons, Text, Footer
        brown: {
          700: '#533638', // Primary dark brown
          800: '#3D2728',
          900: '#2A1A1B',
        },
        
        // Soft Pink - Accent Color for Highlights, Badges, Hover
        rose: {
          200: '#F7B9C4', // Main accent pink
          300: '#F5A5B5',
          400: '#F08FA8',
          500: '#E67B99',
        },

        // White-Based System for Cards
        ghost: {
          50: '#FAFBFC',
          100: '#F9FAFB',
          200: '#F8FAFC',
        },

        // Text Colors
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          400: '#94A3B8',
          600: '#475569',
          800: '#1E293B',
          900: '#111827',
        },

        // Semantic Colors
        emerald: {
          500: '#10B981',
          600: '#059669',
        },
        amber: {
          500: '#F59E0B',
          600: '#D97706',
        },
        red: {
          500: '#EF4444',
          600: '#DC2626',
        },
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
        },

        // Aliases for common use
        surface: '#FFFFFF',
        'surface-secondary': '#F9FAFB',
        'surface-tertiary': '#F8FAFC',
        text: {
          primary: '#111827',
          secondary: '#475569',
          tertiary: '#94A3B8',
          muted: '#CBD5E1',
        },
        accent: '#1E293B',
        'accent-hover': '#0F172A',
      },

      /* ─────────────────────────────────────────
         TYPOGRAPHY
         ───────────────────────────────────────── */
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'ui-sans-serif', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        // Headings
        h1: ['48px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.8px' }],
        h2: ['36px', { lineHeight: '1.25', fontWeight: '700', letterSpacing: '0.6px' }],
        h3: ['28px', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.4px' }],
        h4: ['20px', { lineHeight: '1.35', fontWeight: '600', letterSpacing: '0.2px' }],
        h5: ['16px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0px' }],
        h6: ['14px', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0px' }],
        
        // Body
        'body-lg': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-xs': ['11px', { lineHeight: '1.4', fontWeight: '400' }],
        
        // Interactive
        'btn': ['14px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.5px' }],
        'label': ['12px', { lineHeight: '1.5', fontWeight: '500' }],
      },

      letterSpacing: {
        tight: '-0.5px',
        normal: '0px',
        wide: '0.5px',
        wider: '0.8px',
      },

      lineHeight: {
        tight: '1.2',
        snug: '1.3',
        normal: '1.5',
        relaxed: '1.75',
        loose: '2',
      },

      /* ─────────────────────────────────────────
         SPACING
         ───────────────────────────────────────── */
      spacing: {
        0: '0px',
        px: '1px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
        '5xl': '56px',
        '6xl': '64px',
        '7xl': '72px',
        '8xl': '80px',
      },

      /* ─────────────────────────────────────────
         BORDER RADIUS
         ───────────────────────────────────────── */
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        full: '9999px',
      },

      /* ─────────────────────────────────────────
         SHADOWS - SOFT PREMIUM (MINIMAL & DELICATE)
         ───────────────────────────────────────── */
      boxShadow: {
        none: 'none',
        'xs': '0 1px 2px rgba(83, 54, 56, 0.05)',
        'sm': '0 2px 4px rgba(83, 54, 56, 0.08)',
        'md': '0 4px 8px rgba(83, 54, 56, 0.10)',
        'lg': '0 8px 16px rgba(83, 54, 56, 0.12)',
        'xl': '0 12px 24px rgba(83, 54, 56, 0.15)',
        'premium': '0 16px 32px rgba(83, 54, 56, 0.18)',
        '2xl': '0 20px 40px rgba(83, 54, 56, 0.20)',
        'inner': 'inset 0 1px 2px rgba(83, 54, 56, 0.05)',
        
        // Rose/Pink accent shadows
        'rose': '0 8px 20px rgba(247, 185, 196, 0.25)',
        'rose-lg': '0 12px 32px rgba(247, 185, 196, 0.30)',
      },

      /* ─────────────────────────────────────────
         BACKDROP & GLASS EFFECT
         ───────────────────────────────────────── */
      backdropBlur: {
        none: '0',
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },

      /* ─────────────────────────────────────────
         TRANSITIONS & ANIMATIONS
         ───────────────────────────────────────── */
      transitionTimingFunction: {
        'material': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'elastic': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      transitionDuration: {
        75: '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms',
        300: '300ms',
        500: '500ms',
        700: '700ms',
        1000: '1000ms',
      },

      animation: {
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        fadeOut: {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        },
        slideUp: {
          'from': { transform: 'translateY(16px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          'from': { transform: 'translateY(-16px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        scaleIn: {
          'from': { transform: 'scale(0.95)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
      },

      /* ─────────────────────────────────────────
         LAYOUT & SIZES
         ───────────────────────────────────────── */
      width: {
        'screen-wide': '1440px',
        'screen-ultra': '1920px',
      },

      maxWidth: {
        'container': '1320px',
        'container-lg': '1440px',
      },

      minHeight: {
        'screen-short': '80vh',
      },

      /* ─────────────────────────────────────────
         OPACITY
         ───────────────────────────────────────── */
      opacity: {
        0: '0',
        5: '0.05',
        10: '0.1',
        20: '0.2',
        30: '0.3',
        40: '0.4',
        50: '0.5',
        60: '0.6',
        70: '0.7',
        80: '0.8',
        90: '0.9',
        95: '0.95',
        100: '1',
      },
    },
  },

  plugins: [
    // Inline plugin for custom utilities
    function ({ addBase, addComponents, addUtilities, theme }) {
      // Base styles
      addBase({
        // Smooth scrolling and antialiasing
        'html': {
          'scroll-behavior': 'smooth',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },

        // Default button reset
        'button': {
          'font-family': 'inherit',
          'cursor': 'pointer',
          'border': 'none',
          'background': 'none',
        },

        // Link defaults
        'a': {
          'text-decoration': 'none',
          'color': 'inherit',
          'transition': 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },

        // Image optimization
        'img': {
          'max-width': '100%',
          'height': 'auto',
          'display': 'block',
        },
      });

      // Component utilities
      addComponents({
        // Card components
        '.card': {
          '@apply bg-white rounded-lg px-lg py-lg border border-transparent': {},
          'box-shadow': 'var(--shadow-xs, 0 2px 8px rgba(0, 0, 0, 0.04))',
        },
        '.card-elevated': {
          '@apply bg-white rounded-lg border border-transparent transition-all duration-300': {},
          'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            'box-shadow': '0 12px 24px rgba(0, 0, 0, 0.08)',
            'transform': 'translateY(-2px)',
          },
        },
        '.card-premium': {
          '@apply bg-white rounded-lg border border-transparent': {},
          'box-shadow': '0 20px 48px rgba(0, 0, 0, 0.12)',
        },

        // Button components
        '.btn': {
          '@apply inline-flex items-center justify-center px-lg py-md rounded-lg font-btn transition-all duration-300 cursor-pointer': {},
        },
        '.btn-primary': {
          '@apply bg-charcoal-900 text-white hover:bg-charcoal-800': {},
          'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            'box-shadow': '0 8px 20px rgba(30, 41, 59, 0.2)',
            'transform': 'translateY(-2px)',
          },
          '&:active': {
            'transform': 'translateY(0)',
          },
        },
        '.btn-secondary': {
          '@apply bg-transparent text-charcoal-900 border-2 border-charcoal-200 hover:bg-ghost-50 hover:border-charcoal-900': {},
          '&:hover': {
            'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.05)',
          },
        },
        '.btn-accent': {
          '@apply bg-cobalt-700 text-white hover:bg-charcoal-800': {},
          'box-shadow': '0 2px 8px rgba(30, 41, 59, 0.15)',
          '&:hover': {
            'box-shadow': '0 8px 20px rgba(30, 41, 59, 0.3)',
            'transform': 'translateY(-2px)',
          },
        },
        '.btn-ghost': {
          '@apply bg-transparent text-charcoal-900 hover:bg-ghost-100': {},
        },

        // Input components
        '.input': {
          '@apply w-full h-11 px-lg py-md rounded-lg bg-white text-charcoal-900 border border-charcoal-200 transition-all duration-200': {},
          '&:focus': {
            '@apply outline-none border-cobalt-700': {},
            'box-shadow': '0 0 0 3px rgba(30, 41, 59, 0.1)',
          },
          '&::placeholder': {
            '@apply text-charcoal-400': {},
          },
        },

        // Badge components
        '.badge': {
          '@apply inline-flex items-center px-md py-xs rounded-full font-label': {},
        },
        '.badge-primary': {
          '@apply bg-cobalt-50 text-cobalt-700': {},
        },
        '.badge-secondary': {
          '@apply bg-charcoal-100 text-charcoal-800': {},
        },
        '.badge-success': {
          '@apply bg-emerald-50 text-emerald-600': {},
        },

        // Glass effect
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.92)',
          'backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(30, 41, 59, 0.08)',
        },
        '.glass-frosted': {
          'background': 'rgba(248, 250, 252, 0.9)',
          'backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(255, 255, 255, 0.3)',
        },

        // Text utilities
        '.text-truncate': {
          '@apply truncate': {},
        },
        '.text-clamp-2': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden',
        },
        '.text-clamp-3': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden',
        },
      });

      // Custom utilities
      addUtilities({
        '.transition-fast': {
          'transition-duration': '150ms',
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.transition-material': {
          'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.transition-smooth': {
          'transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        '.transition-bounce': {
          'transition-timing-function': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        },

        '.shadow-ambient-xs': {
          'box-shadow': '0 2px 8px rgba(0, 0, 0, 0.04)',
        },
        '.shadow-ambient-sm': {
          'box-shadow': '0 4px 12px rgba(0, 0, 0, 0.05)',
        },
        '.shadow-ambient-md': {
          'box-shadow': '0 8px 16px rgba(0, 0, 0, 0.06)',
        },
        '.shadow-ambient-lg': {
          'box-shadow': '0 12px 24px rgba(0, 0, 0, 0.08)',
        },
        '.shadow-ambient-premium': {
          'box-shadow': '0 20px 48px rgba(0, 0, 0, 0.12)',
        },

        '.hover-lift': {
          '&:hover': {
            'transform': 'translateY(-4px)',
          },
        },
        '.active-press': {
          '&:active': {
            'transform': 'scale(0.98)',
          },
        },

        '.glass-header': {
          'background': 'rgba(255, 255, 255, 0.92)',
          'backdrop-filter': 'blur(12px)',
          'border-bottom': '1px solid rgba(30, 41, 59, 0.08)',
        },

        '.text-balance': {
          'text-wrap': 'balance',
        },
      });
    },
  ],
};

export default config;
