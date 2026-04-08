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
 * Full color ramp from red (low) to emerald (max).
 * Each entry is a [position%, hex] stop along the gradient.
 */
const COLOR_RAMP = [
  [0, '#dc2626'],   // red-600
  [15, '#ea580c'],  // orange-600
  [30, '#f59e0b'],  // amber-500
  [45, '#eab308'],  // yellow-500
  [60, '#84cc16'],  // lime-500
  [75, '#22c55e'],  // green-500
  [90, '#10b981'],  // emerald-500
  [100, '#059669'], // emerald-600
] as const;

/**
 * Builds a gradient that ends at the color matching the proficiency level.
 * A 5/10 skill ends around yellow; only 10/10 reaches full emerald.
 * The gradient is stretched so the final visible color sits at the fill edge.
 */
function getHealthBarGradientForLevel(level: number): string {
  // Map level (1-10) to a 0-100 percentage through the color ramp
  const pct = (level / 10) * 100;

  // Collect stops up to (and slightly past) the target percentage
  const stops: string[] = [];
  for (const [pos, color] of COLOR_RAMP) {
    // Remap the stop position so the full ramp maps to 0% - fill%
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
  const rect = container.getBoundingClientRect();

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

    const angle = (Math.random() - 0.5) * Math.PI * 1.2; // spread arc
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
      }
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

    // Random position along the popup edges
    const side = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let x: string, y: string;
    switch (side) {
      case 0: x = `${Math.random() * 100}%`; y = '-8px'; break;
      case 1: x = 'calc(100% + 8px)'; y = `${Math.random() * 100}%`; break;
      case 2: x = `${Math.random() * 100}%`; y = 'calc(100% + 8px)'; break;
      default: x = '-8px'; y = `${Math.random() * 100}%`; break;
    }

    star.style.cssText = `
      position: absolute;
      left: ${x};
      top: ${y};
      font-size: ${8 + Math.random() * 10}px;
      color: #facc15;
      pointer-events: none;
      z-index: 10;
      text-shadow: 0 0 8px rgba(250,204,21,0.6), 0 0 16px rgba(168,85,247,0.3);
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
      }
    );
  };

  // Initial burst of a few stars
  for (let i = 0; i < 5; i++) {
    setTimeout(spawn, i * 100);
  }

  // Then keep spawning periodically
  intervalId = window.setInterval(spawn, 400);
}

/**
 * SkillsShowcase - Interactive full-width skills display
 *
 * Features:
 * - Scattered icon grid layout
 * - Click-to-reveal popup with skill details
 * - Video game style health bar (red to green)
 * - GSAP star power glow effect for 10/10 skills
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

  // GSAP: Reveal icons on mount with staggered animation
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
      }
    );
  }, [skills]);

  // GSAP: Star power glow animation for 10/10 skills
  useEffect(() => {
    const expertSlugs = skills.filter(s => s.level === 10).map(s => s.slug);

    expertSlugs.forEach(slug => {
      const glowEl = glowRefs.current.get(slug);
      const starsEl = starsContainerRefs.current.get(slug);

      if (glowEl) {
        // Pulsing rainbow glow
        gsap.to(glowEl, {
          boxShadow: '0 0 20px 4px rgba(168,85,247,0.6), 0 0 40px 8px rgba(249,115,22,0.3)',
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Rotating hue on the glow
        gsap.to(glowEl, {
          filter: 'hue-rotate(360deg)',
          duration: 4,
          repeat: -1,
          ease: 'none',
        });
      }

      if (starsEl) {
        // Sparkle particles
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
            }
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

  // GSAP: Popup open animation
  useEffect(() => {
    if (!activeSkill || !popupRef.current || !overlayRef.current) return;

    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );

    gsap.fromTo(
      popupRef.current,
      { opacity: 0, scale: 0.8, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' }
    );

    // Animate health bar fill
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
            // Star burst at end of bar for 10/10 only
            if (activeSkill.level === 10 && healthBarWrapRef.current) {
              spawnStarBurst(healthBarWrapRef.current);
            }
          },
        }
      );
    }

    // Star power glow on popup for expert skills
    if (activeSkill.level === 10 && popupRef.current) {
      const popup = popupRef.current;
      const glowLayer = popup.querySelector('.popup-glow-layer') as HTMLElement;

      // Pulsing multi-color box shadow
      gsap.to(popup, {
        boxShadow:
          '0 0 25px 5px rgba(168,85,247,0.5), 0 0 50px 10px rgba(249,115,22,0.3), 0 0 80px 15px rgba(6,182,212,0.15), 0 8px 0 0 var(--shadow-color)',
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Rotating hue on the glow layer (border shimmer)
      if (glowLayer) {
        gsap.to(glowLayer, {
          filter: 'hue-rotate(360deg)',
          duration: 3,
          repeat: -1,
          ease: 'none',
        });
        gsap.to(glowLayer, {
          opacity: 0.25,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Floating star particles around the popup
      spawnFloatingStars(popup);
    }
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
      },
    });
  }, [isClosing]);

  return (
    <section className="section-py" id="skills">
      <div className="container">
        {/* Section Header */}
        <div className="mb-10 text-center gsap-reveal">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-3"
            style={{ color: 'var(--foreground)' }}
          >
            Skills I Know
          </h2>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--foreground-muted)' }}
          >
            Over a decade of hands-on experience across the modern web stack.
            Click any skill to see my proficiency and the projects where I put it to work.
          </p>
        </div>

        {/* Icon Grid */}
        <div
          ref={containerRef}
          className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6 max-w-5xl mx-auto"
        >
          {skills.map(skill => {
            const isExpert = skill.level === 10;
            const isConcept = CONCEPT_SKILLS.has(skill.slug);

            return (
              <button
                key={skill.slug}
                onClick={() => setActiveSkill(skill)}
                className="skill-icon group relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  background: 'var(--surface)',
                  border: '3px solid var(--border)',
                  boxShadow: isExpert
                    ? undefined
                    : '0 4px 0 0 var(--shadow-color)',
                  cursor: 'pointer',
                }}
                title={skill.name}
                aria-label={`View ${skill.name} skill details`}
              >
                {/* Expert glow layer */}
                {isExpert && (
                  <div
                    ref={el => {
                      if (el) glowRefs.current.set(skill.slug, el);
                    }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow:
                        '0 0 12px 2px rgba(168,85,247,0.4), 0 4px 0 0 var(--shadow-color)',
                    }}
                  />
                )}

                {/* Star particles for experts */}
                {isExpert && (
                  <div
                    ref={el => {
                      if (el) starsContainerRefs.current.set(skill.slug, el);
                    }}
                    className="absolute inset-0 pointer-events-none overflow-visible"
                  >
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="star-particle absolute text-yellow-400"
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

                {/* Icon or concept label */}
                {isConcept ? (
                  <span
                    className="text-xs md:text-sm font-black uppercase tracking-tight"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {CONCEPT_LABELS[skill.slug] || skill.name.slice(0, 3)}
                  </span>
                ) : (
                  <img
                    src={`${LOGO_BASE}${skill.logoPath}`}
                    alt={skill.name}
                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                    loading="lazy"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Popup Overlay */}
      {activeSkill && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={e => {
            if (e.target === e.currentTarget) closePopup();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeSkill.name} skill details`}
        >
          <div
            ref={popupRef}
            className="relative w-full max-w-md rounded-2xl p-6 md:p-8 overflow-visible"
            style={{
              background: 'var(--surface)',
              border: '3px solid var(--border)',
              boxShadow: '0 8px 0 0 var(--shadow-color), 0 16px 32px -8px rgba(0,0,0,0.25)',
            }}
          >
            {/* Rainbow glow border layer for 10/10 */}
            {activeSkill.level === 10 && (
              <div
                className="popup-glow-layer absolute -inset-1 rounded-2xl pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, #a855f7, #f97316, #06b6d4, #22c55e, #facc15, #a855f7)',
                  opacity: 0.3,
                  filter: 'blur(12px)',
                  zIndex: -1,
                }}
              />
            )}

            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-lg font-bold transition-colors"
              style={{
                color: 'var(--foreground-muted)',
                background: 'var(--muted)',
                border: '2px solid var(--border)',
              }}
              aria-label="Close"
            >
              &times;
            </button>

            {/* Skill icon + name */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'var(--muted)',
                  border: '3px solid var(--border)',
                  boxShadow: '0 3px 0 0 var(--shadow-color)',
                }}
              >
                {CONCEPT_SKILLS.has(activeSkill.slug) ? (
                  <span
                    className="text-sm font-black uppercase"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {CONCEPT_LABELS[activeSkill.slug] || activeSkill.name.slice(0, 3)}
                  </span>
                ) : (
                  <img
                    src={`${LOGO_BASE}${activeSkill.logoPath}`}
                    alt={activeSkill.name}
                    className="w-10 h-10 object-contain"
                  />
                )}
              </div>
              <div>
                <h3
                  className="text-xl md:text-2xl font-black"
                  style={{ color: 'var(--foreground)' }}
                >
                  {activeSkill.name}
                </h3>
                <p
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ color: 'var(--foreground-muted)' }}
                >
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

            {/* Health Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: 'var(--foreground-muted)' }}
                >
                  Proficiency
                </span>
                <span
                  className="text-sm font-black tabular-nums"
                  style={{ color: 'var(--foreground)' }}
                >
                  {activeSkill.level}/10
                </span>
              </div>

              {/* Health bar wrapper - allows star overflow */}
              <div ref={healthBarWrapRef} className="relative">
              {/* Health bar container - video game style */}
              <div
                className="relative h-6 rounded-lg overflow-hidden"
                style={{
                  background: 'var(--muted)',
                  border: '3px solid var(--border)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                {/* Fill bar */}
                <div
                  ref={healthBarRef}
                  className="absolute inset-y-0 left-0 rounded-r-md"
                  style={{
                    background: getHealthBarGradientForLevel(activeSkill.level),
                    width: '0%',
                  }}
                >
                  {/* Animated shine */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                      animation: 'healthBarShine 2s ease-in-out infinite',
                    }}
                  />
                </div>

                {/* Segment markers */}
                <div className="absolute inset-0 flex">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{
                        borderRight:
                          i < 9 ? '1px solid rgba(0,0,0,0.15)' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
              </div>{/* close healthBarWrap */}
            </div>

            {/* Projects Used In */}
            {activeSkill.projects.length > 0 && (
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--foreground-muted)' }}
                >
                  Projects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeSkill.projects.map(project => (
                    <span
                      key={project.slug}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide"
                      style={{
                        background: 'var(--muted)',
                        color: 'var(--foreground)',
                        border: '2px solid var(--border)',
                        boxShadow: '0 2px 0 0 var(--shadow-color)',
                      }}
                    >
                      {project.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Expert badge for 10/10 */}
            {activeSkill.level === 10 && (
              <div
                className="mt-5 flex items-center justify-center gap-3 py-3 px-5 rounded-lg text-center"
                style={{
                  background: 'linear-gradient(135deg, var(--tactile-purple-mid), var(--tactile-coral-mid))',
                  border: '3px solid var(--border)',
                  boxShadow: '0 4px 0 0 var(--shadow-color)',
                }}
              >
                <span className="text-yellow-300 text-xl drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">&#10022;</span>
                <span
                  className="text-sm font-black uppercase tracking-widest"
                  style={{ color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                >
                  Mastered
                </span>
                <span className="text-yellow-300 text-xl drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">&#10022;</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Health bar shine keyframe */}
      <style>{`
        @keyframes healthBarShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  );
}
