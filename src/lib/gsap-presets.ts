/**
 * GSAP Animation Presets
 *
 * Centralized animation configurations following the Tactile Maximalism design system.
 * Features bouncy, elastic, and punchy animations with depth and weight.
 */

import { gsap } from 'gsap';

// =============================================================================
// EASING PRESETS
// =============================================================================

export const easing = {
  // Bouncy, elastic feel - signature Tactile Maximalism
  elastic: 'elastic.out(1, 0.5)',
  elasticStrong: 'elastic.out(1.2, 0.4)',
  elasticSubtle: 'elastic.out(0.8, 0.6)',

  // Punchy entrances with overshoot
  back: 'back.out(1.7)',
  backStrong: 'back.out(2.5)',
  backSubtle: 'back.out(1.2)',

  // Smooth power curves
  powerIn: 'power2.in',
  powerOut: 'power2.out',
  powerInOut: 'power2.inOut',

  // Snappy interactions
  snap: 'power4.out',
  snapIn: 'power4.in',

  // Linear for parallax
  linear: 'none',
} as const;

// =============================================================================
// DURATION PRESETS
// =============================================================================

export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  slower: 0.8,
  slowest: 1.0,

  // Interaction-specific
  hover: 0.15,
  press: 0.1,
  bounce: 0.5,
  elastic: 0.7,
} as const;

// =============================================================================
// STAGGER PRESETS
// =============================================================================

export const stagger = {
  tight: 0.04,
  normal: 0.08,
  relaxed: 0.12,
  slow: 0.16,

  // Grid stagger (center out)
  grid: {
    amount: 0.1,
    from: 'center',
    grid: 'auto',
  },

  // Random stagger
  random: {
    amount: 0.15,
    from: 'random',
  },
} as const;

// =============================================================================
// ANIMATION PRESETS
// =============================================================================

export const presets = {
  // Fade in from bottom with bounce
  fadeInUp: {
    from: { y: 40, opacity: 0 },
    to: { y: 0, opacity: 1, duration: duration.slow, ease: easing.back },
  },

  // Fade in from left
  fadeInLeft: {
    from: { x: -40, opacity: 0 },
    to: { x: 0, opacity: 1, duration: duration.slow, ease: easing.back },
  },

  // Fade in from right
  fadeInRight: {
    from: { x: 40, opacity: 0 },
    to: { x: 0, opacity: 1, duration: duration.slow, ease: easing.back },
  },

  // Scale in with elastic bounce
  scaleIn: {
    from: { scale: 0.5, opacity: 0 },
    to: { scale: 1, opacity: 1, duration: duration.elastic, ease: easing.elastic },
  },

  // Pop in (smaller scale, faster)
  popIn: {
    from: { scale: 0.8, opacity: 0 },
    to: { scale: 1, opacity: 1, duration: duration.normal, ease: easing.backStrong },
  },

  // Hero text reveal
  heroReveal: {
    from: { y: 60, opacity: 0, skewX: -3 },
    to: { y: 0, opacity: 1, skewX: 0, duration: duration.slow, ease: easing.backStrong },
  },

  // Card entrance
  cardEntrance: {
    from: { y: 30, scale: 0.95, opacity: 0 },
    to: { y: 0, scale: 1, opacity: 1, duration: duration.normal, ease: easing.back },
  },

  // Subtle fade
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: duration.normal, ease: easing.powerOut },
  },
} as const;

// =============================================================================
// HOVER EFFECT PRESETS
// =============================================================================

export const hoverEffects = {
  // Lift effect for cards
  lift: {
    y: -8,
    scale: 1.02,
    duration: duration.hover,
    ease: easing.powerOut,
  },

  // Subtle lift
  liftSubtle: {
    y: -4,
    scale: 1.01,
    duration: duration.hover,
    ease: easing.powerOut,
  },

  // Press down effect
  press: {
    scale: 0.98,
    duration: duration.press,
    ease: easing.powerIn,
  },

  // Bounce on hover
  bounce: {
    scale: 1.05,
    duration: duration.bounce,
    ease: easing.elastic,
  },

  // Glow pulse
  glow: {
    boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
    duration: duration.normal,
    ease: easing.powerOut,
  },
} as const;

// =============================================================================
// SCROLL TRIGGER PRESETS
// =============================================================================

export const scrollTriggerDefaults = {
  // Standard section reveal
  section: {
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none none',
    once: true,
  },

  // Card reveal (slightly earlier)
  card: {
    start: 'top 85%',
    end: 'bottom 15%',
    toggleActions: 'play none none none',
    once: true,
  },

  // Parallax scrolling
  parallax: {
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },

  // Pin element
  pin: {
    start: 'top top',
    end: '+=100%',
    pin: true,
    scrub: 1,
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Apply hover animation to elements
 */
export function applyHoverEffect(
  element: Element,
  effect: keyof typeof hoverEffects = 'lift'
) {
  const config = hoverEffects[effect];

  element.addEventListener('mouseenter', () => {
    gsap.to(element, config);
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      y: 0,
      scale: 1,
      boxShadow: 'none',
      duration: duration.hover,
      ease: easing.powerOut,
    });
  });
}

/**
 * Create staggered animation for grid children
 */
export function staggerGridChildren(
  container: Element,
  childSelector: string,
  options: {
    preset?: keyof typeof presets;
    staggerAmount?: number;
    fromCenter?: boolean;
  } = {}
) {
  const {
    preset = 'cardEntrance',
    staggerAmount = stagger.normal,
    fromCenter = false,
  } = options;

  const children = container.querySelectorAll(childSelector);
  if (children.length === 0) return null;

  const config = presets[preset];

  return gsap.fromTo(
    children,
    config.from,
    {
      ...config.to,
      stagger: fromCenter
        ? { amount: staggerAmount, from: 'center' }
        : staggerAmount,
    }
  );
}

/**
 * Create timeline with preset animations
 */
export function createRevealTimeline(
  elements: { selector: string; preset: keyof typeof presets; offset?: string }[]
) {
  const tl = gsap.timeline();

  elements.forEach(({ selector, preset, offset = '-=0.3' }) => {
    const el = document.querySelector(selector);
    if (!el) return;

    const config = presets[preset];
    tl.fromTo(el, config.from, config.to, offset);
  });

  return tl;
}
