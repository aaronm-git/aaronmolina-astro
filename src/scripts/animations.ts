import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import {
  easing,
  duration,
  stagger,
  presets,
  hoverEffects,
  scrollTriggerDefaults,
} from '@/lib/gsap-presets';

// Register the plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Animation utilities
export class AnimationUtils {
  static initialized = false;

  static init() {
    if (this.initialized) return;
    this.initialized = true;

    // Initialize ScrollTrigger
    ScrollTrigger.refresh();

    // Set up global animation settings - Tactile Maximalism: bouncy, elastic
    gsap.defaults({
      duration: duration.normal,
      ease: easing.elastic,
    });
  }

  // Bounce in animation from bottom
  static fadeInUp(elements: string | Element | Element[], options: any = {}) {
    const defaultOptions = {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out(1.7)',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return gsap.fromTo(
      elements,
      {
        y: mergedOptions.y,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: mergedOptions.duration,
        stagger: mergedOptions.stagger,
        ease: mergedOptions.ease,
        ...options,
      },
    );
  }

  // Bounce in animation from left
  static fadeInLeft(elements: string | Element | Element[], options: any = {}) {
    const defaultOptions = {
      x: -40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out(1.7)',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return gsap.fromTo(
      elements,
      {
        x: mergedOptions.x,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: mergedOptions.duration,
        stagger: mergedOptions.stagger,
        ease: mergedOptions.ease,
        ...options,
      },
    );
  }

  // Bounce in animation from right
  static fadeInRight(elements: string | Element | Element[], options: any = {}) {
    const defaultOptions = {
      x: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out(1.7)',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return gsap.fromTo(
      elements,
      {
        x: mergedOptions.x,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: mergedOptions.duration,
        stagger: mergedOptions.stagger,
        ease: mergedOptions.ease,
        ...options,
      },
    );
  }

  // Pop in animation with elastic bounce
  static scaleIn(elements: string | Element | Element[], options: any = {}) {
    const defaultOptions = {
      scale: 0.5,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'elastic.out(1, 0.5)',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return gsap.fromTo(
      elements,
      {
        scale: mergedOptions.scale,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: mergedOptions.duration,
        stagger: mergedOptions.stagger,
        ease: mergedOptions.ease,
        ...options,
      },
    );
  }

  // Text reveal animation with punch
  static textReveal(elements: string | Element | Element[], options: any = {}) {
    const defaultOptions = {
      y: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.04,
      ease: 'back.out(2)',
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return gsap.fromTo(
      elements,
      {
        y: mergedOptions.y,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: mergedOptions.duration,
        stagger: mergedOptions.stagger,
        ease: mergedOptions.ease,
        ...options,
      },
    );
  }

  // Parallax effect
  static parallax(elements: string | Element | Element[], speed: number = 0.5) {
    gsap.to(elements, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: elements,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Scroll-triggered animations
  static scrollTriggerAnimation(elements: string | Element | Element[], animation: any, options: any = {}) {
    const defaultOptions = {
      trigger: elements,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none none',
      once: true,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    return ScrollTrigger.create({
      ...mergedOptions,
      onEnter: () => animation,
    });
  }

  // Hero section animations
  static initHeroAnimations() {
    // Check if hero elements exist before animating
    const heroImage = document.querySelector('.hero-image');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const heroCtas = document.querySelectorAll('.hero-cta');

    // Only create timeline if hero elements exist
    if (!heroImage && !heroTitle && !heroSubtitle && !heroDescription && heroCtas.length === 0) {
      return;
    }

    const tl = gsap.timeline();

    // Animate profile image with elastic pop
    if (heroImage) {
      tl.fromTo(
        heroImage,
        {
          scale: 0.5,
          opacity: 0,
          rotate: -5,
        },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
        },
      );
    }

    // Animate hero text with punchy entrance
    if (heroTitle) {
      tl.fromTo(
        heroTitle,
        {
          y: 40,
          opacity: 0,
          skewX: -3,
        },
        {
          y: 0,
          opacity: 1,
          skewX: 0,
          duration: 0.6,
          ease: 'back.out(2)',
        },
        '-=0.4',
      );
    }

    if (heroSubtitle) {
      tl.fromTo(
        heroSubtitle,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        },
        '-=0.4',
      );
    }

    if (heroDescription) {
      tl.fromTo(
        heroDescription,
        {
          y: 25,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        },
        '-=0.3',
      );
    }

    // Animate CTA buttons with bounce
    if (heroCtas.length > 0) {
      tl.fromTo(
        heroCtas,
        {
          y: 20,
          scale: 0.9,
          opacity: 0,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(2)',
        },
        '-=0.3',
      );
    }

    return tl;
  }

  // Card animations with bouncy entrance
  static initCardAnimations() {
    const cards = document.querySelectorAll('.animate-card');

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        presets.cardEntrance.from,
        {
          ...presets.cardEntrance.to,
          scrollTrigger: {
            trigger: card,
            ...scrollTriggerDefaults.card,
          },
        },
      );
    });
  }

  // Staggered grid animations for card grids
  static initGridAnimations() {
    const grids = document.querySelectorAll('.animate-grid');

    grids.forEach((grid) => {
      const children = grid.querySelectorAll('.animate-grid-item');
      if (children.length === 0) return;

      gsap.fromTo(
        children,
        presets.cardEntrance.from,
        {
          ...presets.cardEntrance.to,
          stagger: {
            amount: 0.4,
            from: 'start',
            grid: 'auto',
          },
          scrollTrigger: {
            trigger: grid,
            ...scrollTriggerDefaults.section,
          },
        },
      );
    });
  }

  // Card hover lift effects
  static initCardHoverEffects() {
    const hoverCards = document.querySelectorAll('.hover-lift');

    hoverCards.forEach((card) => {
      // Set initial state for GPU acceleration
      gsap.set(card, { willChange: 'transform' });

      card.addEventListener('mouseenter', () => {
        gsap.to(card, hoverEffects.lift);
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: duration.hover,
          ease: easing.powerOut,
        });
      });
    });

    // Subtle hover for smaller elements
    const subtleHoverCards = document.querySelectorAll('.hover-lift-subtle');

    subtleHoverCards.forEach((card) => {
      gsap.set(card, { willChange: 'transform' });

      card.addEventListener('mouseenter', () => {
        gsap.to(card, hoverEffects.liftSubtle);
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: duration.hover,
          ease: easing.powerOut,
        });
      });
    });
  }

  // Button micro-interactions
  static initButtonAnimations() {
    const tactileButtons = document.querySelectorAll('.btn-tactile, [data-animate="button"]');

    tactileButtons.forEach((btn) => {
      // Press effect
      btn.addEventListener('mousedown', () => {
        gsap.to(btn, {
          scale: 0.95,
          duration: duration.press,
          ease: easing.powerIn,
        });
      });

      btn.addEventListener('mouseup', () => {
        gsap.to(btn, {
          scale: 1,
          duration: duration.bounce,
          ease: easing.elastic,
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          duration: duration.hover,
          ease: easing.powerOut,
        });
      });
    });
  }

  // Section reveal animations with punch
  static initSectionAnimations() {
    const sections = document.querySelectorAll('.animate-section');

    sections.forEach(section => {
      const heading = section.querySelector('h2');
      const content = section.querySelectorAll('.animate-content');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      if (heading) {
        tl.fromTo(
          heading,
          {
            y: 25,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(2)',
          },
        );
      }

      if (content.length > 0) {
        tl.fromTo(
          content,
          {
            y: 25,
            scale: 0.98,
            opacity: 0,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'back.out(1.7)',
          },
          '-=0.3',
        );
      }
    });
  }

  // Smooth scrolling
  static initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (!href) return;
        const target = document.querySelector(href);

        if (target) {
          gsap.to(window, {
            duration: 0,
            ease: 'power2.out',
            scrollTo: {
              y: target,
              offsetY: 180,
            },
          });
        } else {
          console.log('No target found');
        }
      });
    });
  }

  // smooth scroll on page load
  static initSmoothScrollOnPageLoad() {
    if (!window.location.hash) {
      return;
    }

    // Wait a bit for the page to fully load and render
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        gsap.to(window, {
          duration: 0,
          ease: 'power2.out',
          scrollTo: { y: target, offsetY: 180 },
        });
      }
    }, 100);
  }

  static initHashScrolling() {
    window.addEventListener('hashchange', () => {
      if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
          gsap.to(window, {
            duration: 0,
            ease: 'power2.out',
            scrollTo: { y: target, offsetY: 180 },
          });
        }
      }
    });
  }

  // Initialize all animations
  static initializeAll() {
    this.init();
    this.initHeroAnimations();
    this.initCardAnimations();
    this.initGridAnimations();
    this.initSectionAnimations();
    this.initCardHoverEffects();
    this.initButtonAnimations();
    this.initSmoothScrolling();
    this.initSmoothScrollOnPageLoad();
    this.initHashScrolling();
  }

  // Refresh ScrollTrigger (useful for dynamic content)
  static refresh() {
    ScrollTrigger.refresh();
  }

  // Clean up animations
  static cleanup() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf('*');
  }
}
