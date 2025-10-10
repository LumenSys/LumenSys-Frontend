/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutralLighter: 'var(--color-neutral-lighter)',
        neutral: 'var(--color-neutral)',
        neutralDarker: 'var(--color-neutral-darker)',
        neutralDark: 'var(--color-neutral-dark)',

        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        footer: 'var(--color-footer)',
        background: 'var(--color-background)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
        surface: 'var(--color-surface)',
        surfaceUser: 'var(--color-surface-user)',
        hoverButton: 'var(--color-hoverButton)',
        hoverButton2: 'var(--color-hoverButton2)',
        whiteColor: 'var(--color-white)',

        danger: 'var(--color-danger)',
        hoverDanger: 'var(--color-hoverDanger)',
        edit: 'var(--color-edit)',
        hoverEdit: 'var(--color-hoverEdit)',
        success: 'var(--color-success)',
        hoverSuccess: 'var(--color-hoverSuccess)',
        warning: 'var(--color-warning)',
      }
    },
  },
  plugins: [],
};

