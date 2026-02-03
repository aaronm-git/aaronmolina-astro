# Atomic Design Architecture Plan

**Project:** aaronmolina.me
**Date:** February 3, 2026
**Design System:** Tactile Maximalism
**Framework:** Astro + Tailwind CSS 4
**Animation:** Motion (Framer Motion) or existing GSAP use whatever is best for the job and delete the other one.

---

## Executive Summary

This plan restructures the site's component architecture following **Atomic Design** principles while maintaining the **Tactile Maximalism** design trend. The goal is maximum reusability, uniformity across pages, and clear separation between content and presentation.

### Design Philosophy: Tactile Maximalism

Based on [2026 design trends](https://www.wix.com/blog/web-design-trends):

- **Big, bold typography** — Exaggerated hierarchy with oversized headlines
- **Layered textures** — Depth, shadows, and tactile surfaces
- **Micro-delight interactions** — Bouncy buttons, reactive elements
- **Organic flow** — Soft animations, liquid motion
- **Frosted glass (Glassmorphism)** — Translucent layers, diffused shadows
- **3D sculptural elements** — Pressable, touchable-feeling components
- **Rich color palettes** — Your existing purple/coral/cyan works perfectly

---

## Part 1: Atomic Design Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                         PAGES                                    │
│   (Full page compositions - /hire, /blog/[post], etc.)          │
├─────────────────────────────────────────────────────────────────┤
│                       TEMPLATES                                  │
│   (Page layouts with slot zones - HirePage, BlogPost, etc.)     │
├─────────────────────────────────────────────────────────────────┤
│                       ORGANISMS                                  │
│   (Complete sections - HeroSection, FeaturesGrid, etc.)         │
├─────────────────────────────────────────────────────────────────┤
│                       MOLECULES                                  │
│   (Component groups - Card, NavMenu, FormField, etc.)           │
├─────────────────────────────────────────────────────────────────┤
│                         ATOMS                                    │
│   (Basic elements - Button, Tag, Icon, Text, Input, etc.)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Part 2: New Directory Structure

```
src/
├── components/
│   ├── atoms/                    # Basic building blocks
│   │   ├── Button.astro
│   │   ├── Tag.astro
│   │   ├── Icon.astro
│   │   ├── Text.astro           # NEW: Typography component
│   │   ├── Heading.astro        # NEW: H1-H6 with variants
│   │   ├── Link.astro           # NEW: Styled anchor
│   │   ├── Image.astro          # NEW: Optimized image wrapper
│   │   ├── Badge.astro          # NEW: Status/label badges
│   │   ├── Divider.astro        # NEW: Horizontal/vertical dividers
│   │   ├── Skeleton.astro       # NEW: Loading placeholder
│   │   ├── Avatar.astro         # NEW: Profile images
│   │   └── index.ts             # Barrel export
│   │
│   ├── molecules/                # Component combinations
│   │   ├── Card.astro           # NEW: Base card (replaces BlogPostCard container)
│   │   ├── TagList.astro        # MOVE from ui/
│   │   ├── SectionHeader.astro  # MOVE from ui/
│   │   ├── InfoBox.astro        # MOVE from ui/
│   │   ├── ListItem.astro       # MOVE from ui/
│   │   ├── NavLink.astro        # NEW: Nav item with icon
│   │   ├── FormField.astro      # NEW: Label + input combo
│   │   ├── StatItem.astro       # NEW: Number + label
│   │   ├── MediaObject.astro    # NEW: Image + text pattern
│   │   ├── Breadcrumb.astro     # NEW: Navigation breadcrumbs
│   │   ├── Rating.astro         # NEW: Star ratings
│   │   ├── SocialLink.astro     # NEW: Single social link
│   │   └── index.ts
│   │
│   ├── organisms/                # Complete sections
│   │   ├── cards/               # Card variants
│   │   │   ├── BlogPostCard.astro
│   │   │   ├── ProjectCard.astro
│   │   │   ├── RoleCard.astro
│   │   │   ├── ServiceCard.astro    # NEW
│   │   │   ├── TestimonialCard.astro # NEW
│   │   │   ├── TeamCard.astro       # NEW
│   │   │   ├── PricingCard.astro    # NEW
│   │   │   └── index.ts
│   │   │
│   │   ├── sections/            # Page sections (NEW)
│   │   │   ├── HeroSection.astro
│   │   │   ├── FeaturesSection.astro
│   │   │   ├── ServicesSection.astro
│   │   │   ├── ProjectsSection.astro
│   │   │   ├── TestimonialsSection.astro
│   │   │   ├── ExperienceSection.astro
│   │   │   ├── SkillsSection.astro
│   │   │   ├── CTASection.astro
│   │   │   ├── FAQSection.astro
│   │   │   ├── PricingSection.astro
│   │   │   ├── ContactSection.astro
│   │   │   ├── StatsSection.astro
│   │   │   ├── LogoCloudSection.astro
│   │   │   ├── BlogSection.astro
│   │   │   ├── AboutSection.astro
│   │   │   ├── TimelineSection.astro
│   │   │   └── index.ts
│   │   │
│   │   ├── navigation/          # Navigation organisms
│   │   │   ├── Header.astro     # MOVE from layout/
│   │   │   ├── Footer.astro     # MOVE from layout/
│   │   │   ├── MobileMenu.astro # NEW: Extract from Header
│   │   │   ├── Sidebar.astro    # NEW: For future use
│   │   │   └── index.ts
│   │   │
│   │   ├── forms/               # Form organisms
│   │   │   ├── ContactForm.astro
│   │   │   ├── NewsletterForm.astro # NEW
│   │   │   └── index.ts
│   │   │
│   │   └── decorative/          # Decorative elements
│   │       ├── AeroBubbles.astro # MOVE from ui/
│   │       ├── GradientBlob.astro # NEW
│   │       ├── NoiseOverlay.astro # NEW
│   │       └── index.ts
│   │
│   └── index.ts                 # Master barrel export
│
├── templates/                   # Page templates (NEW)
│   ├── BaseTemplate.astro       # Core layout wrapper
│   ├── HomeTemplate.astro       # Homepage layout
│   ├── HireTemplate.astro       # Hire pages layout
│   ├── BlogListTemplate.astro   # Blog listing layout
│   ├── BlogPostTemplate.astro   # Single post layout
│   ├── ProjectListTemplate.astro
│   ├── ProjectDetailTemplate.astro
│   ├── ServiceTemplate.astro    # Service page layout
│   └── index.ts
│
├── layouts/                     # Astro layouts (simplified)
│   └── Layout.astro             # Renamed from main-layout
│
├── content/                     # Content (unchanged structure)
│   └── ...
│
├── styles/
│   ├── global.css               # Design tokens & base
│   ├── atoms.css                # NEW: Atom-level utilities
│   ├── animations.css           # NEW: Animation utilities
│   └── themes/                  # NEW: Theme variants
│       ├── default.css
│       └── high-contrast.css
│
└── lib/                         # Utilities (renamed from utils)
    ├── tech-lookup.ts
    ├── icons.ts
    ├── date-format.ts
    ├── animations.ts            # MOVE from scripts/
    └── cn.ts                    # NEW: Class name utility
```

---

## Part 3: Section Components Inventory

Based on [best practice research](https://www.unsection.com/) and portfolio website patterns:

### Hero Sections

| Component       | Purpose            | Variants                                     | Content Props                                                      |
| --------------- | ------------------ | -------------------------------------------- | ------------------------------------------------------------------ |
| **HeroSection** | Primary page intro | `centered`, `split`, `fullscreen`, `minimal` | `headline`, `subheadline`, `description`, `cta`, `image`, `badges` |

**Tactile Maximalism Features:**

- Oversized headline (clamp: 3rem - 6rem)
- Layered background with noise texture
- Floating decorative elements
- Bouncy CTA button animation

### Features/Services Sections

| Component           | Purpose              | Variants                                | Content Props                       |
| ------------------- | -------------------- | --------------------------------------- | ----------------------------------- |
| **FeaturesSection** | Display capabilities | `grid`, `bento`, `alternating`, `cards` | `title`, `subtitle`, `features[]`   |
| **ServicesSection** | Service offerings    | `grid`, `list`, `carousel`              | `title`, `services[]`, `cta`        |
| **SkillsSection**   | Technology/skills    | `grid`, `grouped`, `cloud`              | `title`, `skills[]`, `categories[]` |

### Social Proof Sections

| Component               | Purpose              | Variants                                  | Content Props             |
| ----------------------- | -------------------- | ----------------------------------------- | ------------------------- |
| **TestimonialsSection** | Client quotes        | `carousel`, `grid`, `featured`, `marquee` | `title`, `testimonials[]` |
| **LogoCloudSection**    | Client/partner logos | `static`, `scrolling`, `grid`             | `title`, `logos[]`        |
| **StatsSection**        | Key metrics          | `inline`, `grid`, `cards`                 | `stats[]`                 |

### Content Sections

| Component             | Purpose              | Variants                          | Content Props                      |
| --------------------- | -------------------- | --------------------------------- | ---------------------------------- |
| **ProjectsSection**   | Portfolio showcase   | `grid`, `featured`, `masonry`     | `title`, `projects[]`, `cta`       |
| **BlogSection**       | Recent posts         | `grid`, `list`, `featured`        | `title`, `posts[]`, `cta`          |
| **ExperienceSection** | Work history         | `timeline`, `cards`, `compact`    | `title`, `roles[]`                 |
| **TimelineSection**   | Chronological events | `vertical`, `horizontal`          | `title`, `events[]`                |
| **AboutSection**      | Bio/intro            | `split`, `centered`, `with-image` | `title`, `content`, `image`, `cta` |

### Conversion Sections

| Component          | Purpose        | Variants                                  | Content Props                                        |
| ------------------ | -------------- | ----------------------------------------- | ---------------------------------------------------- |
| **CTASection**     | Call to action | `centered`, `split`, `banner`, `floating` | `title`, `description`, `primaryCta`, `secondaryCta` |
| **PricingSection** | Pricing tables | `cards`, `comparison`, `simple`           | `title`, `plans[]`, `faq`                            |
| **ContactSection** | Contact form   | `split`, `centered`, `minimal`            | `title`, `description`, `form`, `contactInfo`        |
| **FAQSection**     | Q&A accordion  | `accordion`, `grid`, `tabs`               | `title`, `faqs[]`                                    |

---

## Part 4: Atom Components Specification

### Button.astro (Enhanced)

```typescript
interface Props {
  // Content
  label?: string;
  icon?: string;
  iconPosition?: 'left' | 'right' | 'only';

  // Behavior
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  external?: boolean;
  disabled?: boolean;
  loading?: boolean;

  // Style
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'tactile' | 'glass';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'base' | 'lg' | 'full';

  // Tactile features
  depth?: boolean; // 3D shadow effect
  bounce?: boolean; // Bouncy hover animation
  glow?: boolean; // Glow effect on hover
}
```

**Tactile Styles:**

```css
/* Tactile variant */
.btn-tactile {
  --depth: 4px;
  box-shadow:
    0 var(--depth) 0 var(--primary-dark),
    0 var(--depth) 10px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.btn-tactile:hover {
  transform: translateY(-2px);
  box-shadow:
    0 calc(var(--depth) + 2px) 0 var(--primary-dark),
    0 calc(var(--depth) + 2px) 15px rgba(0, 0, 0, 0.25);
}

.btn-tactile:active {
  transform: translateY(var(--depth));
  box-shadow:
    0 0 0 var(--primary-dark),
    0 2px 5px rgba(0, 0, 0, 0.15);
}
```

### Heading.astro (New)

```typescript
interface Props {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'hero';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  align?: 'left' | 'center' | 'right';
  gradient?: boolean;
  balance?: boolean; // text-wrap: balance
}
```

**Hero Size (Tactile Maximalism):**

```css
.heading-hero {
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
}
```

### Text.astro (New)

```typescript
interface Props {
  as?: 'p' | 'span' | 'div' | 'label';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'foreground' | 'muted' | 'primary' | 'secondary' | 'inherit';
  leading?: 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  balance?: boolean;
}
```

### Badge.astro (New)

```typescript
interface Props {
  label: string;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'xs' | 'sm' | 'base';
  icon?: string;
  dot?: boolean;
  removable?: boolean;
}
```

### Avatar.astro (New)

```typescript
interface Props {
  src?: string;
  alt: string;
  fallback?: string; // Initials fallback
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  rounded?: 'none' | 'sm' | 'base' | 'lg' | 'full';
  border?: boolean;
  status?: 'online' | 'offline' | 'busy' | 'away';
}
```

---

## Part 5: Molecule Components Specification

### Card.astro (Base)

```typescript
interface Props {
  // Style
  variant?: 'default' | 'elevated' | 'outlined' | 'glass' | 'tactile';
  padding?: 'none' | 'sm' | 'base' | 'lg';
  rounded?: 'none' | 'sm' | 'base' | 'lg' | 'xl';

  // Behavior
  href?: string;
  hoverable?: boolean;
  clickable?: boolean;

  // Tactile features
  depth?: boolean;
  lift?: boolean;  // Lift on hover
}

// Slots
<slot name="media" />     <!-- Image/video area -->
<slot name="header" />    <!-- Card header -->
<slot />                  <!-- Card body (default) -->
<slot name="footer" />    <!-- Card footer -->
```

### StatItem.astro (New)

```typescript
interface Props {
  value: string | number;
  label: string;
  prefix?: string;
  suffix?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  size?: 'sm' | 'base' | 'lg';
  animate?: boolean; // Count up animation
}
```

### MediaObject.astro (New)

```typescript
interface Props {
  // Media
  imageSrc?: string;
  imageAlt?: string;
  icon?: string;

  // Content
  title: string;
  description?: string;
  meta?: string;

  // Layout
  mediaPosition?: 'left' | 'right' | 'top';
  mediaSize?: 'sm' | 'base' | 'lg';
  align?: 'start' | 'center' | 'end';
}
```

---

## Part 6: Organism Section Specifications

### HeroSection.astro

```typescript
interface Props {
  // Content (from content collection)
  headline: string;
  subheadline?: string;
  description?: string;

  // CTAs
  primaryCta?: {
    label: string;
    href: string;
    icon?: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
    icon?: string;
  };

  // Media
  image?: ImageMetadata;
  video?: string;

  // Extras
  badges?: string[];
  socialProof?: {
    avatars: string[];
    text: string;
  };

  // Style
  variant?: 'centered' | 'split' | 'fullscreen' | 'minimal';
  align?: 'left' | 'center' | 'right';
  height?: 'auto' | 'screen' | 'half';

  // Decorative
  showBubbles?: boolean;
  showGradient?: boolean;
  showNoise?: boolean;
}
```

**Variant Examples:**

1. **Centered** (Homepage)
   - Large centered headline
   - Subheadline below
   - Two CTA buttons
   - Decorative bubbles background

2. **Split** (Hire pages)
   - Text on left, image on right
   - Headline + description
   - Single primary CTA
   - Testimonial social proof

3. **Minimal** (Blog listing)
   - Simple headline
   - Description
   - No image/decorations

### FeaturesSection.astro

```typescript
interface Props {
  title: string;
  subtitle?: string;
  description?: string;

  features: Array<{
    icon: string;
    title: string;
    description: string;
    href?: string;
  }>;

  variant?: 'grid' | 'bento' | 'alternating' | 'cards';
  columns?: 2 | 3 | 4;

  cta?: {
    label: string;
    href: string;
  };
}
```

### TestimonialsSection.astro

```typescript
interface Props {
  title: string;
  subtitle?: string;

  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    company?: string;
    avatar?: string;
    rating?: number;
  }>;

  variant?: 'carousel' | 'grid' | 'featured' | 'marquee';
  columns?: 1 | 2 | 3;
  showRatings?: boolean;
}
```

### CTASection.astro

```typescript
interface Props {
  title: string;
  description?: string;

  primaryCta: {
    label: string;
    href: string;
    icon?: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };

  variant?: 'centered' | 'split' | 'banner' | 'floating';
  background?: 'default' | 'primary' | 'gradient' | 'image';
  backgroundImage?: ImageMetadata;
}
```

### FAQSection.astro

```typescript
interface Props {
  title: string;
  subtitle?: string;

  faqs: Array<{
    question: string;
    answer: string;
    category?: string;
  }>;

  variant?: 'accordion' | 'grid' | 'tabs';
  columns?: 1 | 2;
  showCategories?: boolean;

  cta?: {
    label: string;
    href: string;
  };
}
```

---

## Part 7: Page Templates

### HireTemplate.astro

```astro
---
// Template for /hire/* pages
interface Props {
  // Hero
  heroHeadline: string;
  heroDescription: string;
  heroCta: { label: string; href: string };
  heroImage?: ImageMetadata;

  // Content sections (optional, order matters)
  features?: FeaturesSectionProps;
  services?: ServicesSectionProps;
  projects?: ProjectsSectionProps;
  testimonials?: TestimonialsSectionProps;
  stats?: StatsSectionProps;
  faq?: FAQSectionProps;

  // Final CTA
  cta: CTASectionProps;
}
---

<Layout title={heroHeadline}>
  <HeroSection variant="split" headline={heroHeadline} description={heroDescription} primaryCta={heroCta} image={heroImage} />

  {features && <FeaturesSection {...features} />}
  {stats && <StatsSection {...stats} />}
  {services && <ServicesSection {...services} />}
  {projects && <ProjectsSection {...projects} />}
  {testimonials && <TestimonialsSection {...testimonials} />}
  {faq && <FAQSection {...faq} />}

  <CTASection {...cta} />
</Layout>
```

### BlogPostTemplate.astro

```astro
---
interface Props {
  post: CollectionEntry<'blog'>;
  techMap: TechMap;
}
---

<Layout title={post.data.title} description={post.data.description}>
  <article>
    <HeroSection variant="minimal" headline={post.data.title} badges={post.data.tags} />

    {post.data.image && <FeaturedImage image={post.data.image} alt={post.data.title} />}

    <div class="prose">
      <slot />
    </div>

    <TagList tags={post.data.tags} techMap={techMap} />

    <AboutSection variant="author" />

    <CTASection title="Want to work together?" primaryCta={{ label: 'Get in touch', href: '/contact' }} />
  </article>
</Layout>
```

---

## Part 8: Content Separation Strategy

### Principle: Content lives in `/src/content/`, never in components

```
Content Flow:
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Content Files   │ ──► │   Page Files     │ ──► │   Components     │
│  (JSON/Markdown) │     │   (fetch data)   │     │   (render UI)    │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### New Content Collections to Add

```typescript
// src/content.config.ts additions

const faqCollection = defineCollection({
  type: 'data',
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    category: z.string().optional(),
    order: z.number().optional(),
    page: z.string(), // Which page this FAQ belongs to
  }),
});

const sectionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    page: z.string(),
    section: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    cta: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
    order: z.number(),
  }),
});
```

### Content File Examples

**`/src/content/sections/hire-hero.json`:**

```json
{
  "page": "hire",
  "section": "hero",
  "title": "Hire a Jamstack Developer",
  "subtitle": "Astro, Next.js & Sanity Expert",
  "description": "I build high-performance, content-driven websites...",
  "cta": {
    "label": "Let's Talk",
    "href": "/contact"
  },
  "order": 1
}
```

**`/src/content/faqs/hire-general.json`:**

```json
{
  "page": "hire",
  "question": "What's your availability?",
  "answer": "I'm available for full-time W2 positions and select freelance projects...",
  "category": "general",
  "order": 1
}
```

---

## Part 9: Animation Strategy (Motion)

### Migration from GSAP to Motion

**Why Motion (Framer Motion):**

- Declarative API fits better with Astro/React
- Smaller bundle size
- Better TypeScript support
- Gesture support built-in

**Keep GSAP for:**

- Complex scroll-triggered timelines
- SVG morphing
- Text reveals

### Motion Utility Components

**`/src/components/atoms/Animate.astro`:**

```astro
---
interface Props {
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideIn';
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}
---

<div data-animate={animation} data-delay={delay} data-duration={duration} data-once={once} data-threshold={threshold}>
  <slot />
</div>

<script>
  // Initialize Motion observer for scroll animations
</script>
```

### Animation Presets

```typescript
// src/lib/motion-presets.ts

export const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },

  tactileBounce: {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98, y: 2 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },

  staggerChildren: {
    animate: { transition: { staggerChildren: 0.1 } },
  },
};
```

---

## Part 10: Implementation Phases

### Phase 1: Foundation (Week 1)

- [ ] Create new directory structure
- [ ] Move existing components to new locations
- [ ] Create barrel exports (`index.ts` files)
- [ ] Set up new CSS files (`atoms.css`, `animations.css`)
- [ ] Create `cn()` utility for class merging
- [ ] Update import paths throughout project

### Phase 2: Atoms (Week 1-2)

- [ ] Enhance `Button.astro` with new variants
- [ ] Create `Heading.astro`
- [ ] Create `Text.astro`
- [ ] Create `Badge.astro`
- [ ] Create `Avatar.astro`
- [ ] Create `Divider.astro`
- [ ] Create `Skeleton.astro`
- [ ] Create `Link.astro`
- [ ] Create `Image.astro`
- [ ] Update `Tag.astro` with tactile variant

### Phase 3: Molecules (Week 2)

- [ ] Create base `Card.astro`
- [ ] Create `StatItem.astro`
- [ ] Create `MediaObject.astro`
- [ ] Create `Breadcrumb.astro`
- [ ] Create `FormField.astro`
- [ ] Create `SocialLink.astro`
- [ ] Update `SectionHeader.astro`

### Phase 4: Organisms - Cards (Week 2-3)

- [ ] Refactor `BlogPostCard.astro` to use base Card
- [ ] Refactor `ProjectCard.astro` to use base Card
- [ ] Refactor `RoleCard.astro` to use base Card
- [ ] Create `ServiceCard.astro`
- [ ] Create `TestimonialCard.astro`
- [ ] Create `PricingCard.astro`

### Phase 5: Organisms - Sections (Week 3-4)

- [ ] Create `HeroSection.astro` (all variants)
- [ ] Create `FeaturesSection.astro`
- [ ] Create `ServicesSection.astro`
- [ ] Create `TestimonialsSection.astro`
- [ ] Create `CTASection.astro`
- [ ] Create `FAQSection.astro`
- [ ] Create `StatsSection.astro`
- [ ] Create `LogoCloudSection.astro`
- [ ] Create `ContactSection.astro`
- [ ] Create `AboutSection.astro`
- [ ] Create `TimelineSection.astro`
- [ ] Update `ProjectsSection.astro`
- [ ] Update `BlogSection.astro`
- [ ] Update `ExperienceSection.astro`
- [ ] Create `SkillsSection.astro`

### Phase 6: Templates (Week 4)

- [ ] Create `BaseTemplate.astro`
- [ ] Create `HomeTemplate.astro`
- [ ] Create `HireTemplate.astro`
- [ ] Create `BlogListTemplate.astro`
- [ ] Create `BlogPostTemplate.astro`
- [ ] Create `ProjectListTemplate.astro`
- [ ] Create `ProjectDetailTemplate.astro`
- [ ] Create `ServiceTemplate.astro`

### Phase 7: Pages (Week 4-5)

- [ ] Refactor `index.astro` using HomeTemplate
- [ ] Create `/hire/index.astro`
- [ ] Create `/hire/react-developer.astro`
- [ ] Create `/hire/nextjs-developer.astro`
- [ ] Create `/hire/headless-cms.astro`
- [ ] Refactor `blog/index.astro`
- [ ] Refactor `blog/[post].astro`
- [ ] Refactor `projects/index.astro`
- [ ] Refactor `projects/[project].astro`
- [ ] Refactor `experience.astro`
- [ ] Refactor `contact.astro`

### Phase 8: Content & SEO (Week 5)

- [ ] Add FAQs content collection
- [ ] Add sections content collection
- [ ] Update page titles/meta per SEO research
- [ ] Add structured data (JSON-LD)
- [ ] Update sitemap

### Phase 9: Animation Polish (Week 5-6)

- [ ] Install Motion
- [ ] Create animation utility
- [ ] Add scroll animations to sections
- [ ] Add micro-interactions to buttons/cards
- [ ] Add page transitions

### Phase 10: Testing & Optimization (Week 6)

- [ ] Visual regression testing
- [ ] Performance audit (Core Web Vitals)
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check

---

## Part 11: Tailwind CSS Class Strategy

### Each component gets its own classes file pattern:

```css
/* src/styles/atoms.css */

/* Button base */
.btn {
  @apply inline-flex items-center justify-center font-medium transition-all;
  @apply focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-2;
}

/* Button sizes */
.btn-xs {
  @apply h-7 rounded px-2 text-xs;
}
.btn-sm {
  @apply h-8 rounded-md px-3 text-sm;
}
.btn-base {
  @apply h-10 rounded-md px-4 text-sm;
}
.btn-lg {
  @apply h-12 rounded-lg px-6 text-base;
}
.btn-xl {
  @apply h-14 rounded-xl px-8 text-lg;
}

/* Button variants */
.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

.btn-secondary {
  @apply bg-secondary text-secondary-foreground hover:bg-secondary/90;
}

.btn-tactile {
  @apply bg-primary text-primary-foreground;
  box-shadow:
    0 4px 0 var(--primary-dark),
    0 4px 10px rgba(0, 0, 0, 0.2);
}

.btn-tactile:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 0 var(--primary-dark),
    0 6px 15px rgba(0, 0, 0, 0.25);
}

.btn-tactile:active {
  transform: translateY(4px);
  box-shadow:
    0 0 0 var(--primary-dark),
    0 2px 5px rgba(0, 0, 0, 0.15);
}

/* Heading sizes */
.heading-hero {
  @apply font-black tracking-tight;
  font-size: clamp(2.5rem, 8vw, 6rem);
  line-height: 1.05;
}

.heading-1 {
  @apply text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl;
}
.heading-2 {
  @apply text-3xl font-bold tracking-tight md:text-4xl;
}
.heading-3 {
  @apply text-2xl font-semibold md:text-3xl;
}
.heading-4 {
  @apply text-xl font-semibold md:text-2xl;
}
.heading-5 {
  @apply text-lg font-medium;
}
.heading-6 {
  @apply text-base font-medium;
}
```

---

## Part 12: File Naming Conventions

### Components

```
PascalCase.astro          # Component files
kebab-case/               # Folder names for related components
index.ts                  # Barrel exports
```

### Content

```
kebab-case.json           # JSON data files
kebab-case.md             # Markdown content files
```

### Utilities

```
kebab-case.ts             # Utility files
```

### CSS

```
kebab-case.css            # Style files
```

---

## Quick Reference: Import Paths

```typescript
// Atoms
import { Button, Tag, Heading, Text, Badge } from '@/components/atoms';

// Molecules
import { Card, TagList, SectionHeader, StatItem } from '@/components/molecules';

// Organisms
import { HeroSection, FeaturesSection, CTASection } from '@/components/organisms/sections';
import { BlogPostCard, ProjectCard } from '@/components/organisms/cards';
import { Header, Footer } from '@/components/organisms/navigation';

// Templates
import { HireTemplate, BlogPostTemplate } from '@/templates';

// Utilities
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/date-format';
import { animations } from '@/lib/motion-presets';
```

---

## Sources

- [2026 Web Design Trends - Wix](https://www.wix.com/blog/web-design-trends)
- [Maximalism in Web Design - Invoxico](https://www.invoxico.com/maximalism-in-graphic-and-web-design/)
- [Website Sections Inspiration - Unsection](https://www.unsection.com/)
- [Hero Section Best Practices - Prismic](https://prismic.io/blog/website-hero-section)
- [Landing Page Examples - Instapage](https://instapage.com/blog/landing-page-examples)

---

_Plan version 1.0 — February 2026_
