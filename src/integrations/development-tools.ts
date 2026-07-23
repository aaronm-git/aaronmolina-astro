import type { AstroIntegration } from 'astro';

/**
 * Registers local utility pages only while the Astro development server runs.
 * The routes are never injected into production or preview builds.
 */
export function developmentTools(): AstroIntegration {
  return {
    name: 'development-tools',
    hooks: {
      'astro:config:setup': ({ command, injectRoute }) => {
        if (command !== 'dev') {
          return;
        }

        injectRoute({
          pattern: '/dev/email-signatures',
          entrypoint: new URL('../dev-pages/email-signatures.astro', import.meta.url),
          prerender: true,
        });
      },
    },
  };
}
