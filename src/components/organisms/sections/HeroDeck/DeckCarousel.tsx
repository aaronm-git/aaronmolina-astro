import { useCallback, useEffect, useRef, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import gsap from 'gsap';

export interface DeckSlide {
  /** Rendered screenshot source */
  src: string;
  /** Accessible description of the screenshot */
  alt: string;
  /** Site or project name shown in the card's title bar */
  label: string;
}

interface DeckCarouselProps {
  /** Screenshots to cycle through */
  slides: DeckSlide[];
}

/** How many upcoming cards peek out from behind the front card. */
const PEEK_COUNT = 2;

/** Vertical offset and scale falloff applied per step back in the stack. */
const DEPTH_OFFSET = 26;
const DEPTH_SCALE = 0.055;

/** Resting transform for a card sitting `depth` steps back in the deck. */
function slotFor(depth: number, total: number) {
  return {
    x: 0,
    y: -depth * DEPTH_OFFSET,
    rotate: 0,
    scale: 1 - depth * DEPTH_SCALE,
    opacity: depth <= PEEK_COUNT ? 1 : 0,
    zIndex: total - depth,
  };
}

function CardChrome({ label }: { label: string }) {
  return (
    <div className="border-ink bg-ink flex items-center gap-1.5 border-b-2 px-3 py-2.5">
      <span className="bg-signal block h-2.5 w-2.5 rounded-full" />
      <span className="bg-steel block h-2.5 w-2.5 rounded-full" />
      <span className="bg-steel block h-2.5 w-2.5 rounded-full" />
      <span className="text-steel ml-2 truncate font-mono text-[10px] font-bold tracking-[0.14em] uppercase">{label}</span>
    </div>
  );
}

/**
 * Screenshot deck for the hero. Embla is the controller only, running loop,
 * autoplay, and drag on a transparent overlay; GSAP does the motion, throwing
 * the front card out of frame and settling it at the back while every card
 * behind it steps forward.
 */
export default function DeckCarousel({ slides }: DeckCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3600, stopOnInteraction: false, stopOnMouseEnter: true })]);
  const [selected, setSelected] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const previous = useRef(0);
  const total = slides.length;

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Place every card at rest before the first transition runs.
  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      if (card) gsap.set(card, slotFor((index - previous.current + total) % total, total));
    });
  }, [total]);

  useEffect(() => {
    const from = previous.current;
    if (from === selected) return;
    previous.current = selected;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timeline = gsap.timeline();

    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const wasDepth = (index - from + total) % total;
      const depth = (index - selected + total) % total;
      const rest = slotFor(depth, total);

      if (reduced) {
        timeline.set(card, rest, 0);
        return;
      }

      // The card leaving the front is thrown clear of the deck, then dropped in
      // at the back so it never streaks across the cards still on screen.
      if (wasDepth === 0) {
        timeline
          .to(card, { x: 120, y: 70, rotate: 7, opacity: 0, duration: 0.42, ease: 'power2.in' }, 0)
          .set(card, { ...rest, opacity: 0 })
          .to(card, { opacity: rest.opacity, duration: 0.25, ease: 'power1.out' });
        return;
      }

      timeline.to(card, { ...rest, duration: 0.62, ease: 'power3.out' }, 0.12);
    });

    return () => {
      timeline.kill();
    };
  }, [selected, total]);

  return (
    <div className="relative w-[600px] max-w-full">
      <div className="relative pt-16">
        <div className="invisible" aria-hidden="true">
          <CardChrome label={slides[0]?.label ?? ''} />
          <div className="aspect-[8/5]" />
        </div>

        {slides.map((slide, index) => (
          <div
            key={slide.src}
            ref={element => {
              cardRefs.current[index] = element;
            }}
            aria-hidden={index !== selected}
            className="border-ink bg-paper absolute inset-x-0 top-16 overflow-hidden rounded-md border-2 will-change-transform"
            style={{ boxShadow: index === selected ? '10px 10px 0 var(--color-signal)' : '6px 6px 0 var(--color-ink)' }}
          >
            <CardChrome label={slide.label} />
            <img src={slide.src} alt={slide.alt} width={1200} height={750} className="block aspect-[8/5] w-full object-cover object-top" loading="lazy" />
          </div>
        ))}

        <div className="absolute inset-0 z-20 cursor-grab overflow-hidden active:cursor-grabbing" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map(slide => (
              <div className="min-w-0 flex-[0_0_100%]" key={slide.src} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-30 mt-6 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={slide.label}
            aria-current={index === selected}
            className={`border-seam h-2.5 rounded-xs border-2 transition-all duration-200 ${index === selected ? 'bg-signal border-signal w-7' : 'w-2.5 bg-transparent'}`}
          />
        ))}
      </div>
    </div>
  );
}
