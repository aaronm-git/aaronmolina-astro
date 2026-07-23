// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { chatContext } from './src/integrations/chat-context';
import { developmentTools } from './src/integrations/development-tools';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.aaronmolina.me',

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['aarons-macbook-pro.local'],
    },
  },

  image: {
    domains: ['placehold.co'],
  },

  integrations: [mdx(), react(), developmentTools(), chatContext()],
});
