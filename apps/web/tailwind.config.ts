import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    // Include workspace packages that use Tailwind
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
    '../../packages/features/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // Arabic fonts
        arabic: [
          'var(--font-arabic-primary)',  // Noto Sans Arabic
          'Tahoma',                       // Excellent fallback for Arabic
          'Arial Unicode MS',             // Unicode support
          'sans-serif'                    // System default
        ],
        'arabic-heading': [
          'var(--font-arabic-heading)',   // Cairo
          'var(--font-arabic-primary)',   // Fallback to primary
          'Tahoma',
          'sans-serif'
        ],
        'arabic-formal': [
          'var(--font-arabic-formal)',    // Amiri
          'var(--font-arabic-primary)',   // Fallback to primary
          'Tahoma',
          'serif'                         // Serif fallback for formal
        ],
        // English font (existing)
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
} satisfies Config;

export default config;
