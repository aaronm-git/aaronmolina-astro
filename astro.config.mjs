// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://aaronmolina.github.io',
  base: '/aaronmolina-astro',
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['aarons-macbook-pro.local'],
    },
  },
  image: {
    domains: ['placehold.co'],
  },
});
