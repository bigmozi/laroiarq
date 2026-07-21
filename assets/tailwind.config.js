/* LARÔ.IA — configuração do Tailwind, compartilhada por index.html, diagnostico.html
   e demonstrativo_obra.html. Todos os valores apontam pros tokens semânticos
   definidos em assets/tokens.css — nada de hex aqui. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        surface: { base: 'var(--color-surface-base)', raised: 'var(--color-surface-raised)', overlay: 'var(--color-surface-overlay)' },
        border:  { subtle: 'var(--color-border-subtle)', default: 'var(--color-border-default)' },
        text:    { primary: 'var(--color-text-primary)', secondary: 'var(--color-text-secondary)', tertiary: 'var(--color-text-tertiary)' },
        brand:   { accent: 'var(--color-brand-accent)', 'accent-h': 'var(--color-brand-accent-hover)', sand: 'var(--color-brand-sand)', green: 'var(--color-brand-green)', yellow: 'var(--color-brand-yellow)' },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
      },
      borderRadius: { card: 'var(--radius-card)', 'card-sm': 'var(--radius-card-sm)', pill: 'var(--radius-pill)' },
    },
  },
};
