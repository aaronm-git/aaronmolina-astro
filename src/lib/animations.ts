/**
 * GSAP Animation Utilities for Tactile Maximalism
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

  revealElements.forEach((el) => {
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
      }
    );
  });
}

/**
 * Initialize floating tech showcase animation
 * Staggered entrance followed by continuous organic floating motion
 */
export function initTechShowcase(): void {
  const container = document.querySelector('[data-tech-showcase]');
  if (!container) return;

  const icons = container.querySelectorAll('[data-tech-float]');
  if (icons.length === 0) return;

  // Entrance: staggered scale-up and fade-in from random order
  gsap.fromTo(
    Array.from(icons),
    { opacity: 0, scale: 0.3, y: 30 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: 'back.out(1.4)',
      stagger: {
        amount: 0.8,
        from: 'random',
      },
    }
  );

  // Continuous floating: independent tweens per icon for organic motion
  icons.forEach((icon) => {
    const speed = parseFloat(
      (icon as HTMLElement).dataset.floatSpeed ?? '1'
    );
    const baseDuration = 3 + Math.random() * 2;

    // Vertical float
    gsap.to(icon, {
      y: `+=${8 + Math.random() * 12}`,
      duration: baseDuration * speed,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Horizontal drift
    gsap.to(icon, {
      x: `+=${4 + Math.random() * 8}`,
      duration: (baseDuration + 1) * speed,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 2,
    });

    // Subtle rotation oscillation
    gsap.to(icon, {
      rotation: `+=${2 + Math.random() * 4}`,
      duration: (baseDuration + 2) * speed,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: Math.random(),
    });
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
