/**
 * Icon registry.
 *
 * Generic UI icons resolve to Font Awesome 7 class strings, loaded from the
 * CDN in the main layout. Brand marks deliberately do NOT use an icon font:
 * they resolve to official SVG files under `public/brands`, because vendors
 * publish their own artwork and an icon font would misrepresent it.
 */

/** Font Awesome class string, e.g. `fa-solid fa-house`. */
export type IconClass = string;

/** Absolute path to an official brand SVG served from `public/brands`. */
export type BrandSrc = string;

const navIcons: Record<string, IconClass> = {
  home: 'fa-solid fa-house',
  briefcase: 'fa-solid fa-handshake',
  projects: 'fa-solid fa-briefcase',
  experience: 'fa-solid fa-user',
  blog: 'fa-solid fa-book-open',
  contact: 'fa-solid fa-envelope',
};

const categoryIcons: Record<string, IconClass> = {
  briefcase: 'fa-solid fa-briefcase',
  bolt: 'fa-solid fa-bolt',
  users: 'fa-solid fa-users',
  shield: 'fa-solid fa-shield-halved',
  clock: 'fa-solid fa-clock',
  calendar: 'fa-solid fa-calendar',
  globe: 'fa-solid fa-globe',
  code: 'fa-solid fa-code',
  star: 'fa-solid fa-star',
  heart: 'fa-solid fa-heart',
  rocket: 'fa-solid fa-rocket',
  lightbulb: 'fa-solid fa-lightbulb',
  graduation: 'fa-solid fa-graduation-cap',
  certificate: 'fa-solid fa-certificate',
  quote: 'fa-solid fa-quote-left',
  check: 'fa-solid fa-check',
  award: 'fa-solid fa-award',
  user: 'fa-solid fa-user',
  image: 'fa-solid fa-image',
  info: 'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation',
  success: 'fa-solid fa-circle-check',
  error: 'fa-solid fa-circle-xmark',
  tools: 'fa-solid fa-screwdriver-wrench',
  sparkle: 'fa-solid fa-star',
};

const uiIcons: Record<string, IconClass> = {
  arrowRight: 'fa-solid fa-arrow-right',
  arrowLeft: 'fa-solid fa-arrow-left',
  chevronRight: 'fa-solid fa-chevron-right',
  chevronDown: 'fa-solid fa-chevron-down',
  externalLink: 'fa-solid fa-up-right-from-square',
  close: 'fa-solid fa-xmark',
  menu: 'fa-solid fa-bars',
  play: 'fa-solid fa-play',
  sun: 'fa-solid fa-sun',
  moon: 'fa-solid fa-moon',
  desktop: 'fa-solid fa-desktop',
};

/**
 * Official brand artwork, sourced from each vendor and committed to
 * `public/brands`. Add a file there and register it here; never substitute an
 * icon font for a brand mark.
 */
const brandIcons: Record<string, BrandSrc> = {
  github: '/brands/github.svg',
  react: '/brands/react.svg',
  nextjs: '/brands/nextjs.svg',
};

export function getNavIcon(iconKey: string): IconClass | null {
  return navIcons[iconKey] ?? null;
}

export function getCategoryIcon(category: string): IconClass | null {
  return categoryIcons[category] ?? null;
}

export function getUIIcon(name: string): IconClass | null {
  return uiIcons[name] ?? null;
}

/** Resolves a brand key to its official SVG path, or null when not yet sourced. */
export function getBrandIcon(name: string): BrandSrc | null {
  return brandIcons[name] ?? null;
}

/** Resolves a name against the UI, category and nav registries, in that order. */
export function getIcon(name: string): IconClass | null {
  return uiIcons[name] ?? categoryIcons[name] ?? navIcons[name] ?? null;
}

export const ICON_ARROW_RIGHT = uiIcons.arrowRight;
export const ICON_ARROW_LEFT = uiIcons.arrowLeft;
export const ICON_EXTERNAL_LINK = uiIcons.externalLink;
export const ICON_IMAGE = categoryIcons.image;
export const ICON_BRIEFCASE = categoryIcons.briefcase;
export const ICON_CHECK = categoryIcons.check;
export const ICON_TOOLS = categoryIcons.tools;
