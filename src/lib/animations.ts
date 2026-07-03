/**
 * GSAP Animation Utilities for the Industrial Grotesk design system
 * Scroll-triggered reveals and entrance animations
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize scroll-triggered reveal animations for elements with `.gsap-reveal`
 * Elements fade up into view as they enter the viewport
 */
export function initScrollReveal(): void {
  const revealElements = document.querySelectorAll('.gsap-reveal');

  if (revealElements.length === 0) return;

  revealElements.forEach(el => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      },
    );
  });
}

/**
 * Initialize scroll-triggered reveal for every top-level `<section>` on the
 * page. Sections that already run their own entrance timeline (currently
 * only the split-variant `HeroSection`, marked via `[data-hero-animate]`
 * children) are skipped so the two animations don't stack.
 */
export function initSectionReveal(): void {
  const sections = document.querySelectorAll('main > section:not(:has([data-hero-animate]))');

  if (sections.length === 0) return;

  sections.forEach(el => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      },
    );
  });
}

/**
 * Initialize hero entrance animation with staggered timeline
 * Targets elements with `data-hero-animate` attribute, ordered by `data-hero-order`
 */
export function initHeroEntrance(): void {
  const heroElements = document.querySelectorAll('[data-hero-animate]');

  if (heroElements.length === 0) return;

  const sorted = Array.from(heroElements).sort((a, b) => {
    const orderA = Number(a.getAttribute('data-hero-order') || 0);
    const orderB = Number(b.getAttribute('data-hero-order') || 0);
    return orderA - orderB;
  });

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  sorted.forEach((el, i) => {
    const delay = i === 0 ? 0.2 : '-=0.35';
    tl.from(el, { opacity: 0, y: 20, duration: 0.5 }, delay);
  });
}
