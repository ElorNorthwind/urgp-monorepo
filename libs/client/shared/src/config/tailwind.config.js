const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('node:path');
const TailwindAnimate = require('tailwindcss-animate');

module.exports = function buildConfig(appDir) {
  return {
    content: [
      join(
        appDir,
        '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
      ),
      ...createGlobPatternsForDependencies(appDir),
    ],
    theme: {
      extend: {
        colors: {
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))',
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))',
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))',
          },
          popover: {
            DEFAULT: 'hsl(var(--popover))',
            foreground: 'hsl(var(--popover-foreground))',
          },
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))',
          },

          sidebar: {
            DEFAULT: 'hsl(var(--sidebar-background))',
            foreground: 'hsl(var(--sidebar-foreground))',
            primary: 'hsl(var(--sidebar-primary))',
            'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
            accent: 'hsl(var(--sidebar-accent))',
            'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
            border: 'hsl(var(--sidebar-border))',
            ring: 'hsl(var(--sidebar-ring))',
          },
        },
        borderRadius: {
          lg: `var(--radius)`,
          md: `calc(var(--radius) - 2px)`,
          sm: 'calc(var(--radius) - 4px)',
        },
        keyframes: {
          'accordion-down': {
            from: { height: '0' },
            to: { height: 'var(--radix-accordion-content-height)' },
          },
          'accordion-up': {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: '0' },
          },
          background: {
            '0%, 100%': { backgroundPosition: 'left 0% bottom 0%' },
            '50%': { backgroundPosition: 'left 200% bottom 0%' },
          },
          backgroundLinear: {
            '0%': { backgroundPosition: '0px 50%' },
            '100%': { backgroundPosition: '100px 50%' },
          },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          background: 'background 2s linear infinite',
          linear: 'backgroundLinear 3s linear infinite',
        },
        height: {
          screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
        },
        minHeight: {
          screen: ['100vh /* fallback for Opera, IE and etc. */', '100dvh'],
        },
        width: {
          sidebar: 'var(--sidebar-width)',
          messagebar: 'var(--messagebar-width)',
          detailsbar: 'var(--detailsbar-width)',
        },

        backgroundImage: {
          striped:
            'repeating-linear-gradient(135deg, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 5px, rgba(255,255,255,0) 5px, rgba(255,255,255,0) 10px);',
        },
      },
    },
    plugins: [TailwindAnimate],
  };
};
