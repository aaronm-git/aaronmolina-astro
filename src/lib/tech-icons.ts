/**
 * Tech icon metadata for downloaded brand SVG assets.
 */

export interface TechIcon {
  /** Stable technology slug used in content */
  slug: string;
  /** Human-readable label */
  title: string;
  /** Public path to the downloaded SVG asset */
  src: string;
  /** Brand color used for the card accent */
  color: string;
  /** Alternate color for dark backgrounds when needed */
  darkColor?: string;
}

const techIconMap: Record<string, TechIcon> = {
  react: {
    slug: 'react',
    title: 'React',
    src: '/images/tech-logos/react.svg',
    color: '#61DAFB',
  },
  nextjs: {
    slug: 'nextjs',
    title: 'Next.js',
    src: '/images/tech-logos/nextjs.svg',
    color: '#000000',
    darkColor: '#FFFFFF',
  },
  astro: {
    slug: 'astro',
    title: 'Astro',
    src: '/images/tech-logos/astro.svg',
    color: '#BC52EE',
  },
  typescript: {
    slug: 'typescript',
    title: 'TypeScript',
    src: '/images/tech-logos/typescript.svg',
    color: '#3178C6',
  },
  figma: {
    slug: 'figma',
    title: 'Figma',
    src: '/images/tech-logos/figma.svg',
    color: '#F24E1E',
  },
  tailwindcss: {
    slug: 'tailwindcss',
    title: 'Tailwind CSS',
    src: '/images/tech-logos/tailwindcss.svg',
    color: '#06B6D4',
  },
  sanity: {
    slug: 'sanity',
    title: 'Sanity',
    src: '/images/tech-logos/sanity.svg',
    color: '#F03E2F',
  },
  storyblok: {
    slug: 'storyblok',
    title: 'Storyblok',
    src: '/images/tech-logos/storyblok.svg',
    color: '#09B3AF',
  },
  strapi: {
    slug: 'strapi',
    title: 'Strapi',
    src: '/images/tech-logos/strapi.svg',
    color: '#4945FF',
  },
  supabase: {
    slug: 'supabase',
    title: 'Supabase',
    src: '/images/tech-logos/supabase.svg',
    color: '#3ECF8E',
  },
  openai: {
    slug: 'openai',
    title: 'OpenAI',
    src: '/images/tech-logos/openai.svg',
    color: '#000000',
    darkColor: '#FFFFFF',
  },
  'claude-code': {
    slug: 'claude-code',
    title: 'Claude Code',
    src: '/images/tech-logos/claude.svg',
    color: '#D97757',
  },
  cursor: {
    slug: 'cursor',
    title: 'Cursor IDE',
    src: '/images/tech-logos/cursor.svg',
    color: '#111111',
    darkColor: '#FFFFFF',
  },
  'mcp-servers': {
    slug: 'mcp-servers',
    title: 'MCP Servers',
    src: '/images/tech-logos/model-context-protocol.svg',
    color: '#0F172A',
  },
  vercel: {
    slug: 'vercel',
    title: 'Vercel',
    src: '/images/tech-logos/vercel.svg',
    color: '#000000',
    darkColor: '#FFFFFF',
  },
  nodejs: {
    slug: 'nodejs',
    title: 'Node.js',
    src: '/images/tech-logos/nodejs.svg',
    color: '#5FA04E',
  },
  graphql: {
    slug: 'graphql',
    title: 'GraphQL',
    src: '/images/tech-logos/graphql.svg',
    color: '#E10098',
  },
  neon: {
    slug: 'neon',
    title: 'Neon',
    src: '/images/tech-logos/neon.svg',
    color: '#37C38F',
  },
  postgresql: {
    slug: 'postgresql',
    title: 'PostgreSQL',
    src: '/images/tech-logos/postgresql.svg',
    color: '#4169E1',
  },
  docker: {
    slug: 'docker',
    title: 'Docker',
    src: '/images/tech-logos/docker.svg',
    color: '#2496ED',
  },
  aws: {
    slug: 'aws',
    title: 'AWS',
    src: '/images/tech-logos/aws.svg',
    color: '#232F3E',
  },
  shopify: {
    slug: 'shopify',
    title: 'Shopify',
    src: '/images/tech-logos/shopify.svg',
    color: '#7AB55C',
  },
  'github-actions': {
    slug: 'github-actions',
    title: 'GitHub Actions',
    src: '/images/tech-logos/github-actions.svg',
    color: '#2088FF',
  },
};

/**
 * Gets SVG asset metadata for a technology slug.
 */
export function getTechIcon(slug: string): TechIcon | null {
  return techIconMap[slug] ?? null;
}

/**
 * Gets SVG asset metadata for multiple technologies.
 */
export function getAllTechIcons(slugs: string[]): TechIcon[] {
  return slugs
    .map((slug) => techIconMap[slug])
    .filter((icon): icon is TechIcon => icon != null);
}
