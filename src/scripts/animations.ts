import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animation utilities
export class AnimationUtils {
  static initialized = false;

  static init() {
    if (this.initialized) return;
    this.initialized = true;

    // Initialize ScrollTrigger
    ScrollTrigger.refresh();
    
    // Set up global animation settings
    gsap.defaults({
      duration: 1,
      ease: 'power2.out',
    });
  }

  // Fade in animation from bottom
  static fadeInUp(elements: string | Element | Element[], options: any = {}) {
    const defaultOptions = {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
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
      }
    );
  }

  // Fade in animation from left
  static fadeInLeft(elements: string | Element | Element[], options: any = {}) {
    const defaultOptions = {
      x: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
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
      }
    );
  }

  // Fade in animation from right
  static fadeInRight(elements: string | Element | Element[], options: any = {}) {
    const defaultOptions = {
      x: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out',
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
      }
    );
  }

  // Scale in animation
  static scaleIn(elements: string | Element | Element[], options: any = {}) {
    const defaultOptions = {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'back.out(1.7)',
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
      }
    );
  }

  // Text reveal animation
  static textReveal(elements: string | Element | Element[], options: any = {}) {
    const defaultOptions = {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power2.out',
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
      }
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
  static scrollTriggerAnimation(
    elements: string | Element | Element[],
    animation: any,
    options: any = {}
  ) {
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
    const tl = gsap.timeline();

    // Animate profile image
    tl.fromTo(
      '.hero-image',
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'back.out(1.7)',
      }
    );

    // Animate hero text
    tl.fromTo(
      '.hero-title',
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.5'
    );

    tl.fromTo(
      '.hero-subtitle',
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.6'
    );

    tl.fromTo(
      '.hero-description',
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      },
      '-=0.6'
    );

    // Animate CTA buttons
    tl.fromTo(
      '.hero-cta',
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      },
      '-=0.4'
    );

    return tl;
  }

  // Card animations
  static initCardAnimations() {
    const cards = document.querySelectorAll('.animate-card');
    
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );
    });
  }

  // Section reveal animations
  static initSectionAnimations() {
    const sections = document.querySelectorAll('.animate-section');
    
    sections.forEach((section) => {
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
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
          }
        );
      }

      if (content.length > 0) {
        tl.fromTo(
          content,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
          },
          '-=0.6'
        );
      }
    });
  }

  // Smooth scrolling
  static initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href')!);
        
        if (target) {
          gsap.to(window, {
            duration: 1,
            scrollTo: { y: target, offsetY: 80 },
            ease: 'power2.inOut',
          });
        }
      });
    });
  }

  // Initialize all animations
  static initializeAll() {
    this.init();
    this.initHeroAnimations();
    this.initCardAnimations();
    this.initSectionAnimations();
    this.initSmoothScrolling();
  }

  // Refresh ScrollTrigger (useful for dynamic content)
  static refresh() {
    ScrollTrigger.refresh();
  }

  // Clean up animations
  static cleanup() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf('*');
  }
} 