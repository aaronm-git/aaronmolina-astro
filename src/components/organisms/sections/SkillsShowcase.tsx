import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

/**
 * Skill data structure for the interactive showcase
 */
interface SkillData {
  slug: string;
  name: string;
  level: number;
  projects: { slug: string; title: string }[];
  logoPath: string;
}

interface Props {
  /** Array of skill data */
  skills: SkillData[];
}

/** Logo path mapping for skills with SVG logos */
const LOGO_BASE = '/images/tech-logos/';

/** Concept skills that use text-based icons instead of SVG logos */
const CONCEPT_SKILLS = new Set([
  'rest-api',
  'seo',
  'accessibility',
  'ga4',
  'gtm',
  'frontend',
  'fullstack',
  'architecture',
  'core-web-vitals',
  'qa-testing',
  'wcag-testing',
  'structured-content',
  'nba',
  'plugins',
  'uncategorized',
  'content-layer',
  'oauth',
  'oauth2',
  'serverless',
]);

/** Short labels for concept skills */
const CONCEPT_LABELS: Record<string, string> = {
  'rest-api': 'API',
  seo: 'SEO',
  accessibility: 'A11Y',
  ga4: 'GA4',
  gtm: 'GTM',
  frontend: 'FE',
  fullstack: 'FS',
};

/**
 * Full color ramp from red (low) to emerald (max), used for the health bar.
 * Kept as literal hex values — this is a meaningful proficiency signal
 * (low = red, high = green), not part of the ink/concrete/signal system.
 * Each entry is a [position%, hex] stop along the gradient.
 */
const COLOR_RAMP = [
  [0, '#dc2626'], // red-600
  [15, '#ea580c'], // orange-600
  [30, '#f59e0b'], // amber-500
  [45, '#eab308'], // yellow-500
  [60, '#84cc16'], // lime-500
  [75, '#22c55e'], // green-500
  [90, '#10b981'], // emerald-500
  [100, '#059669'], // emerald-600
] as const;

/**
 * Builds a gradient that ends at the color matching the proficiency level.
 * A 5/10 skill ends around yellow; only 10/10 reaches full emerald.
 * The gradient is stretched so the final visible color sits at the fill edge.
 */
function getHealthBarGradientForLevel(level: number): string {
  const pct = (level / 10) * 100;

  const stops: string[] = [];
  for (const [pos, color] of COLOR_RAMP) {
    const remapped = (pos / 100) * pct;
    stops.push(`${color} ${remapped}%`);
    if (pos >= pct) break;
  }

  return `linear-gradient(90deg, ${stops.join(', ')})`;
}

/**
 * Spawns star particles that burst from the right edge of the health bar.
 * Stars fly outward in random directions and fade out.
 */
function spawnStarBurst(container: HTMLElement) {
  const count = 12;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('span');
    star.textContent = '✦';
    star.style.cssText = `
      position: absolute;
      right: 0;
      top: 50%;
      font-size: ${10 + Math.random() * 10}px;
      color: #facc15;
      pointer-events: none;
      z-index: 10;
      text-shadow: 0 0 6px rgba(250,204,21,0.8);
    `;
    container.appendChild(star);

    const angle = (Math.random() - 0.5) * Math.PI * 1.2;
    const distance = 30 + Math.random() * 60;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    gsap.fromTo(
      star,
      { opacity: 1, scale: 1, x: 0, y: 0 },
      {
        opacity: 0,
        scale: 0.2,
        x: dx,
        y: dy,
        duration: 0.6 + Math.random() * 0.4,
        ease: 'power2.out',
        onComplete: () => star.remove(),
      },
    );
  }
}

/**
 * Spawns continuously floating star particles around the popup edges.
 * Stars drift upward and fade, creating an ambient sparkle effect.
 */
function spawnFloatingStars(container: HTMLElement) {
  const symbols = ['✦', '✧', '⭑', '★'];
  let intervalId: number;

  const spawn = () => {
    if (!container.isConnected) {
      clearInterval(intervalId);
      return;
    }

    const star = document.createElement('span');
    star.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const side = Math.floor(Math.random() * 4);
    let x: string, y: string;
    switch (side) {
      case 0:
        x = `${Math.random() * 100}%`;
        y = '-8px';
        break;
      case 1:
        x = 'calc(100% + 8px)';
        y = `${Math.random() * 100}%`;
        break;
      case 2:
        x = `${Math.random() * 100}%`;
        y = 'calc(100% + 8px)';
        break;
      default:
        x = '-8px';
        y = `${Math.random() * 100}%`;
        break;
    }

    star.style.cssText = `
      position: absolute;
      left: ${x};
      top: ${y};
      font-size: ${8 + Math.random() * 10}px;
      color: #facc15;
      pointer-events: none;
      z-index: 10;
      text-shadow: 0 0 8px rgba(250,204,21,0.6), 0 0 16px rgba(250,204,21,0.35);
    `;
    container.appendChild(star);

    gsap.fromTo(
      star,
      { opacity: 0, scale: 0, y: 0 },
      {
        opacity: 1,
        scale: 1,
        y: -20 - Math.random() * 20,
        x: (Math.random() - 0.5) * 30,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(star, {
            opacity: 0,
            scale: 0.3,
            y: '-=15',
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => star.remove(),
          });
        },
      },
    );
  };

  for (let i = 0; i < 5; i++) {
    setTimeout(spawn, i * 100);
  }

  intervalId = window.setInterval(spawn, 400);
}

/**
 * SkillsShowcase - Interactive full-width skills display
 *
 * Features:
 * - Scattered icon grid layout
 * - Click-to-reveal popup with skill details
 * - Video game style health bar (red to green)
 * - GSAP signal/amber glow effect for 10/10 skills
 */
export default function SkillsShowcase({ skills }: Props) {
  const [activeSkill, setActiveSkill] = useState<SkillData | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const healthBarRef = useRef<HTMLDivElement>(null);
  const healthBarWrapRef = useRef<HTMLDivElement>(null);
  const glowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const starsContainerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const iconsRevealedRef = useRef(false);
  /** The skill-icon button that opened the dialog, so focus can return to it on close. */
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || iconsRevealedRef.current) return;
    iconsRevealedRef.current = true;

    const icons = containerRef.current.querySelectorAll('.skill-icon');
    gsap.fromTo(
      icons,
      { opacity: 0, scale: 0.3, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        stagger: { each: 0.03, from: 'random' },
        ease: 'back.out(1.7)',
      },
    );
  }, [skills]);

  useEffect(() => {
    const expertSlugs = skills.filter(s => s.level === 10).map(s => s.slug);

    expertSlugs.forEach(slug => {
      const glowEl = glowRefs.current.get(slug);
      const starsEl = starsContainerRefs.current.get(slug);

      if (glowEl) {
        gsap.to(glowEl, {
          boxShadow: '0 0 20px 4px oklch(87% 0.23 135 / 0.6), 0 0 40px 8px oklch(80% 0.16 75 / 0.3)',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      if (starsEl) {
        const stars = starsEl.querySelectorAll('.star-particle');
        stars.forEach((star, i) => {
          gsap.fromTo(
            star,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              repeat: -1,
              yoyo: true,
              delay: i * 0.3,
              ease: 'power2.inOut',
            },
          );
          gsap.to(star, {
            rotation: 360,
            duration: 3 + i,
            repeat: -1,
            ease: 'none',
          });
        });
      }
    });
  }, [skills]);

  useEffect(() => {
    if (!activeSkill || !popupRef.current || !overlayRef.current) return;

    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });

    gsap.fromTo(popupRef.current, { opacity: 0, scale: 0.8, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' });

    if (healthBarRef.current) {
      gsap.fromTo(
        healthBarRef.current,
        { width: '0%' },
        {
          width: `${activeSkill.level * 10}%`,
          duration: 0.8,
          delay: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            if (activeSkill.level === 10 && healthBarWrapRef.current) {
              spawnStarBurst(healthBarWrapRef.current);
            }
          },
        },
      );
    }

    if (activeSkill.level === 10 && popupRef.current) {
      const popup = popupRef.current;
      const glowLayer = popup.querySelector('.popup-glow-layer') as HTMLElement;

      gsap.to(popup, {
        boxShadow: '0 0 25px 5px oklch(87% 0.23 135 / 0.55), 0 0 50px 10px oklch(80% 0.16 75 / 0.3), 0 8px 0 0 var(--color-ink)',
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      if (glowLayer) {
        gsap.to(glowLayer, {
          opacity: 0.3,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      spawnFloatingStars(popup);
    }

    // Move focus into the dialog on open. The popup is a static info panel
    // (name, health bar, project tags) with no default action beyond
    // dismissal, so focus lands on the panel itself rather than jumping
    // straight to the Close button — a screen reader user starting point
    // that reads the content first, same as a sighted user would.
    popupRef.current.focus();
  }, [activeSkill]);

  const closePopup = useCallback(() => {
    if (!popupRef.current || !overlayRef.current || isClosing) return;
    setIsClosing(true);

    gsap.to(popupRef.current, {
      opacity: 0,
      scale: 0.8,
      y: 20,
      duration: 0.2,
      ease: 'power2.in',
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        setActiveSkill(null);
        setIsClosing(false);

        // Restore focus to the skill-icon button that opened the dialog.
        if (lastFocusedElementRef.current?.isConnected) {
          lastFocusedElementRef.current.focus();
        }
        lastFocusedElementRef.current = null;
      },
    });
  }, [isClosing]);

  useEffect(() => {
    if (!activeSkill) return;

    /**
     * Escape closes the dialog; Tab/Shift+Tab is trapped within the dialog's
     * own focusable elements so keyboard focus can't leak to the page behind it.
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePopup();
        return;
      }

      if (e.key !== 'Tab' || !popupRef.current) return;

      const focusable = popupRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const atBoundary = !current || current === popupRef.current || !popupRef.current.contains(current);

      if (e.shiftKey) {
        if (current === first || atBoundary) {
          e.preventDefault();
          last.focus();
        }
      } else if (current === last || atBoundary) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeSkill, closePopup]);

  return (
    <section className="section-py" id="skills">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="font-display text-ink mb-3 text-3xl font-black tracking-tight uppercase md:text-4xl lg:text-5xl">Skills I Know</h2>
          <p className="text-graphite mx-auto max-w-2xl text-base md:text-lg">
            Over a decade of hands-on experience across the modern web stack. Click any skill to see my proficiency and the projects where I put it to work.
          </p>
        </div>

        <div ref={containerRef} className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
          {skills.map(skill => {
            const isExpert = skill.level === 10;
            const isConcept = CONCEPT_SKILLS.has(skill.slug);

            return (
              <button
                key={skill.slug}
                onClick={e => {
                  // Remember the trigger so focus can return here when the dialog closes.
                  lastFocusedElementRef.current = e.currentTarget;
                  setActiveSkill(skill);
                }}
                className="skill-icon group border-ink bg-paper focus-visible:outline-signal relative flex h-16 w-16 items-center justify-center rounded-md border-2 transition-transform duration-200 hover:scale-110 focus-visible:outline-3 focus-visible:outline-offset-2 active:scale-95 md:h-20 md:w-20"
                style={{
                  boxShadow: isExpert ? undefined : '0 4px 0 0 var(--color-ink)',
                  cursor: 'pointer',
                }}
                title={skill.name}
                aria-label={`View ${skill.name} skill details`}
              >
                {isExpert && (
                  <div
                    ref={el => {
                      if (el) glowRefs.current.set(skill.slug, el);
                    }}
                    className="pointer-events-none absolute inset-0 rounded-md"
                    style={{ boxShadow: '0 0 12px 2px oklch(87% 0.23 135 / 0.5), 0 4px 0 0 var(--color-ink)' }}
                  />
                )}

                {isExpert && (
                  <div
                    ref={el => {
                      if (el) starsContainerRefs.current.set(skill.slug, el);
                    }}
                    className="pointer-events-none absolute inset-0 overflow-visible"
                  >
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="star-particle text-amber absolute"
                        style={{
                          fontSize: '10px',
                          top: `${[-6, -4, -6, -2][i]}px`,
                          left: `${[10, 45, 70, 30][i]}%`,
                        }}
                      >
                        &#10022;
                      </div>
                    ))}
                  </div>
                )}

                {isConcept ? (
                  <span className="text-ink font-mono text-xs font-black tracking-tight uppercase md:text-sm">{CONCEPT_LABELS[skill.slug] || skill.name.slice(0, 3)}</span>
                ) : (
                  <img src={`${LOGO_BASE}${skill.logoPath}`} alt={skill.name} className="h-8 w-8 object-contain md:h-10 md:w-10" loading="lazy" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeSkill && (
        <div
          ref={overlayRef}
          className="bg-ink/60 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget) closePopup();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeSkill.name} skill details`}
        >
          <div
            ref={popupRef}
            tabIndex={-1}
            className="border-ink bg-paper relative w-full max-w-md overflow-visible rounded-md border-2 p-6 focus:outline-none md:p-8"
            style={{ boxShadow: '0 8px 0 0 var(--color-ink)' }}
          >
            {activeSkill.level === 10 && (
              <div
                className="popup-glow-layer pointer-events-none absolute -inset-1 rounded-md"
                style={{
                  background: 'conic-gradient(from 0deg, oklch(87% 0.23 135), oklch(80% 0.16 75), oklch(87% 0.23 135))',
                  opacity: 0.3,
                  filter: 'blur(12px)',
                  zIndex: -1,
                }}
              />
            )}

            <button
              onClick={closePopup}
              className="border-ink bg-concrete-2 text-graphite absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-xs border-2 text-lg font-bold transition-colors"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="mb-6 flex items-center gap-4">
              <div
                className="border-ink bg-concrete-2 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md border-2"
                style={{ boxShadow: '0 3px 0 0 var(--color-ink)' }}
              >
                {CONCEPT_SKILLS.has(activeSkill.slug) ? (
                  <span className="text-ink font-mono text-sm font-black uppercase">{CONCEPT_LABELS[activeSkill.slug] || activeSkill.name.slice(0, 3)}</span>
                ) : (
                  <img src={`${LOGO_BASE}${activeSkill.logoPath}`} alt={activeSkill.name} className="h-10 w-10 object-contain" />
                )}
              </div>
              <div>
                <h3 className="font-display text-ink text-xl font-black uppercase md:text-2xl">{activeSkill.name}</h3>
                <p className="text-graphite font-mono text-sm font-bold tracking-wider uppercase">
                  {activeSkill.level === 10
                    ? 'EXPERT'
                    : activeSkill.level >= 8
                      ? 'ADVANCED'
                      : activeSkill.level >= 6
                        ? 'PROFICIENT'
                        : activeSkill.level >= 4
                          ? 'INTERMEDIATE'
                          : 'LEARNING'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-graphite font-mono text-xs font-bold tracking-widest uppercase">Proficiency</span>
                <span className="font-display text-ink text-sm font-black tabular-nums">{activeSkill.level}/10</span>
              </div>

              <div ref={healthBarWrapRef} className="relative">
                <div className="border-ink bg-concrete-2 relative h-6 overflow-hidden rounded-xs border-2" style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
                  <div ref={healthBarRef} className="absolute inset-y-0 left-0" style={{ background: getHealthBarGradientForLevel(activeSkill.level), width: '0%' }}>
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                        animation: 'healthBarShine 2s ease-in-out infinite',
                      }}
                    />
                  </div>

                  <div className="absolute inset-0 flex">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex-1" style={{ borderRight: i < 9 ? '1px solid rgba(0,0,0,0.15)' : 'none' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {activeSkill.projects.length > 0 && (
              <div>
                <h4 className="text-graphite mb-3 font-mono text-xs font-bold tracking-widest uppercase">Projects</h4>
                <div className="flex flex-wrap gap-2">
                  {activeSkill.projects.map(project => (
                    <span
                      key={project.slug}
                      className="border-ink bg-concrete-2 text-ink inline-flex items-center rounded-xs border-2 px-3 py-1.5 text-xs font-bold tracking-wide uppercase"
                      style={{ boxShadow: '0 2px 0 0 var(--color-ink)' }}
                    >
                      {project.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeSkill.level === 10 && (
              <div
                className="border-ink mt-5 flex items-center justify-center gap-3 rounded-sm border-2 px-5 py-3 text-center"
                style={{ background: 'linear-gradient(135deg, var(--color-ink), var(--color-signal-deep))', boxShadow: '0 4px 0 0 var(--color-ink)' }}
              >
                <span className="text-amber text-xl drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">&#10022;</span>
                <span className="text-concrete font-mono text-sm font-black tracking-widest uppercase" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  Mastered
                </span>
                <span className="text-amber text-xl drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">&#10022;</span>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes healthBarShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}
