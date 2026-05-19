export default {
  theme: {
    extend: {
      colors: {
        background: '#11121f',
        surface: {
          DEFAULT: '#11121f',
          dim: '#11121f',
          bright: '#373846',
          variant: '#333441',
          container: {
            DEFAULT: '#1e1f2b',
            low: '#191b27',
            lowest: '#0c0d19',
            high: '#282936',
            highest: '#333441',
          },
        },
        primary: {
          DEFAULT: '#b5fff0',
          fixed: '#6ef9e2',
          'fixed-dim': '#4ddcc6',
          container: '#5eead4',
        },
        secondary: {
          DEFAULT: '#cebdff',
          fixed: '#e8ddff',
          'fixed-dim': '#cebdff',
          container: '#4f319c',
        },
        tertiary: {
          DEFAULT: '#ffecf2',
          fixed: '#ffd8e7',
          'fixed-dim': '#ffafd3',
          container: '#ffc4dd',
        },
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },
        outline: {
          DEFAULT: '#859490',
          variant: '#3c4946',
        },
        'on-background': '#e2e1f3',
        'on-surface': {
          DEFAULT: '#e2e1f3',
          variant: '#bbcac5',
        },
        'on-primary': '#003730',
        'on-secondary': '#381385',
        'on-tertiary': '#620040',
        'on-error': '#690005',
        'inverse-surface': '#e2e1f3',
        'inverse-on-surface': '#2e2f3d',
        'inverse-primary': '#006b5e',
        'surface-tint': '#4ddcc6',
        'primary-container': '#5eead4',
        'secondary-container': '#4f319c',
        'tertiary-container': '#ffc4dd',
        'error-container': '#93000a',
        'on-primary-container': '#00675b',
        'on-secondary-container': '#bea8ff',
        'on-tertiary-container': '#a02d70',
        'on-error-container': '#ffdad6',
      },
      fontFamily: {
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% center' },
          to: { backgroundPosition: '-200% center' },
        },
      },
    },
  },
};
