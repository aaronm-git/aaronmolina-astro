// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.aaronmolina.me',

  vite: {
    // @ts-expect-error Vite plugin type mismatch caused by dependency version skew; runtime behavior is correct.
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['aarons-macbook-pro.local'],
    },
  },

  image: {
    domains: ['placehold.co'],
  },

  integrations: [react()],
});
