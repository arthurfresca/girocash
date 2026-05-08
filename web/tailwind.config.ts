import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gc: {
          dark: '#0f172a',
          dark2: '#1e293b',
          dark3: '#334155',
          green: '#22c55e',
          'green-dark': '#16a34a',
          blue: '#3b82f6',
          'blue-dark': '#1d4ed8',
          text: '#f1f5f9',
          text2: '#94a3b8',
          text3: '#8b9eb5',
          border: '#334155',
          success: '#22c55e',
          danger: '#ef4444',
          warn: '#f59e0b',
          purple: '#8b5cf6',
          teal: '#14b8a6',
        },
      },
    },
  },
  plugins: [],
}

export default config
