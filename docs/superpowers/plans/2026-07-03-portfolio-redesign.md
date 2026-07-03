# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's "Tactile Maximalism" visual system with the hard-edged industrial/neo-brutalist system from the Field Crew Bold reference (spec: `docs/superpowers/specs/2026-07-03-portfolio-redesign-design.md`), rebuilding every component and page against it while preserving content collections, the AI chat feature, and routing.

**Architecture:** New OKLCH design tokens live in `src/styles/global.css` as Tailwind v4 `@theme` values (colors + two fonts + two hard-shadow utilities only — Tailwind's built-in spacing/radius/border-width scales already match the reference's numbers, so no custom tokens needed there). Every atom/molecule/organism/template file is rewritten in place (same path) so the repo stays buildable after each task; a small number of true orphans are deleted in one cleanup task near the end. Existing content collections, `src/lib/chat/`, `netlify/functions/`, and `src/pages/api/` are untouched except for a pure visual restyle of the chat UI and `SkillsShowcase.tsx`.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@theme`, no `tailwind.config`), React 19 (islands: chat + SkillsShowcase), GSAP 3 + ScrollTrigger, Zod (content collections), pnpm.

---

## File structure

**New/rewritten (same paths, in-place rewrite unless marked Create):**

```
src/styles/global.css                                    — rewrite: new tokens only
src/components/atoms/{Button,Badge,Divider,Heading,Text,Link,Avatar,Skeleton,Icon}.astro
src/components/molecules/{Card,SectionHeader,StatItem,TagList,SocialLink,SocialLinks,
  FormField,ListItem,Breadcrumbs,InfoBox,AuthorBio,RelatedPosts,HireNavigationTabs}.astro
src/components/organisms/navigation/{Header,Footer}.astro
src/components/organisms/decorative/StencilGrid.astro                                     — Create (hazard-tape divider is the Divider atom's `tape` variant, Task 7 — no separate organism needed)
src/components/organisms/cards/{ProjectCard,BlogPostCard,RoleCard}.astro
src/components/organisms/sections/{HeroSection,TrustStripSection,FeaturesSection,
  HowItWorksSection,EngagementSection,ComparisonSection,QuoteSection,FAQSection,CTASection,
  StatsSection,SkillsSection,ExperienceSection,ProjectsSection,BlogSection}.astro
src/components/organisms/sections/SkillsShowcase.tsx                                       — restyle only
src/components/organisms/ai-portfolio-chat/{PortfolioChat,ChatMessage,SuggestedPrompts,
  LeadCaptureModal,SystemPromptModal}.tsx                                                  — restyle only
src/templates/{HireTemplate,ProjectDetailTemplate,BlogPostTemplate,BaseTemplate}.astro
src/layouts/main-layout.astro                             — modify: drop theme script
src/pages/index.astro                                     — rewrite
src/pages/experience.astro                                — rewrite
src/pages/contact.astro                                    — rewrite
src/pages/projects/index.astro                             — rewrite
src/pages/blog/index.astro                                 — rewrite
src/pages/blog/tag/[tag].astro                              — rewrite
src/pages/hire/index.astro                                  — rewrite
src/pages/hire/react-developer.astro                        — modify: minor prop shape sync
src/pages/hire/nextjs-developer.astro                        — modify: minor prop shape sync
src/pages/hire/headless-cms.astro                            — modify: minor prop shape sync
CLAUDE.md, AGENTS.md                                       — modify: design-trend paragraph
```

**Deleted:** `ARCHITECTURE-PLAN.md` and `IMPLEMENTATION-PLAN.md` (Task 2). `src/components/organisms/cards/ServiceCard.astro`, `src/components/organisms/sections/ServicesSection.astro`, `src/components/organisms/cards/TestimonialCard.astro`, `src/components/organisms/sections/TestimonialsSection.astro`, `src/components/organisms/TechShowcase.astro`, `src/components/organisms/TechShowcaseMobile.astro`, `src/components/organisms/sections/ContactSection.astro` (already unused by any page today), `src/templates/BaseTemplate.astro` + its export line in `src/templates/index.ts` (already unused today), `src/components/molecules/NavLink.astro` (already unused today), `src/components/molecules/MediaObject.astro` (already unused today), `src/components/molecules/Breadcrumb.astro` (singular — already unused today; only the plural `Breadcrumbs.astro` is wired up in `main-layout.astro` and is rebuilt in Task 21) — all in the cleanup task (Task 66).

**Unchanged:** all `src/content/**`, `src/lib/chat/`, `src/lib/portfolio-knowledge.ts`, `netlify/functions/`, `src/pages/api/`, `src/pages/llms.txt.ts`, `src/lib/animations.ts` (extended, not replaced — same exported function names), `src/lib/icons.ts`, `src/lib/cn.ts`, `src/utils/*`, `src/config/*`, `src/pages/blog/[post].astro`, `src/pages/projects/[project].astro` (both just call into rewritten templates, no change needed to the route files themselves).

---

## Design tokens reference (used throughout every task below)

Tailwind v4 auto-generates utilities from `@theme` keys. This plan relies on:

- Colors → `bg-ink`, `text-ink`, `border-ink`, `bg-asphalt`, `bg-seam`/`border-seam`, `bg-concrete`, `bg-concrete-2`, `bg-paper`, `text-steel`, `text-graphite`, `bg-signal`/`text-signal`/`border-signal`, `bg-signal-deep`/`text-signal-deep`, `bg-amber`/`text-amber`.
- Fonts → `font-display` (Archivo Black), `font-mono` (IBM Plex Mono), `font-sans` (system grotesk body).
- Shadows → `shadow-hard` (5px 5px 0 ink), `shadow-hard-sm` (3px 3px 0 ink). Hover/press states that need a different offset use one-off arbitrary values, e.g. `hover:shadow-[7px_7px_0_var(--color-ink)]`, `active:shadow-[1px_1px_0_var(--color-ink)]`.
- Radius → Tailwind's built-in `rounded-xs` (2px), `rounded-sm` (4px), `rounded-md` (6px) already equal the reference's r-1/r-2/r-3 — no custom radius tokens needed.
- Border width → Tailwind's built-in `border-2` already equals the reference's 2px `--bw` — no custom token needed.
- Spacing → Tailwind's built-in numeric spacing scale already lines up with the reference's 4px-based `--s-*` scale (`s-3`=`3`=12px, `s-5`=`6`=24px, `s-6`=`8`=32px, `s-7`=`12`=48px, `s-8`=`18`=72px, `s-9`=`28`=112px) — no custom spacing tokens needed.
- Hover lift → `hover:-translate-x-0.5 hover:-translate-y-0.5` (2px, matches reference `translate(-2px,-2px)`); press → `active:translate-x-0.5 active:translate-y-0.5`.
- Focus ring → global base-layer rule in `global.css`, not a utility (see Task 1).

---

## Phase 0: Foundation (fonts, tokens, docs)

### Task 1: Install fonts and rewrite design tokens

**Files:**
- Modify: `package.json`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Install self-hosted font packages**

Run: `pnpm add @fontsource/archivo-black @fontsource/ibm-plex-mono`

Expected: `package.json` `dependencies` gains both entries; `pnpm-lock.yaml` updates.

- [ ] **Step 2: Rewrite `src/styles/global.css`**

Replace the entire file contents with:

```css
@import 'tailwindcss';
@import '@fontsource/archivo-black';
@import '@fontsource/ibm-plex-mono/400.css';
@import '@fontsource/ibm-plex-mono/700.css';

/**
 * Industrial Grotesk design tokens.
 * Hard-edged, high-contrast system: OKLCH ink/concrete/signal palette,
 * Archivo Black + IBM Plex Mono type, hard offset shadows (no blur).
 */
@theme {
  --color-ink: oklch(16% 0.012 250);
  --color-asphalt: oklch(21% 0.014 250);
  --color-seam: oklch(32% 0.014 250);
  --color-concrete: oklch(93% 0.005 250);
  --color-concrete-2: oklch(88% 0.007 250);
  --color-paper: oklch(98% 0.002 250);
  --color-steel: oklch(62% 0.016 250);
  --color-graphite: oklch(38% 0.014 250);
  --color-signal: oklch(87% 0.23 135);
  --color-signal-deep: oklch(52% 0.16 140);
  --color-amber: oklch(80% 0.16 75);

  --font-display: 'Archivo Black', 'Helvetica Neue', 'Arial Black', Arial, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  --font-sans: 'Helvetica Neue', Helvetica, Arial, sans-serif;

  --shadow-hard: 5px 5px 0 0 var(--color-ink);
  --shadow-hard-sm: 3px 3px 0 0 var(--color-ink);
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-concrete text-ink font-sans antialiased;
  }

  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  select:focus-visible,
  summary:focus-visible {
    outline: 3px solid var(--color-signal);
    outline-offset: 2px;
  }

  [id] {
    scroll-margin-top: 5rem;
  }

  a:not([disabled]),
  button:not([disabled]) {
    @apply cursor-pointer;
  }
}

@layer components {
  .section-py {
    @apply py-12 md:py-18;
  }

  .container {
    @apply mx-auto w-full max-w-[1220px] px-6;
  }

  /* Prose used by blog/project body content */
  .typography {
    @apply text-ink;

    h1 {
      @apply font-display mt-8 mb-6 border-b-2 border-ink pb-2 text-3xl uppercase md:text-4xl;
    }
    h2 {
      @apply font-display mt-8 mb-4 text-2xl uppercase md:text-3xl;
    }
    h3 {
      @apply font-display mt-6 mb-3 text-xl uppercase md:text-2xl;
    }
    p {
      @apply text-graphite mb-4 leading-relaxed;
    }
    a {
      @apply text-signal-deep font-semibold underline decoration-2 underline-offset-2;
    }
    strong {
      @apply text-ink font-bold;
    }
    ul {
      @apply mb-4 list-disc pl-6;
    }
    ol {
      @apply mb-4 list-decimal pl-6;
    }
    li {
      @apply text-graphite mb-2;
    }
    blockquote {
      @apply bg-concrete-2 border-signal-deep text-graphite my-6 rounded-sm border-l-4 p-4 italic;
    }
    table {
      @apply my-6 w-full border-2 border-ink;
    }
    th {
      @apply bg-concrete-2 border-2 border-ink p-3 text-left text-sm font-bold uppercase;
    }
    td {
      @apply text-graphite border-2 border-ink p-3;
    }
    hr {
      @apply my-8 h-3 border-0;
      background: repeating-linear-gradient(-45deg, var(--color-signal) 0 10px, var(--color-ink) 10px 20px);
    }
    code {
      @apply bg-concrete-2 border-ink font-mono rounded-xs border-2 px-2 py-0.5 text-sm;
    }
    pre {
      @apply bg-ink border-ink text-concrete font-mono shadow-hard my-6 overflow-x-auto rounded-sm border-2 p-4 text-sm;

      code {
        @apply border-0 bg-transparent p-0;
      }
    }
    img {
      @apply border-ink shadow-hard my-6 rounded-sm border-2;
    }
  }
}
```

- [ ] **Step 3: Verify the build picks up the new tokens**

Run: `pnpm exec astro check && pnpm build`
Expected: both complete with no errors (component files still reference old classes at this point, so visual output is broken until later tasks — this step only confirms the token file itself is valid CSS/Tailwind).

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/styles/global.css
git commit -m "feat(design): replace Tactile Maximalism tokens with Industrial Grotesk palette"
```

### Task 2: Docs cleanup — delete stale plans, update design-trend paragraph

**Files:**
- Delete: `ARCHITECTURE-PLAN.md`
- Delete: `IMPLEMENTATION-PLAN.md`
- Modify: `CLAUDE.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Delete the two stale planning docs**

Run: `git rm ARCHITECTURE-PLAN.md IMPLEMENTATION-PLAN.md`

- [ ] **Step 2: Update the design-trend paragraph in `CLAUDE.md`**

Find this line under `## Forntend Framework Rules`:

```
- Our frontend Design trend is Tactile Maximalism. Please follow the design trend when creating new components or refactoring existing components.
```

Replace with:

```
- Our frontend design trend is Industrial Grotesk: hard-edged neo-brutalist system with an OKLCH ink/concrete/signal-green palette, Archivo Black + IBM Plex Mono type pairing, 2px ink borders, hard offset shadows (no blur), and a fixed alternating dark/light section rhythm (no theme toggle). Please follow the design trend when creating new components or refactoring existing components.
```

- [ ] **Step 3: Apply the identical change to the matching paragraph in `AGENTS.md`**

Same find/replace as Step 2, applied to `AGENTS.md`.

- [ ] **Step 4: Commit**

```bash
git add ARCHITECTURE-PLAN.md IMPLEMENTATION-PLAN.md CLAUDE.md AGENTS.md
git commit -m "docs: replace Tactile Maximalism references with Industrial Grotesk design trend"
```

---

## Phase 1: Atoms

### Task 3: Rewrite `Icon.astro`

**Files:**
- Modify: `src/components/atoms/Icon.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { IconType } from '@/lib/icons';

interface Props {
  /** react-icons component to render */
  icon: IconType;
  /** Size in the type scale */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  /** Token color to apply */
  color?: 'ink' | 'graphite' | 'steel' | 'signal' | 'signal-deep';
  class?: string;
}

const { icon: IconComponent, size = 'base', color = 'ink', class: className = '' } = Astro.props;

const sizeClasses: Record<string, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  base: 'w-5 h-5',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses: Record<string, string> = {
  ink: 'text-ink',
  graphite: 'text-graphite',
  steel: 'text-steel',
  signal: 'text-signal',
  'signal-deep': 'text-signal-deep',
};
---

<IconComponent className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`} />
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`
Expected: no new errors attributable to `Icon.astro`.

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Icon.astro
git commit -m "feat(atoms): restyle Icon for Industrial Grotesk tokens"
```

### Task 4: Rewrite `Button.astro`

**Files:**
- Modify: `src/components/atoms/Button.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { IconType } from '@/lib/icons';

type ButtonVariant = 'primary' | 'secondary' | 'ink' | 'ghost-ink';
type ButtonSize = 'sm' | 'base' | 'lg' | 'xl';

interface Props {
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  external?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  class?: string;
}

const {
  href,
  type = 'button',
  variant = 'primary',
  size = 'base',
  icon: IconComponent,
  iconPosition = 'left',
  external = false,
  fullWidth = false,
  disabled = false,
  class: className = '',
} = Astro.props;

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  base: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
  xl: 'px-10 py-4 text-base',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-signal text-ink border-2 border-signal shadow-hard-sm hover:shadow-[7px_7px_0_var(--color-ink)] active:shadow-[1px_1px_0_var(--color-ink)] active:translate-x-0.5 active:translate-y-0.5',
  secondary: 'bg-transparent text-signal border-2 border-signal hover:bg-asphalt',
  ink: 'bg-ink text-signal border-2 border-ink shadow-hard-sm hover:shadow-[5px_5px_0_var(--color-ink)] active:shadow-[1px_1px_0_var(--color-ink)] active:translate-x-0.5 active:translate-y-0.5',
  'ghost-ink': 'bg-transparent text-ink border-2 border-ink hover:bg-concrete-2',
};

const classes = `inline-flex items-center justify-center gap-2 font-mono font-bold uppercase tracking-wider rounded-sm transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`;

const Tag = href ? 'a' : 'button';
const linkProps = href
  ? { href, ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
  : { type, disabled };
---

<Tag class={classes} {...linkProps}>
  {IconComponent && iconPosition === 'left' && <IconComponent className="h-4 w-4" />}
  <slot />
  {IconComponent && iconPosition === 'right' && <IconComponent className="h-4 w-4" />}
</Tag>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`
Expected: no new errors. The old codebase passed `Button` a `variant="outline"` in a few places (contact.astro, blog/tag/[tag].astro, templates) — `astro check` won't catch that string-literal mismatch against the new `ButtonVariant` union (Astro doesn't fail the build on an unmatched variant key, it just falls through `variantClasses[variant]` as `undefined`), so every later task in this plan that rewrites one of those files replaces `variant="outline"` with `variant="ghost-ink"` as part of its own rewrite (Tasks 49-53, 56). Confirm no stray one is left once every page in this plan has been rewritten:

Run: `grep -rn 'Button.*variant="outline"' src/ --include="*.astro"`
Expected (only after Task 67, not immediately after this task): no matches. Right after this task, every pre-existing page still using the old `HeroSection`/`Button` props will fail `astro check` until its own later task rewrites it — that's expected per Task 30's note.

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Button.astro
git commit -m "feat(atoms): rebuild Button with Industrial Grotesk variants (primary/secondary/ink/ghost-ink)"
```

### Task 5: Rewrite `Badge.astro` (also covers `Tag.astro` — see Task 6 for the merge)

**Files:**
- Modify: `src/components/atoms/Badge.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
type BadgeVariant = 'default' | 'phase' | 'outline' | 'stamp-done' | 'stamp-pending' | 'stamp-review';

interface Props {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'base';
  class?: string;
}

const { label, variant = 'default', size = 'base', class: className = '' } = Astro.props;

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  base: 'px-2.5 py-1 text-xs',
};

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-paper text-ink border-2 border-ink',
  phase: 'bg-signal text-ink border-2 border-ink',
  outline: 'bg-transparent text-ink border-2 border-ink',
  'stamp-done': 'bg-signal text-ink border-2 border-ink',
  'stamp-pending': 'bg-paper text-ink border-2 border-dashed border-ink',
  'stamp-review': 'bg-amber text-ink border-2 border-ink',
};
---

<span class={`inline-flex items-center whitespace-nowrap rounded-xs font-mono font-bold tracking-wider uppercase ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
  {label}
</span>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Badge.astro
git commit -m "feat(atoms): rebuild Badge with phase/stamp variants for Industrial Grotesk"
```

### Task 6: Delete `Tag.astro` (superseded by `Badge.astro`)

**Files:**
- Delete: `src/components/atoms/Tag.astro`
- Modify: `src/components/atoms/index.ts`

- [ ] **Step 1: Confirm nothing outside this plan's scope still imports it**

Run: `grep -rln "atoms/Tag" src/ --include="*.astro" --include="*.tsx"`
Expected: no results (the old `Tag.astro` was never imported anywhere in the codebase we read — `TagList.astro`, which renders technology chips, is a separate molecule rebuilt in Task 13 and does not use this atom).

- [ ] **Step 2: Delete the file**

Run: `git rm src/components/atoms/Tag.astro`

- [ ] **Step 3: Remove its export from the barrel file**

Read `src/components/atoms/index.ts`, remove the line exporting `Tag`, keep the rest.

- [ ] **Step 4: Commit**

```bash
git add src/components/atoms/index.ts
git commit -m "chore: remove Tag.astro, superseded by Badge.astro phase/stamp variants"
```

### Task 7: Rewrite `Divider.astro`

**Files:**
- Modify: `src/components/atoms/Divider.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
type DividerVariant = 'line' | 'tape';

interface Props {
  variant?: DividerVariant;
  class?: string;
}

const { variant = 'line', class: className = '' } = Astro.props;
---

{variant === 'line' && <hr class={`border-t-2 border-seam ${className}`} />}

{variant === 'tape' && (
  <div
    role="presentation"
    class={`h-3.5 border-y-2 border-ink ${className}`}
    style="background: repeating-linear-gradient(-45deg, var(--color-signal) 0 14px, var(--color-ink) 14px 28px);"
  />
)}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Divider.astro
git commit -m "feat(atoms): rebuild Divider with hazard-tape variant"
```

### Task 8: Rewrite `Heading.astro`

**Files:**
- Modify: `src/components/atoms/Heading.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
type HeadingSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl' | 'hero';

interface Props {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: HeadingSize;
  class?: string;
}

const { level, size = 'base', class: className = '' } = Astro.props;

const sizeClasses: Record<HeadingSize, string> = {
  sm: 'text-lg',
  base: 'text-xl md:text-2xl',
  lg: 'text-2xl md:text-3xl',
  xl: 'text-3xl md:text-4xl',
  '2xl': 'text-4xl md:text-5xl',
  hero: 'text-[clamp(2.4rem,5.6vw,4.5rem)] leading-[0.98]',
};

const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
---

<Tag class={`font-display font-black tracking-tight uppercase ${sizeClasses[size]} ${className}`}>
  <slot />
</Tag>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Heading.astro
git commit -m "feat(atoms): rebuild Heading with Archivo Black display sizes"
```

### Task 9: Rewrite `Text.astro`

**Files:**
- Modify: `src/components/atoms/Text.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
type TextTag = 'p' | 'span' | 'div' | 'label' | 'time';
type TextColor = 'ink' | 'graphite' | 'steel' | 'signal' | 'signal-deep';

interface Props {
  as?: TextTag;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: TextColor;
  balance?: boolean;
  class?: string;
}

const {
  as: Tag = 'p',
  size = 'base',
  weight = 'normal',
  color = 'graphite',
  balance = false,
  class: className = '',
} = Astro.props;

const sizeClasses: Record<string, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const weightClasses: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const colorClasses: Record<TextColor, string> = {
  ink: 'text-ink',
  graphite: 'text-graphite',
  steel: 'text-steel',
  signal: 'text-signal',
  'signal-deep': 'text-signal-deep',
};
---

<Tag class={`${sizeClasses[size]} ${weightClasses[weight]} ${colorClasses[color]} ${balance ? 'text-balance' : ''} ${className}`}>
  <slot />
</Tag>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Text.astro
git commit -m "feat(atoms): restyle Text for Industrial Grotesk color tokens"
```

### Task 10: Rewrite `Link.astro`

**Files:**
- Modify: `src/components/atoms/Link.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import { FaArrowRight } from '@/lib/icons';

type LinkVariant = 'signal' | 'muted' | 'ink';

interface Props {
  href: string;
  variant?: LinkVariant;
  size?: 'sm' | 'base';
  showArrow?: boolean;
  external?: boolean;
  class?: string;
}

const {
  href,
  variant = 'signal',
  size = 'base',
  showArrow = false,
  external = false,
  class: className = '',
} = Astro.props;

const variantClasses: Record<LinkVariant, string> = {
  signal: 'text-signal-deep hover:text-ink',
  muted: 'text-graphite hover:text-ink',
  ink: 'text-ink hover:text-signal-deep',
};

const sizeClasses: Record<string, string> = {
  sm: 'text-sm',
  base: 'text-base',
};
---

<a
  href={href}
  class={`inline-flex items-center gap-1.5 font-mono font-bold tracking-wide uppercase underline decoration-2 underline-offset-2 transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
  {...external ? { target: '_blank', rel: 'noopener noreferrer' } : {}}
>
  <slot />
  {showArrow && <FaArrowRight className="h-3 w-3" />}
</a>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Link.astro
git commit -m "feat(atoms): restyle Link as mono tracked underline link"
```

### Task 11: Rewrite `Avatar.astro`

**Files:**
- Modify: `src/components/atoms/Avatar.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { ImageMetadata } from 'astro';
import { Image } from 'astro:assets';

interface Props {
  src?: ImageMetadata | string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  class?: string;
}

const { src, alt = '', name = '', size = 'md', class: className = '' } = Astro.props;

const sizeClasses: Record<string, string> = {
  sm: 'h-10 w-10 text-sm',
  md: 'h-16 w-16 text-lg',
  lg: 'h-24 w-24 text-2xl',
  xl: 'h-32 w-32 text-3xl',
};

const initials = name
  .split(' ')
  .map(part => part[0])
  .slice(0, 2)
  .join('')
  .toUpperCase();
---

<div class={`shadow-hard-sm inline-flex items-center justify-center overflow-hidden rounded-sm border-2 border-ink bg-signal font-display font-black text-ink ${sizeClasses[size]} ${className}`}>
  {src ? (
    typeof src === 'string' ? (
      <img src={src} alt={alt} class="h-full w-full object-cover" loading="lazy" />
    ) : (
      <Image src={src} alt={alt} class="h-full w-full object-cover" loading="lazy" width={256} height={256} />
    )
  ) : (
    <span>{initials}</span>
  )}
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Avatar.astro
git commit -m "feat(atoms): restyle Avatar with hard-shadow signal frame"
```

### Task 12: Rewrite `Skeleton.astro`

**Files:**
- Modify: `src/components/atoms/Skeleton.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
interface Props {
  width?: string;
  height?: string;
  class?: string;
}

const { width = '100%', height = '1rem', class: className = '' } = Astro.props;
---

<div
  class={`animate-pulse rounded-xs border-2 border-seam bg-concrete-2 ${className}`}
  style={`width: ${width}; height: ${height};`}
  aria-hidden="true"
/>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Skeleton.astro
git commit -m "feat(atoms): restyle Skeleton loading placeholder"
```

---

## Phase 2: Molecules

### Task 13: Rewrite `Card.astro`

**Files:**
- Modify: `src/components/molecules/Card.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
type CardVariant = 'light' | 'dark';
type CardPadding = 'none' | 'sm' | 'base' | 'lg';

interface Props {
  variant?: CardVariant;
  padding?: CardPadding;
  href?: string;
  hoverable?: boolean;
  class?: string;
}

const { variant = 'light', padding = 'base', href, hoverable = true, class: className = '' } = Astro.props;

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  base: 'p-6',
  lg: 'p-8',
};

const variantClasses: Record<CardVariant, string> = {
  light: 'bg-paper border-ink text-ink',
  dark: 'bg-ink border-ink text-concrete',
};

const hoverClasses = hoverable
  ? 'transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--color-ink)]'
  : '';

const classes = `flex flex-col gap-3 rounded-md border-2 shadow-hard ${paddingClasses[padding]} ${variantClasses[variant]} ${hoverClasses} ${className}`;

const Tag = href ? 'a' : 'div';
---

<Tag class={classes} {...(href ? { href } : {})}>
  <slot />
</Tag>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/Card.astro
git commit -m "feat(molecules): rebuild Card with hard-shadow light/dark variants"
```

### Task 14: Rewrite `SectionHeader.astro`

**Files:**
- Modify: `src/components/molecules/SectionHeader.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
type Tone = 'light' | 'dark';

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: Tone;
  class?: string;
}

const { eyebrow, title, description, align = 'left', tone = 'light', class: className = '' } = Astro.props;

const eyebrowColor = tone === 'dark' ? 'text-signal' : 'text-signal-deep';
const titleColor = tone === 'dark' ? 'text-concrete' : 'text-ink';
const descColor = tone === 'dark' ? 'text-steel' : 'text-graphite';
const alignClasses = align === 'center' ? 'text-center mx-auto' : 'text-left';
---

<div class={`max-w-2xl ${alignClasses} ${className}`}>
  {eyebrow && (
    <span class={`mb-3 block font-mono text-xs font-bold tracking-[0.18em] uppercase ${eyebrowColor}`}>
      {eyebrow}
    </span>
  )}
  <h2 class={`font-display text-[clamp(28px,3.8vw,46px)] leading-[1.02] font-black tracking-tight uppercase ${titleColor}`}>
    {title}
  </h2>
  {description && (
    <p class={`mt-4 text-base leading-relaxed md:text-lg ${descColor}`}>
      {description}
    </p>
  )}
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/SectionHeader.astro
git commit -m "feat(molecules): rebuild SectionHeader with mono eyebrow + display heading"
```

### Task 15: Rewrite `StatItem.astro`

**Files:**
- Modify: `src/components/molecules/StatItem.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
type Tone = 'light' | 'dark';

interface Props {
  value: string | number;
  suffix?: string;
  label: string;
  tone?: Tone;
  class?: string;
}

const { value, suffix = '', label, tone = 'dark', class: className = '' } = Astro.props;

const valueColor = tone === 'dark' ? 'text-signal' : 'text-signal-deep';
const labelColor = tone === 'dark' ? 'text-steel' : 'text-graphite';
const cellBg = tone === 'dark' ? 'bg-asphalt border-seam' : 'bg-paper border-ink';
---

<div class={`rounded-xs border px-3 py-2 ${cellBg} ${className}`}>
  <div class={`font-display text-2xl leading-none font-black tabular-nums ${valueColor}`}>
    {value}{suffix}
  </div>
  <div class={`mt-1 font-mono text-[10px] tracking-[0.12em] uppercase ${labelColor}`}>
    {label}
  </div>
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/StatItem.astro
git commit -m "feat(molecules): rebuild StatItem for bento stat-board use"
```

### Task 16: Rewrite `TagList.astro`

**Files:**
- Modify: `src/components/molecules/TagList.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import Badge from '@/components/atoms/Badge.astro';
import type { TechMap } from '@/utils/tech-lookup';
import { getTechName } from '@/utils/tech-lookup';

interface Props {
  tags: string[];
  techMap: TechMap;
  limit?: number;
  size?: 'sm' | 'base';
  linkToTagPage?: boolean;
  class?: string;
}

const { tags, techMap, limit, size = 'base', linkToTagPage = false, class: className = '' } = Astro.props;

const visibleTags = limit ? tags.slice(0, limit) : tags;
const remaining = limit && tags.length > limit ? tags.length - limit : 0;
---

<div class={`flex flex-wrap gap-2 ${className}`}>
  {visibleTags.map(tag =>
    linkToTagPage ? (
      <a href={`/blog/tag/${tag}`}>
        <Badge label={getTechName(tag, techMap)} variant="outline" size={size} />
      </a>
    ) : (
      <Badge label={getTechName(tag, techMap)} variant="outline" size={size} />
    ),
  )}
  {remaining > 0 && <Badge label={`+${remaining}`} variant="outline" size={size} />}
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/TagList.astro
git commit -m "feat(molecules): restyle TagList to render outline Badge chips"
```

### Task 17: Rewrite `SocialLink.astro`

**Files:**
- Modify: `src/components/molecules/SocialLink.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import { getSocialIcon } from '@/lib/icons';

type Tone = 'light' | 'dark';

interface Props {
  platform: string;
  url: string;
  ariaLabel?: string;
  label?: string;
  tone?: Tone;
  class?: string;
}

const { platform, url, ariaLabel, label, tone = 'dark', class: className = '' } = Astro.props;

const IconComponent = getSocialIcon(platform);
const colorClasses = tone === 'dark' ? 'text-steel hover:text-signal' : 'text-graphite hover:text-ink';
---

{IconComponent && (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    class={`inline-flex items-center justify-center rounded-xs p-2 transition-colors ${colorClasses} ${className}`}
    aria-label={ariaLabel || label || platform}
  >
    <IconComponent className="h-5 w-5" />
  </a>
)}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/SocialLink.astro
git commit -m "feat(molecules): restyle SocialLink icon button"
```

### Task 18: Rewrite `SocialLinks.astro`

**Files:**
- Modify: `src/components/molecules/SocialLinks.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import SocialLink from './SocialLink.astro';

type Tone = 'light' | 'dark';

interface SocialLinkData {
  platform: string;
  url: string;
  label?: string;
  ariaLabel?: string;
}

interface Props {
  links: SocialLinkData[];
  tone?: Tone;
  class?: string;
}

const { links, tone = 'dark', class: className = '' } = Astro.props;
---

<div class={`flex items-center gap-1 ${className}`}>
  {links.map(link => (
    <SocialLink platform={link.platform} url={link.url} label={link.label} ariaLabel={link.ariaLabel} tone={tone} />
  ))}
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/SocialLinks.astro
git commit -m "feat(molecules): restyle SocialLinks row"
```

### Task 19: Rewrite `FormField.astro`

**Files:**
- Modify: `src/components/molecules/FormField.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
type FieldType = 'text' | 'email' | 'textarea' | 'select';

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  name: string;
  type?: FieldType;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  options?: Option[];
  class?: string;
}

const {
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  rows = 5,
  options = [],
  class: className = '',
} = Astro.props;

const fieldClasses =
  'w-full rounded-sm border-2 border-ink bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-graphite focus:outline-none';
---

<div class={className}>
  <label for={name} class="mb-2 block font-mono text-xs font-bold tracking-[0.1em] text-ink uppercase">
    {label}
  </label>
  {type === 'textarea' ? (
    <textarea id={name} name={name} required={required} placeholder={placeholder} rows={rows} class={fieldClasses} />
  ) : type === 'select' ? (
    <select id={name} name={name} required={required} class={fieldClasses}>
      {options.map(opt => <option value={opt.value}>{opt.label}</option>)}
    </select>
  ) : (
    <input id={name} name={name} type={type} required={required} placeholder={placeholder} class={fieldClasses} />
  )}
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/FormField.astro
git commit -m "feat(molecules): rebuild FormField with hard-bordered inputs"
```

### Task 20: Rewrite `ListItem.astro`

**Files:**
- Modify: `src/components/molecules/ListItem.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import Icon from '@/components/atoms/Icon.astro';
import { getCategoryIcon } from '@/lib/icons';

type Tone = 'light' | 'dark';

interface Props {
  icon?: string;
  size?: 'sm' | 'base';
  tone?: Tone;
  class?: string;
}

const { icon = 'check', size = 'base', tone = 'light', class: className = '' } = Astro.props;

const IconComponent = getCategoryIcon(icon);
const textColor = tone === 'dark' ? 'text-steel' : 'text-graphite';
const textSize = size === 'sm' ? 'text-sm' : 'text-base';
---

<li class={`flex items-start gap-2.5 ${textColor} ${textSize} ${className}`}>
  {IconComponent && <Icon icon={IconComponent} size="sm" color="signal-deep" class="mt-0.5 flex-shrink-0" />}
  <span><slot /></span>
</li>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/ListItem.astro
git commit -m "feat(molecules): restyle ListItem with signal check icon"
```

### Task 21: Rewrite `Breadcrumbs.astro`

**Files:**
- Modify: `src/components/molecules/Breadcrumbs.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { BreadcrumbItem } from '@/utils/breadcrumbs';

interface Props {
  items: BreadcrumbItem[];
  class?: string;
}

const { items, class: className = '' } = Astro.props;

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: new URL(item.href, Astro.site).href,
  })),
};
---

{items.length > 0 && (
  <>
    <script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
    <nav class={`pt-6 pb-2 ${className}`} aria-label="Breadcrumb">
      <ol class="flex flex-wrap items-center gap-2 font-mono text-xs tracking-[0.1em] uppercase">
        {items.map((item, index) => (
          <li class="flex items-center gap-2">
            <a
              href={item.href}
              class={index === items.length - 1 ? 'pointer-events-none font-bold text-ink' : 'text-graphite hover:text-signal-deep'}
            >
              {item.label}
            </a>
            {index < items.length - 1 && <span class="text-graphite" aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  </>
)}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/Breadcrumbs.astro
git commit -m "feat(molecules): restyle Breadcrumbs as mono tracked trail"
```

### Task 22: Rewrite `InfoBox.astro`

**Files:**
- Modify: `src/components/molecules/InfoBox.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
type Variant = 'paper' | 'muted';

interface Props {
  title?: string;
  variant?: Variant;
  class?: string;
}

const { title, variant = 'paper', class: className = '' } = Astro.props;

const variantClasses: Record<Variant, string> = {
  paper: 'bg-paper border-ink shadow-hard-sm',
  muted: 'bg-concrete-2 border-ink',
};
---

<div class={`rounded-md border-2 p-6 ${variantClasses[variant]} ${className}`}>
  {title && (
    <h3 class="font-display mb-4 text-lg font-black tracking-tight text-ink uppercase">
      {title}
    </h3>
  )}
  <slot />
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/InfoBox.astro
git commit -m "feat(molecules): restyle InfoBox with hard-bordered paper/muted variants"
```

### Task 23: Rewrite `AuthorBio.astro`

**Files:**
- Modify: `src/components/molecules/AuthorBio.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import Avatar from '@/components/atoms/Avatar.astro';
import Button from '@/components/atoms/Button.astro';
import settings from '@/content/site/settings.json';

interface Props {
  variant?: 'default' | 'compact';
  class?: string;
}

const { variant = 'default', class: className = '' } = Astro.props;
const { author } = settings;
const isCompact = variant === 'compact';
---

<aside class={`rounded-md border-2 border-ink bg-paper p-6 ${isCompact ? 'flex items-center gap-4' : ''} ${className}`}>
  {isCompact ? (
    <>
      <Avatar name={author.name} size="sm" class="flex-shrink-0" />
      <div class="min-w-0 flex-1">
        <p class="truncate font-bold text-ink">{author.name}</p>
        <p class="text-graphite text-sm">{author.jobTitle}</p>
      </div>
      <Button href="/hire" variant="ghost-ink" size="sm">Hire Me</Button>
    </>
  ) : (
    <div class="flex flex-col gap-6 sm:flex-row">
      <Avatar name={author.name} size="lg" class="mx-auto flex-shrink-0 sm:mx-0" />
      <div class="flex-1 text-center sm:text-left">
        <p class="text-lg font-bold text-ink">{author.name}</p>
        <p class="text-graphite mb-3 text-sm">{author.jobTitle} based in {author.location}</p>
        <p class="text-graphite mb-4 text-sm">{author.bio}</p>
        <div class="flex flex-wrap justify-center gap-3 sm:justify-start">
          <Button href="/hire" variant="primary" size="sm">Work With Me</Button>
          <Button href="/contact" variant="ghost-ink" size="sm">Get in Touch</Button>
        </div>
      </div>
    </div>
  )}
</aside>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/AuthorBio.astro
git commit -m "feat(molecules): restyle AuthorBio card"
```

### Task 24: Rewrite `RelatedPosts.astro`

**Files:**
- Modify: `src/components/molecules/RelatedPosts.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formatDate } from '@/utils/date-format';

interface Props {
  currentSlug: string;
  currentTags: string[];
  posts: CollectionEntry<'blog'>[];
  maxPosts?: number;
  class?: string;
}

const { currentSlug, currentTags = [], posts, maxPosts = 3, class: className = '' } = Astro.props;

const currentDate = new Date();
const relatedPosts = posts
  .filter(post => post.data.slug !== currentSlug)
  .filter(post => post.data.publishDate !== null)
  .filter(post => post.data.publishDate! <= currentDate)
  .map(post => {
    const postTags = post.data.tags || [];
    const sharedTags = postTags.filter(tag => currentTags.includes(tag));
    return { post, score: sharedTags.length };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => (b.score !== a.score ? b.score - a.score : b.post.data.publishDate!.getTime() - a.post.data.publishDate!.getTime()))
  .slice(0, maxPosts)
  .map(item => item.post);

if (relatedPosts.length === 0) {
  return null;
}
---

<aside class={`border-t-2 border-seam pt-8 ${className}`}>
  <h2 class="font-display mb-6 text-xl font-black tracking-tight text-ink uppercase">Related Articles</h2>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {relatedPosts.map(post => (
      <a
        href={`/blog/${post.data.slug}`}
        class="group rounded-sm border-2 border-ink bg-paper p-4 shadow-hard-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)]"
      >
        <h3 class="mb-2 line-clamp-2 font-bold text-ink">{post.data.title}</h3>
        {post.data.description && <p class="text-graphite mb-3 line-clamp-2 text-sm">{post.data.description}</p>}
        <time class="text-graphite font-mono text-xs uppercase">{formatDate(post.data.publishDate!, 'short')}</time>
      </a>
    ))}
  </div>
</aside>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/RelatedPosts.astro
git commit -m "feat(molecules): restyle RelatedPosts card grid"
```

### Task 25: Rewrite `HireNavigationTabs.astro`

**Files:**
- Modify: `src/components/molecules/HireNavigationTabs.astro`

- [ ] **Step 1: Replace file contents**

The current file links to a nonexistent `/hire/jamstack` route (no such page exists — only `/hire`, `/hire/react-developer`, `/hire/nextjs-developer`, `/hire/headless-cms` do). Fix this while restyling:

```astro
---
interface Tab {
  label: string;
  href: string;
}

interface Props {
  currentPath: string;
  class?: string;
}

const tabs: Tab[] = [
  { label: 'Overview', href: '/hire' },
  { label: 'React', href: '/hire/react-developer' },
  { label: 'Next.js', href: '/hire/nextjs-developer' },
  { label: 'Headless CMS', href: '/hire/headless-cms' },
];

const { currentPath, class: className = '' } = Astro.props;
---

<div class={`mb-12 flex flex-wrap justify-center gap-2 ${className}`}>
  {tabs.map(tab => {
    const isActive = currentPath === tab.href;
    return (
      <a
        href={tab.href}
        class={`rounded-sm border-2 border-ink px-4 py-2 font-mono text-xs font-bold tracking-wide uppercase ${
          isActive ? 'bg-signal text-ink shadow-hard-sm' : 'bg-paper text-ink hover:bg-concrete-2'
        }`}
      >
        {tab.label}
      </a>
    );
  })}
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/molecules/HireNavigationTabs.astro
git commit -m "fix(molecules): restyle HireNavigationTabs and correct route hrefs"
```

---

## Phase 3: Navigation, decorative organisms, layout wiring

### Task 26: Rewrite `Header.astro` (drop theme toggle)

**Files:**
- Modify: `src/components/organisms/navigation/Header.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import { getNavIcon } from '@/lib/icons';
import Button from '@/components/atoms/Button.astro';
import navigation from '@/content/site/navigation.json';

const { brandText, navItems } = navigation;
---

<header class="sticky top-0 z-50 border-b-2 border-signal bg-ink">
  <div class="container flex items-center justify-between gap-4 py-3">
    <a href="/" class="font-display flex items-center gap-2 text-lg font-black tracking-tight text-concrete uppercase">
      <span class="flex h-7 w-7 items-center justify-center rounded-xs bg-signal font-mono text-xs font-bold text-ink">AM</span>
      {brandText}
    </a>

    <nav class="hidden items-center gap-5 lg:flex" aria-label="Main">
      {navItems.map(item => {
        const Icon = getNavIcon(item.icon || '');
        return (
          <a
            href={item.href}
            class="flex items-center gap-2 border-b-2 border-transparent py-1 font-mono text-xs font-bold tracking-[0.14em] text-concrete uppercase hover:border-signal hover:text-signal"
          >
            {Icon ? <Icon className="h-3.5 w-3.5" /> : null} {item.label}
          </a>
        );
      })}
    </nav>

    <div class="hidden items-center gap-3 lg:flex">
      <Button href="/projects" variant="secondary" size="sm">Projects</Button>
      <Button href="/contact" variant="primary" size="sm">Get in Touch</Button>
    </div>

    <button
      type="button"
      data-mobile-menu-toggle
      class="rounded-xs p-2 text-concrete hover:bg-asphalt lg:hidden"
      aria-label="Toggle menu"
      aria-expanded="false"
      aria-controls="mobile-menu"
    >
      <span class="block h-0.5 w-5 bg-concrete"></span>
      <span class="mt-1 block h-0.5 w-5 bg-concrete"></span>
      <span class="mt-1 block h-0.5 w-5 bg-concrete"></span>
    </button>
  </div>

  <nav id="mobile-menu" class="hidden border-t-2 border-seam lg:hidden" aria-label="Mobile">
    <div class="space-y-1 px-4 py-3">
      {navItems.map(item => (
        <a href={item.href} class="block rounded-xs px-3 py-2 font-mono text-sm font-bold tracking-wide text-concrete uppercase hover:bg-asphalt hover:text-signal">
          {item.label}
        </a>
      ))}
      <div class="pt-2">
        <Button href="/contact" variant="primary" size="sm" fullWidth>Get in Touch</Button>
      </div>
    </div>
  </nav>
</header>

<script>
  const toggle = document.querySelector('[data-mobile-menu-toggle]');
  const menu = document.getElementById('mobile-menu');

  toggle?.addEventListener('click', () => {
    const isHidden = menu?.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!isHidden));
  });

  menu?.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', () => menu.classList.add('hidden'));
  });
</script>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`
Expected: no errors. The old `FaSun`/`FaMoon`/`FaDesktop`/`FaBars` imports and `data-theme-toggle`/theme localStorage logic are gone entirely — confirm with:

Run: `grep -n "theme" src/components/organisms/navigation/Header.astro`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/navigation/Header.astro
git commit -m "feat(nav): rebuild Header as dark sticky topbar, drop theme toggle"
```

### Task 27: Rewrite `Footer.astro`

**Files:**
- Modify: `src/components/organisms/navigation/Footer.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import SocialLinks from '@/components/molecules/SocialLinks.astro';
import navigation from '@/content/site/navigation.json';
import footer from '@/content/site/footer.json';
import settings from '@/content/site/settings.json';
import profile from '@/content/profile/profile.json';

const hireLinks = [
  { label: 'Overview', href: '/hire' },
  { label: 'React Developer', href: '/hire/react-developer' },
  { label: 'Next.js Developer', href: '/hire/nextjs-developer' },
  { label: 'Headless CMS', href: '/hire/headless-cms' },
];
---

<footer class="border-t-2 border-signal bg-ink text-steel">
  <div class="container py-12">
    <div class="grid grid-cols-1 gap-8 border-b border-seam pb-8 md:grid-cols-4">
      <div class="md:col-span-2">
        <a href="/" class="font-display flex items-center gap-2 text-lg font-black tracking-tight text-concrete uppercase">
          <span class="flex h-7 w-7 items-center justify-center rounded-xs bg-signal font-mono text-xs font-bold text-ink">AM</span>
          {navigation.brandText}
        </a>
        <p class="mt-3 max-w-[36ch] text-sm leading-relaxed">{profile.summary}</p>
        <a href={`mailto:${settings.contact.email}`} class="mt-3 inline-block font-mono text-xs text-signal hover:underline">
          {settings.contact.email}
        </a>
      </div>

      <div>
        <h3 class="mb-3 font-mono text-xs font-bold tracking-[0.16em] text-concrete uppercase">Site</h3>
        <ul class="space-y-2">
          {navigation.navItems.map(item => (
            <li><a href={item.href} class="text-sm text-steel hover:text-signal">{item.label}</a></li>
          ))}
        </ul>
      </div>

      <div>
        <h3 class="mb-3 font-mono text-xs font-bold tracking-[0.16em] text-concrete uppercase">Hire Me</h3>
        <ul class="space-y-2">
          {hireLinks.map(link => (
            <li><a href={link.href} class="text-sm text-steel hover:text-signal">{link.label}</a></li>
          ))}
        </ul>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 pt-6 font-mono text-xs tracking-[0.08em] uppercase">
      <span>&copy; {new Date().getFullYear()} {footer.copyrightOwnerName} &middot; {footer.copyrightSuffix}</span>
      {footer.showSocialLinks && settings.author.socialLinks?.length ? (
        <SocialLinks links={settings.author.socialLinks} tone="dark" />
      ) : null}
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/navigation/Footer.astro
git commit -m "feat(nav): rebuild Footer with brand+columns grid"
```

### Task 28: Create `StencilGrid.astro` decorative overlay

**Files:**
- Create: `src/components/organisms/decorative/StencilGrid.astro`

- [ ] **Step 1: Write file**

```astro
---
/**
 * Faint stencil-grid background overlay, used behind dark hero/CTA sections.
 * Renders as an absolutely-positioned layer — the parent section must have
 * `class="relative overflow-hidden"` and place this component first so
 * content (with `relative z-10`) stacks above it.
 */
interface Props {
  class?: string;
}

const { class: className = '' } = Astro.props;
---

<div
  aria-hidden="true"
  class={`pointer-events-none absolute inset-0 opacity-[0.28] ${className}`}
  style="background-image: linear-gradient(var(--color-seam) 1px, transparent 1px), linear-gradient(90deg, var(--color-seam) 1px, transparent 1px); background-size: 72px 72px;"
/>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/decorative/StencilGrid.astro
git commit -m "feat(decorative): add StencilGrid background overlay for dark sections"
```

### Task 29: Update `main-layout.astro` — drop theme script, wire new Breadcrumbs

**Files:**
- Modify: `src/layouts/main-layout.astro`

- [ ] **Step 1: Remove the inline theme-init script**

Delete this block (currently right before `<!-- Title -->`):

```astro
    <!-- Theme -->
    <script is:inline>
      (function () {
        const savedTheme = localStorage.getItem('theme') || 'system';
        let themeToApply;

        if (savedTheme === 'system') {
          themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } else {
          themeToApply = savedTheme;
        }

        document.documentElement.setAttribute('data-theme', themeToApply);
      })();
    </script>
```

- [ ] **Step 2: Update the `<body>` class and confirm `Breadcrumbs` wiring is unchanged**

Replace:

```astro
  <body class="bg-background text-foreground pt-(--header-height) antialiased">
```

with:

```astro
  <body class="bg-concrete text-ink antialiased">
```

(`pt-(--header-height)` is dropped — the new `Header` is `sticky`, not `fixed`, so it occupies normal document flow and no manual top-padding offset is needed. The rest of the file — `Header`, `<main><div class="container"><Breadcrumbs items={breadcrumbs} /></div><slot /></main>`, `Footer`, and the `initScrollReveal` script — stays exactly as-is; `Breadcrumbs.astro` was already rebuilt in Task 21 and the prop contract (`items: BreadcrumbItem[]`) is unchanged.)

- [ ] **Step 3: Verify**

Run: `pnpm exec astro check && grep -n "theme" src/layouts/main-layout.astro`
Expected: `astro check` passes; the `grep` returns no matches (all theme-toggle remnants removed).

- [ ] **Step 4: Commit**

```bash
git add src/layouts/main-layout.astro
git commit -m "fix(layout): remove theme-toggle init script, update body base classes"
```

---

## Phase 4: Homepage section organisms

This plan collapses the old `HeroSection`'s five variants (`centered`/`split`/`minimal`/`fullscreen`/`profile`) down to two — `split` (dark, used by the homepage and hire pages) and `minimal` (light, used by every interior content page) — because nothing in the spec or the real page content needs the other three. This is a deviation from the original component inventory's implicit "keep same variants" assumption; noted in the final report.

### Task 30: Rewrite `HeroSection.astro`

**Files:**
- Modify: `src/components/organisms/sections/HeroSection.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import Heading from '@/components/atoms/Heading.astro';
import Text from '@/components/atoms/Text.astro';
import Button from '@/components/atoms/Button.astro';
import Badge from '@/components/atoms/Badge.astro';
import StencilGrid from '@/components/organisms/decorative/StencilGrid.astro';

type Variant = 'split' | 'minimal';

interface CTA {
  label: string;
  href: string;
}

interface Props {
  variant?: Variant;
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  description?: string;
  badges?: string[];
  primaryCta?: CTA;
  secondaryCta?: CTA;
  class?: string;
}

const {
  variant = 'minimal',
  eyebrow,
  headline,
  subheadline,
  description,
  badges,
  primaryCta,
  secondaryCta,
  class: className = '',
} = Astro.props;

const hasRightSlot = Astro.slots.has('right');
---

{variant === 'split' && (
  <section class={`relative overflow-hidden bg-ink py-18 text-concrete ${className}`}>
    <StencilGrid />
    <div class={`container relative z-10 grid items-center gap-12 ${hasRightSlot ? 'lg:grid-cols-[7fr_5fr]' : ''}`}>
      <div class={hasRightSlot ? '' : 'max-w-3xl'}>
        {eyebrow && (
          <span data-hero-animate data-hero-order="0" class="mb-6 inline-block rounded-xs border border-seam bg-asphalt px-3 py-1 font-mono text-xs font-bold tracking-[0.18em] text-signal uppercase">
            {eyebrow}
          </span>
        )}

        <Heading level={1} size="hero" class="text-concrete" data-hero-animate data-hero-order="1">{headline}</Heading>

        {subheadline && (
          <p data-hero-animate data-hero-order="2" class="mt-4 font-mono text-sm font-bold tracking-[0.1em] text-signal uppercase md:text-base">
            {subheadline}
          </p>
        )}

        {description && (
          <Text size="lg" color="steel" class="mt-5 max-w-[54ch]" balance data-hero-animate data-hero-order="3">
            {description}
          </Text>
        )}

        {(primaryCta || secondaryCta) && (
          <div data-hero-animate data-hero-order="4" class="mt-8 flex flex-wrap gap-4">
            {primaryCta && <Button href={primaryCta.href} variant="primary" size="lg">{primaryCta.label}</Button>}
            {secondaryCta && <Button href={secondaryCta.href} variant="secondary" size="lg">{secondaryCta.label}</Button>}
          </div>
        )}

        {badges && badges.length > 0 && (
          <div class="mt-8 flex flex-wrap gap-2 border-t border-seam pt-4">
            {badges.map(badge => <Badge label={badge} variant="outline" size="sm" class="border-seam text-concrete" />)}
          </div>
        )}

        <slot />
      </div>

      {hasRightSlot && (
        <div class="justify-self-center lg:justify-self-end" data-hero-animate data-hero-order="5">
          <slot name="right" />
        </div>
      )}
    </div>
  </section>
)}

{variant === 'minimal' && (
  <section class={`section-py ${className}`}>
    <div class="container max-w-3xl">
      {eyebrow && (
        <span class="mb-3 block font-mono text-xs font-bold tracking-[0.18em] text-signal-deep uppercase">
          {eyebrow}
        </span>
      )}
      <Heading level={1} size="xl">{headline}</Heading>
      {description && (
        <Text size="lg" class="mt-4" balance>{description}</Text>
      )}
      <slot />
    </div>
  </section>
)}

<script>
  import { initHeroEntrance } from '@/lib/animations';
  document.addEventListener('DOMContentLoaded', () => {
    initHeroEntrance();
  });
</script>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`
Expected: fails at this point for every page that still passes old props (`variant="centered"`, `variant="profile"`, `variant="fullscreen"`, `image`, `avatar`, `socialProof`, `height`, `align`, `showGradient`) — this is expected and gets fixed page-by-page in Tasks 48-60 (the templates in Tasks 49-51 and every page in Phase 8). Confirm the failure list matches those files only:

Run: `pnpm exec astro check 2>&1 | grep -B2 "HeroSection"`
Expected: errors only in `src/pages/index.astro`, `src/pages/experience.astro`, `src/pages/contact.astro`, `src/pages/projects/index.astro`, `src/pages/blog/index.astro`, `src/pages/blog/tag/[tag].astro`, `src/pages/hire/index.astro`, `src/pages/hire/react-developer.astro`, `src/pages/hire/nextjs-developer.astro`, `src/pages/hire/headless-cms.astro`, `src/templates/*.astro` — all rewritten later in this plan.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/HeroSection.astro
git commit -m "feat(sections): rebuild HeroSection with split/minimal variants"
```

### Task 31: Create `BuildManifestCard.astro` (hero signature widget)

**Files:**
- Create: `src/components/organisms/sections/BuildManifestCard.astro`

- [ ] **Step 1: Write file**

```astro
---
import Badge from '@/components/atoms/Badge.astro';

interface ManifestEntry {
  title: string;
  meta: string;
  stamp: 'done' | 'pending' | 'review';
}

interface Props {
  entries: ManifestEntry[];
  progressLabel: string;
  progressFraction: string;
  progressPercent: number;
  class?: string;
}

const { entries, progressLabel, progressFraction, progressPercent, class: className = '' } = Astro.props;

const stampVariant: Record<ManifestEntry['stamp'], 'stamp-done' | 'stamp-pending' | 'stamp-review'> = {
  done: 'stamp-done',
  pending: 'stamp-pending',
  review: 'stamp-review',
};

const stampLabel: Record<ManifestEntry['stamp'], string> = {
  done: 'Shipped',
  pending: 'Planned',
  review: 'In Review',
};
---

<div class={`w-full max-w-[460px] -rotate-[0.6deg] overflow-hidden rounded-md border-2 border-ink bg-paper shadow-[8px_8px_0_var(--color-signal)] ${className}`}>
  <div class="flex items-baseline justify-between gap-3 bg-ink px-4 py-3">
    <span class="font-mono text-xs font-bold tracking-[0.16em] text-signal uppercase">Build Manifest</span>
    <span class="font-mono text-xs text-steel">Selected work</span>
  </div>

  <div>
    {entries.map((entry, index) => (
      <div class="grid grid-cols-[34px_1fr_auto] items-center gap-3 border-b border-concrete-2 px-4 py-3 last:border-b-2 last:border-ink">
        <span class="font-mono text-xs font-bold text-graphite">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <p class="text-sm font-bold text-ink">{entry.title}</p>
          <p class="mt-0.5 font-mono text-[10.5px] tracking-[0.06em] text-graphite uppercase">{entry.meta}</p>
        </div>
        <Badge label={stampLabel[entry.stamp]} variant={stampVariant[entry.stamp]} size="sm" />
      </div>
    ))}
  </div>

  <div class="bg-paper px-4 py-4">
    <div class="mb-2 flex items-baseline justify-between">
      <span class="font-mono text-xs font-bold tracking-[0.14em] text-ink uppercase">{progressLabel}</span>
      <span class="font-display text-xl font-black tabular-nums text-ink">{progressFraction}</span>
    </div>
    <div class="h-4 overflow-hidden rounded-xs border-2 border-ink bg-concrete">
      <div
        class="h-full border-r-2 border-ink"
        style={`width: ${progressPercent}%; background: repeating-linear-gradient(-45deg, var(--color-signal) 0 10px, oklch(78% 0.21 137) 10px 20px);`}
      />
    </div>
  </div>
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/BuildManifestCard.astro
git commit -m "feat(sections): add BuildManifestCard hero signature widget"
```

### Task 32: Rewrite `TrustStripSection` (currently doesn't exist as its own file — this creates it and the homepage stops inlining the "Trusted By" markup directly)

**Files:**
- Create: `src/components/organisms/sections/TrustStripSection.astro`

- [ ] **Step 1: Write file**

```astro
---
import type { ImageMetadata } from 'astro';
import { Image } from 'astro:assets';
import Badge from '@/components/atoms/Badge.astro';

interface Company {
  name: string;
  alt: string;
  logo: ImageMetadata;
}

interface Props {
  guaranteeText: string;
  badges: string[];
  companies: Company[];
  class?: string;
}

const { guaranteeText, badges, companies, class: className = '' } = Astro.props;
---

<section class={`border-b-2 border-ink bg-concrete-2 py-6 ${className}`}>
  <div class="container flex flex-wrap items-center justify-between gap-4">
    <p class="flex max-w-[46ch] items-center gap-3 text-sm font-bold text-ink">
      <span class="flex h-10 w-10 flex-none items-center justify-center rounded-full border-2 border-ink bg-signal font-mono text-sm font-bold shadow-hard-sm">
        &check;
      </span>
      <span>{guaranteeText}</span>
    </p>
    <div class="flex flex-wrap gap-2">
      {badges.map(badge => <Badge label={badge} variant="default" size="sm" />)}
    </div>
  </div>

  <div class="container mt-6 grid grid-cols-2 items-center gap-4 md:grid-cols-4">
    {companies.map(company => (
      <div class="flex items-center justify-center rounded-sm border-2 border-ink bg-paper p-4">
        <Image src={company.logo} alt={company.alt} width={160} height={64} class="max-h-8 w-auto object-contain" loading="lazy" />
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/TrustStripSection.astro
git commit -m "feat(sections): add TrustStripSection merging guarantee seal and trusted-by logos"
```

### Task 33: Rewrite `FeaturesSection.astro` as bento grid with phase tags

**Files:**
- Modify: `src/components/organisms/sections/FeaturesSection.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import SectionHeader from '@/components/molecules/SectionHeader.astro';
import StatItem from '@/components/molecules/StatItem.astro';
import Badge from '@/components/atoms/Badge.astro';
import Heading from '@/components/atoms/Heading.astro';

interface StatCell {
  value: string | number;
  suffix?: string;
  label: string;
}

interface BentoCard {
  phase: string;
  title: string;
  description?: string;
  dark?: boolean;
  span?: 5 | 7 | 12;
  statBoard?: StatCell[];
  tags?: string[];
}

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  cards: BentoCard[];
  class?: string;
}

const { eyebrow, title, description, cards, class: className = '' } = Astro.props;

const spanClasses: Record<number, string> = {
  5: 'lg:col-span-5',
  7: 'lg:col-span-7',
  12: 'lg:col-span-12',
};
---

<section class={`section-py ${className}`}>
  <div class="container">
    <SectionHeader eyebrow={eyebrow} title={title} description={description} class="mb-10" />

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {cards.map(card => (
        <article
          class={`col-span-1 flex flex-col gap-3 rounded-md border-2 p-6 transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 ${spanClasses[card.span ?? 12]} ${
            card.dark ? 'border-ink bg-ink text-concrete shadow-hard hover:shadow-[7px_7px_0_var(--color-signal)]' : 'border-ink bg-paper text-ink shadow-hard hover:shadow-[7px_7px_0_var(--color-ink)]'
          }`}
        >
          <Badge label={card.phase} variant="phase" size="sm" class="self-start" />
          <Heading level={3} size="base" class={card.dark ? 'text-concrete' : 'text-ink'}>{card.title}</Heading>
          {card.description && (
            <p class={`max-w-[46ch] text-sm ${card.dark ? 'text-steel' : 'text-graphite'}`}>{card.description}</p>
          )}

          {card.statBoard && (
            <div class="mt-auto grid grid-cols-3 gap-2 border-t border-seam pt-4">
              {card.statBoard.map(stat => <StatItem value={stat.value} suffix={stat.suffix} label={stat.label} tone="dark" />)}
            </div>
          )}

          {card.tags && (
            <div class={`mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t pt-3 font-mono text-xs font-bold tracking-[0.1em] uppercase ${card.dark ? 'border-seam text-steel' : 'border-concrete-2 text-graphite'}`}>
              {card.tags.map(tag => <span>{tag}</span>)}
            </div>
          )}
        </article>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/FeaturesSection.astro
git commit -m "feat(sections): rebuild FeaturesSection as phase-tagged bento grid"
```

### Task 34: Rewrite `HowItWorksSection` (new file — homepage previously had no equivalent section)

**Files:**
- Create: `src/components/organisms/sections/HowItWorksSection.astro`

- [ ] **Step 1: Write file**

```astro
---
import SectionHeader from '@/components/molecules/SectionHeader.astro';

interface Step {
  number: string;
  tag: string;
  title: string;
  description: string;
}

interface Props {
  eyebrow?: string;
  title: string;
  steps: Step[];
  class?: string;
}

const { eyebrow, title, steps, class: className = '' } = Astro.props;
---

<section class={`section-py border-y-2 border-ink bg-ink text-concrete ${className}`}>
  <div class="container">
    <SectionHeader eyebrow={eyebrow} title={title} tone="dark" class="mb-10" />

    <ol class="grid grid-cols-1 gap-4 md:grid-cols-3">
      {steps.map(step => (
        <li class="relative rounded-md border-2 border-seam bg-asphalt p-6">
          <span
            class="font-display text-5xl leading-none font-black text-transparent"
            style="-webkit-text-stroke: 2px var(--color-signal);"
          >
            {step.number}
          </span>
          <span class="absolute top-6 right-6 rounded-xs border border-seam px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-steel uppercase">
            {step.tag}
          </span>
          <h3 class="font-display mt-4 text-xl font-black uppercase">{step.title}</h3>
          <p class="mt-2 text-sm text-steel">{step.description}</p>
        </li>
      ))}
    </ol>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/HowItWorksSection.astro
git commit -m "feat(sections): add HowItWorksSection with numbered stencil steps"
```

### Task 35: Rewrite `EngagementSection` (repurposed pricing — new file, homepage previously had no pricing section)

**Files:**
- Create: `src/components/organisms/sections/EngagementSection.astro`

- [ ] **Step 1: Write file**

```astro
---
import SectionHeader from '@/components/molecules/SectionHeader.astro';
import Button from '@/components/atoms/Button.astro';
import ListItem from '@/components/molecules/ListItem.astro';

interface Plan {
  eyebrow: string;
  name: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  plans: Plan[];
  customNote: string;
  customCta: { label: string; href: string };
  class?: string;
}

const { eyebrow, title, description, plans, customNote, customCta, class: className = '' } = Astro.props;
---

<section class={`section-py ${className}`}>
  <div class="container">
    <SectionHeader eyebrow={eyebrow} title={title} description={description} class="mb-10" />

    <div class="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
      {plans.map(plan => (
        <article
          class={`flex flex-col overflow-hidden rounded-md border-2 border-ink ${
            plan.highlighted ? 'shadow-[8px_8px_0_var(--color-signal-deep)]' : 'shadow-hard'
          }`}
        >
          <div class={`border-b-2 border-ink p-6 ${plan.highlighted ? 'bg-ink text-concrete' : 'bg-concrete-2 text-ink'}`}>
            <span class={`mb-2 block font-mono text-xs font-bold tracking-[0.16em] uppercase ${plan.highlighted ? 'text-signal' : 'text-graphite'}`}>
              {plan.eyebrow}
            </span>
            <h3 class="font-display text-2xl font-black uppercase">{plan.name}</h3>
          </div>
          <div class="flex flex-1 flex-col gap-4 bg-paper p-6">
            <p class="text-graphite text-sm">{plan.description}</p>
            <ul class="space-y-2">
              {plan.features.map(feature => <ListItem icon="check">{feature}</ListItem>)}
            </ul>
            <div class="mt-auto pt-2 text-center">
              <Button href="/contact" variant={plan.highlighted ? 'primary' : 'ghost-ink'} size="sm" fullWidth>
                Discuss {plan.name}
              </Button>
            </div>
          </div>
        </article>
      ))}
    </div>

    <div class="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-md border-2 border-dashed border-ink bg-concrete-2 p-6">
      <p class="max-w-[60ch] text-sm font-bold text-ink">{customNote}</p>
      <Button href={customCta.href} variant="ghost-ink" size="sm">{customCta.label}</Button>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/EngagementSection.astro
git commit -m "feat(sections): add EngagementSection (repurposed pricing pattern)"
```

### Task 36: Rewrite `ComparisonSection` (repurposed "why work with me" table — new file)

**Files:**
- Create: `src/components/organisms/sections/ComparisonSection.astro`

- [ ] **Step 1: Write file**

```astro
---
import SectionHeader from '@/components/molecules/SectionHeader.astro';

interface Row {
  criterion: string;
  values: string[];
  note?: string;
}

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  columns: string[];
  rows: Row[];
  class?: string;
}

const { eyebrow, title, description, columns, rows, class: className = '' } = Astro.props;
---

<section class={`section-py bg-ink text-concrete ${className}`}>
  <div class="container">
    <SectionHeader eyebrow={eyebrow} title={title} description={description} tone="dark" class="mb-10" />

    <div class="overflow-x-auto">
      <table class="w-full min-w-[640px] border-collapse border-2 border-seam bg-asphalt">
        <thead>
          <tr>
            <th class="border border-seam p-4 text-left font-mono text-xs tracking-[0.14em] text-steel uppercase">What to compare</th>
            {columns.map((col, i) => (
              <th class={`border border-seam p-4 text-left font-mono text-xs tracking-[0.14em] uppercase ${i === 0 ? 'bg-signal text-ink' : 'text-steel'}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr>
              <td class="border border-seam p-4 text-sm font-bold">{row.criterion}</td>
              {row.values.map((value, i) => (
                <td class={`border border-seam p-4 font-mono text-xs tracking-[0.08em] uppercase ${i === 0 ? 'font-bold text-signal' : 'text-steel'}`}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/ComparisonSection.astro
git commit -m "feat(sections): add ComparisonSection (repurposed comparison table)"
```

### Task 37: Rewrite `QuoteSection` (personal pull-quote, replaces `TestimonialsSection` usage — new file)

**Files:**
- Create: `src/components/organisms/sections/QuoteSection.astro`

- [ ] **Step 1: Write file**

```astro
---
interface Props {
  class?: string;
}

const { class: className = '' } = Astro.props;
---

<section class={`section-py ${className}`}>
  <div class="container">
    <figure class="relative mx-auto max-w-[900px] rounded-md border-2 border-ink bg-paper p-8 shadow-[8px_8px_0_var(--color-signal)] sm:p-10">
      <span class="font-display absolute -top-4 left-6 rounded-xs border-2 border-ink bg-signal px-2 pt-1 text-2xl font-black shadow-hard-sm">
        &ldquo;
      </span>
      <blockquote>
        <p class="font-display text-[clamp(19px,2.4vw,27px)] leading-snug font-black text-ink">
          I stopped writing every line by hand. I pair with Claude Code and
          <span class="bg-signal px-1">Fable 5</span> on real production work end to end, and I still make every
          architecture call before a single file changes.
        </p>
      </blockquote>
      <figcaption class="mt-4 flex flex-wrap justify-between gap-3 border-t border-concrete-2 pt-3">
        <span class="text-sm font-bold text-ink">Aaron Molina</span>
        <span class="font-mono text-xs tracking-[0.12em] text-graphite uppercase">Full stack Jamstack developer</span>
      </figcaption>
    </figure>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/QuoteSection.astro
git commit -m "feat(sections): add QuoteSection with personal pull-quote"
```

### Task 38: Rewrite `FAQSection.astro`

**Files:**
- Modify: `src/components/organisms/sections/FAQSection.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import SectionHeader from '@/components/molecules/SectionHeader.astro';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  eyebrow?: string;
  title: string;
  faqs: FAQItem[];
  class?: string;
}

const { eyebrow, title, faqs, class: className = '' } = Astro.props;
---

<section class={`section-py ${className}`}>
  <div class="container mx-auto max-w-[900px]">
    <SectionHeader eyebrow={eyebrow} title={title} class="mb-8" />

    {faqs.map((faq, index) => (
      <details class="group mb-3 rounded-sm border-2 border-ink bg-paper open:shadow-hard-sm">
        <summary class="flex cursor-pointer list-none items-baseline gap-3 p-4 font-bold text-ink marker:content-none">
          <span class="flex-none font-mono text-xs font-bold text-signal-deep">{String(index + 1).padStart(2, '0')}</span>
          <span class="flex-1">{faq.question}</span>
          <span class="flex-none font-mono text-lg transition-transform group-open:rotate-45">+</span>
        </summary>
        <p class="text-graphite max-w-[68ch] px-4 pb-4 pl-11 text-sm">{faq.answer}</p>
      </details>
    ))}
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/FAQSection.astro
git commit -m "feat(sections): rebuild FAQSection accordion with numbered entries"
```

### Task 39: Rewrite `CTASection.astro`

**Files:**
- Modify: `src/components/organisms/sections/CTASection.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import Heading from '@/components/atoms/Heading.astro';
import Button from '@/components/atoms/Button.astro';
import StencilGrid from '@/components/organisms/decorative/StencilGrid.astro';

interface Props {
  title: string;
  description?: string;
  buttonLabel: string;
  buttonHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  micro?: string;
  class?: string;
}

const {
  title,
  description,
  buttonLabel,
  buttonHref,
  secondaryLabel,
  secondaryHref,
  micro,
  class: className = '',
} = Astro.props;
---

<section class={`section-py relative overflow-hidden bg-ink text-center text-concrete ${className}`}>
  <StencilGrid />
  <div class="container relative z-10">
    <Heading level={2} size="2xl" class="mx-auto max-w-[20ch] text-concrete">{title}</Heading>
    {description && <p class="mx-auto mt-4 max-w-[52ch] text-steel">{description}</p>}
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <Button href={buttonHref} variant="primary" size="lg">{buttonLabel}</Button>
      {secondaryLabel && secondaryHref && <Button href={secondaryHref} variant="secondary" size="lg">{secondaryLabel}</Button>}
    </div>
    {micro && <p class="mt-4 font-mono text-xs font-bold tracking-[0.12em] text-steel uppercase">{micro}</p>}
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/CTASection.astro
git commit -m "feat(sections): rebuild CTASection as dark stencil-grid final CTA"
```

**Note for later tasks:** `CTASection` has no default props (matches how every other rebuilt section works). Four existing call sites (`experience.astro`, `projects/index.astro`, `blog/index.astro`, `blog/tag/[tag].astro`) currently render `<CTASection />` or `<CTASection class="..." />` with no other props, relying on defaults the *old* component provided. Tasks 52, 54, 55, and 56 below (which rewrite those exact pages) each pass explicit `title`/`description`/`buttonLabel`/`buttonHref` sourced from `src/content/site/cta.json`, so this is fixed as part of those rewrites, not a follow-up.

### Task 40: Rewrite `StatsSection.astro`

**Files:**
- Modify: `src/components/organisms/sections/StatsSection.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import StatItem from '@/components/molecules/StatItem.astro';

interface Stat {
  value: string | number;
  suffix?: string;
  label: string;
}

type Tone = 'light' | 'dark';

interface Props {
  stats: Stat[];
  tone?: Tone;
  class?: string;
}

const { stats, tone = 'light', class: className = '' } = Astro.props;
---

<section class={`section-py ${tone === 'dark' ? 'bg-ink' : ''} ${className}`}>
  <div class="container">
    <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map(stat => <StatItem value={stat.value} suffix={stat.suffix} label={stat.label} tone={tone} />)}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/StatsSection.astro
git commit -m "feat(sections): rebuild StatsSection as StatItem grid"
```

### Task 41: Rewrite `SkillsSection.astro` (tech-stack badge cloud; also replaces `TechShowcase`/`TechShowcaseMobile`)

**Files:**
- Modify: `src/components/organisms/sections/SkillsSection.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import SectionHeader from '@/components/molecules/SectionHeader.astro';
import Badge from '@/components/atoms/Badge.astro';
import type { TechMap } from '@/utils/tech-lookup';
import { getTechName } from '@/utils/tech-lookup';

interface Category {
  name: string;
  skills: string[];
}

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  categories: Category[];
  techMap: TechMap;
  class?: string;
}

const { eyebrow, title, description, categories, techMap, class: className = '' } = Astro.props;
---

<section class={`section-py ${className}`}>
  <div class="container">
    <SectionHeader eyebrow={eyebrow} title={title} description={description} class="mb-10" />

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      {categories.map(category => (
        <div class="rounded-md border-2 border-ink bg-paper p-5 shadow-hard-sm">
          <h3 class="mb-3 font-mono text-xs font-bold tracking-[0.14em] text-signal-deep uppercase">{category.name}</h3>
          <div class="flex flex-wrap gap-2">
            {category.skills.map(skill => <Badge label={getTechName(skill, techMap)} variant="default" size="sm" />)}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/SkillsSection.astro
git commit -m "feat(sections): rebuild SkillsSection as grouped badge cloud"
```

### Task 42: Rewrite `ExperienceSection.astro`

**Files:**
- Modify: `src/components/organisms/sections/ExperienceSection.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { CollectionEntry } from 'astro:content';
import SectionHeader from '@/components/molecules/SectionHeader.astro';
import RoleCard from '@/components/organisms/cards/RoleCard.astro';
import Button from '@/components/atoms/Button.astro';

interface CTA {
  label: string;
  href: string;
}

interface Props {
  eyebrow?: string;
  title: string;
  roles: CollectionEntry<'roles'>[];
  organizations: Map<string, CollectionEntry<'organizations'>>;
  showAllDetails?: boolean;
  cta?: CTA;
  class?: string;
}

const { eyebrow, title, roles, organizations, showAllDetails = false, cta, class: className = '' } = Astro.props;
---

<section class={`section-py ${className}`}>
  <div class="container">
    <SectionHeader eyebrow={eyebrow} title={title} class="mb-10" />

    <div class="grid grid-cols-1 gap-6">
      {roles.map(role => (
        <RoleCard role={role} organization={organizations.get(role.data.organization)} showAllDetails={showAllDetails} />
      ))}
    </div>

    {cta && (
      <div class="mt-8 text-center">
        <Button href={cta.href} variant="ghost-ink" size="sm">{cta.label}</Button>
      </div>
    )}
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/ExperienceSection.astro
git commit -m "feat(sections): rebuild ExperienceSection as RoleCard list"
```

### Task 43: Rewrite `ProjectsSection.astro`

**Files:**
- Modify: `src/components/organisms/sections/ProjectsSection.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { CollectionEntry } from 'astro:content';
import SectionHeader from '@/components/molecules/SectionHeader.astro';
import ProjectCard from '@/components/organisms/cards/ProjectCard.astro';
import Button from '@/components/atoms/Button.astro';

interface CTA {
  label: string;
  href: string;
}

interface Props {
  eyebrow?: string;
  title?: string;
  projects: CollectionEntry<'projects'>[];
  columns?: 2 | 3;
  showCompletedDate?: boolean;
  cta?: CTA;
  class?: string;
}

const { eyebrow, title, projects, columns = 3, showCompletedDate = false, cta, class: className = '' } = Astro.props;

const colClasses: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
};
---

<section class={`section-py ${className}`}>
  <div class="container">
    {title && <SectionHeader eyebrow={eyebrow} title={title} class="mb-10" />}

    <div class={`grid grid-cols-1 gap-6 ${colClasses[columns]}`}>
      {projects.map(project => <ProjectCard project={project} showCompletedDate={showCompletedDate} />)}
    </div>

    {cta && (
      <div class="mt-8 text-center">
        <Button href={cta.href} variant="ghost-ink" size="sm">{cta.label}</Button>
      </div>
    )}
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/ProjectsSection.astro
git commit -m "feat(sections): rebuild ProjectsSection as ProjectCard grid"
```

### Task 44: Rewrite `BlogSection.astro`

**Files:**
- Modify: `src/components/organisms/sections/BlogSection.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { CollectionEntry } from 'astro:content';
import SectionHeader from '@/components/molecules/SectionHeader.astro';
import BlogPostCard from '@/components/organisms/cards/BlogPostCard.astro';
import Button from '@/components/atoms/Button.astro';
import type { TechMap } from '@/utils/tech-lookup';

interface CTA {
  label: string;
  href: string;
}

interface Props {
  eyebrow?: string;
  title?: string;
  posts: CollectionEntry<'blog'>[];
  techMap?: TechMap;
  showTags?: boolean;
  cta?: CTA;
  class?: string;
}

const { eyebrow, title, posts, techMap, showTags = false, cta, class: className = '' } = Astro.props;
---

<section class={`section-py ${className}`}>
  <div class="container">
    {title && <SectionHeader eyebrow={eyebrow} title={title} class="mb-10" />}

    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map(post => <BlogPostCard post={post} techMap={techMap} showTags={showTags} />)}
    </div>

    {cta && (
      <div class="mt-8 text-center">
        <Button href={cta.href} variant="ghost-ink" size="sm">{cta.label}</Button>
      </div>
    )}
  </div>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/BlogSection.astro
git commit -m "feat(sections): rebuild BlogSection as BlogPostCard grid"
```

---

## Phase 5: Cards

### Task 45: Rewrite `ProjectCard.astro`

**Files:**
- Modify: `src/components/organisms/cards/ProjectCard.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import { Image } from 'astro:assets';
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { createTechMap } from '@/utils/tech-lookup';
import Badge from '@/components/atoms/Badge.astro';
import TagList from '@/components/molecules/TagList.astro';
import Heading from '@/components/atoms/Heading.astro';
import Link from '@/components/atoms/Link.astro';
import Card from '@/components/molecules/Card.astro';
import { FaImage } from '@/lib/icons';

interface Props {
  project: CollectionEntry<'projects'>;
  showCompletedDate?: boolean;
}

const { project, showCompletedDate = false } = Astro.props;

const technologies = await getCollection('technologies');
const techMap = createTechMap(technologies);

const completionDate = project.data.completedOn?.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
});
---

<Card variant="light" padding="none" class="flex h-full flex-col overflow-hidden">
  <div class="relative aspect-video overflow-hidden border-b-2 border-ink bg-concrete-2">
    {project.data.featuredImage ? (
      <Image src={project.data.featuredImage} alt={project.data.title} class="h-full w-full object-cover" width={600} height={340} loading="lazy" />
    ) : (
      <div class="flex h-full w-full items-center justify-center text-graphite">
        <FaImage className="h-8 w-8" />
      </div>
    )}
    {project.data.featured && <Badge label="Featured" variant="phase" size="sm" class="absolute top-3 right-3" />}
  </div>

  <div class="flex flex-1 flex-col gap-3 p-6">
    <Heading level={3} size="sm">
      <a href={`/projects/${project.data.slug}`}>{project.data.title}</a>
    </Heading>

    {showCompletedDate && completionDate && (
      <p class="font-mono text-xs text-graphite uppercase">{completionDate}</p>
    )}

    {project.data.summary && <p class="text-graphite text-sm">{project.data.summary}</p>}

    <TagList tags={project.data.technologies} techMap={techMap} limit={3} size="sm" />

    <div class="mt-auto flex items-center justify-between border-t-2 border-concrete-2 pt-4">
      <Link href={`/projects/${project.data.slug}`} variant="signal" size="sm" showArrow>Learn more</Link>
      {project.data.liveUrl && (
        <Link href={project.data.liveUrl} variant="muted" size="sm" external showArrow>View project</Link>
      )}
    </div>
  </div>
</Card>
```

**Note:** this is the first task to actually consume the `Card` molecule rebuilt in Task 13 — its `padding="none"` variant lets `ProjectCard` control its own internal spacing (needed for the full-bleed image at the top) while still getting `Card`'s border/shadow/hover-lift for free instead of repeating those classes inline.

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/cards/ProjectCard.astro
git commit -m "feat(cards): rebuild ProjectCard with hard-shadow border"
```

### Task 46: Rewrite `BlogPostCard.astro`

**Files:**
- Modify: `src/components/organisms/cards/BlogPostCard.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { formatDate, toISODateString } from '@/utils/date-format';
import Heading from '@/components/atoms/Heading.astro';
import Link from '@/components/atoms/Link.astro';
import TagList from '@/components/molecules/TagList.astro';
import Card from '@/components/molecules/Card.astro';
import type { TechMap } from '@/utils/tech-lookup';

interface Props {
  post: CollectionEntry<'blog'>;
  techMap?: TechMap;
  showTags?: boolean;
}

const { post, techMap, showTags = false } = Astro.props;
---

<Card variant="light" padding="base" class="h-full justify-between">
  <div>
    <Heading level={3} size="sm" class="mb-2 line-clamp-2">
      <a href={`/blog/${post.data.slug}`}>{post.data.title}</a>
    </Heading>

    {post.data.publishDate && (
      <time datetime={toISODateString(post.data.publishDate)} class="mb-3 block font-mono text-xs text-graphite uppercase">
        {formatDate(post.data.publishDate, 'long')}
      </time>
    )}

    {post.data.description && <p class="text-graphite mb-4 text-sm">{post.data.description}</p>}

    {showTags && post.data.tags && post.data.tags.length > 0 && techMap && (
      <TagList tags={post.data.tags} techMap={techMap} limit={3} size="sm" class="mb-4" />
    )}
  </div>

  <Link href={`/blog/${post.data.slug}`} variant="signal" size="sm" showArrow>Read More</Link>
</Card>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/cards/BlogPostCard.astro
git commit -m "feat(cards): rebuild BlogPostCard with hard-shadow border"
```

### Task 47: Rewrite `RoleCard.astro`

**Files:**
- Modify: `src/components/organisms/cards/RoleCard.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { ImageMetadata } from 'astro';
import { Image } from 'astro:assets';
import { getCollection } from 'astro:content';
import { createTechMap } from '@/utils/tech-lookup';
import { formatDateRange, calculateDuration } from '@/utils/date-format';
import TagList from '@/components/molecules/TagList.astro';
import ListItem from '@/components/molecules/ListItem.astro';
import Heading from '@/components/atoms/Heading.astro';
import Badge from '@/components/atoms/Badge.astro';
import Link from '@/components/atoms/Link.astro';
import { FaBriefcase } from '@/lib/icons';

interface Props {
  role: {
    data: {
      title: string;
      slug: string;
      organization: string;
      location?: string;
      startDate: Date;
      endDate?: Date;
      current?: boolean;
      summary?: string;
      highlights: string[];
      achievements: string[];
      technologies: string[];
    };
  };
  organization?: {
    data: {
      name: string;
      slug: string;
      logo?: ImageMetadata;
      website?: string;
    };
  };
  showAllDetails?: boolean;
}

const { role, organization, showAllDetails = false } = Astro.props;

const technologies = await getCollection('technologies');
const techMap = createTechMap(technologies);

const duration = calculateDuration(role.data.startDate, role.data.endDate);
const dateRange = formatDateRange(role.data.startDate, role.data.endDate, role.data.current);
const orgName = organization?.data.name || role.data.organization;
---

<div id={role.data.slug} class="rounded-md border-2 border-ink bg-paper p-6 shadow-hard">
  <div class="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
    <div class="flex flex-col items-start gap-4 md:flex-row">
      <div class="flex aspect-square w-16 flex-none items-center justify-center overflow-hidden rounded-xs border-2 border-ink bg-concrete-2">
        {organization?.data.logo ? (
          <Image src={organization.data.logo} alt={`${orgName} logo`} width={80} height={80} loading="lazy" />
        ) : (
          <FaBriefcase className="text-graphite h-6 w-6" />
        )}
      </div>
      <div>
        <Heading level={3} size="sm">{role.data.title}</Heading>
        <p class="text-signal-deep font-bold">
          {orgName}
          {organization?.data.website && (
            <a href={organization.data.website} target="_blank" rel="noopener noreferrer" class="ml-1">
              <span class="sr-only">Visit site</span>
            </a>
          )}
        </p>
        {role.data.location && <p class="text-graphite text-sm">{role.data.location}</p>}
      </div>
    </div>
    <div class="md:text-right">
      <p class="font-mono text-sm font-bold text-ink">{dateRange}</p>
      <p class="text-graphite mt-1 font-mono text-xs">{duration}</p>
      {role.data.current && <Badge label="Current" variant="phase" size="sm" class="mt-1" />}
    </div>
  </div>

  {showAllDetails && role.data.summary && (
    <div class="mb-6 max-w-2xl rounded-sm border-2 border-concrete-2 p-4">
      <p class="text-graphite text-sm">{role.data.summary}</p>
    </div>
  )}

  <div class="grid gap-6 md:grid-cols-2">
    <div>
      <h4 class="mb-3 font-mono text-xs font-bold tracking-[0.1em] text-ink uppercase">Highlights</h4>
      <ul class="space-y-2">
        {role.data.highlights.slice(0, showAllDetails ? undefined : 3).map(highlight => <ListItem icon="check">{highlight}</ListItem>)}
      </ul>
      {!showAllDetails && (
        <div class="mt-4">
          <Link href={`/experience#${role.data.slug}`} variant="signal" size="sm" showArrow>See more details</Link>
        </div>
      )}
    </div>

    <div>
      <h4 class="mb-3 font-mono text-xs font-bold tracking-[0.1em] text-ink uppercase">Technologies</h4>
      <TagList tags={role.data.technologies} techMap={techMap} limit={showAllDetails ? undefined : 10} size="sm" />

      {role.data.achievements.length > 0 && (
        <div class="mt-4">
          <h4 class="mb-2 font-mono text-xs font-bold tracking-[0.1em] text-ink uppercase">Key Achievements</h4>
          <ul class="space-y-1">
            {role.data.achievements.map(achievement => <ListItem icon="award" size="sm">{achievement}</ListItem>)}
          </ul>
        </div>
      )}
    </div>
  </div>
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/cards/RoleCard.astro
git commit -m "feat(cards): rebuild RoleCard with hard-bordered layout"
```

---

## Phase 6: Homepage assembly

### Task 48: Rewrite `src/pages/index.astro`

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import MainLayout from '@/layouts/main-layout.astro';
import HeroSection from '@/components/organisms/sections/HeroSection.astro';
import BuildManifestCard from '@/components/organisms/sections/BuildManifestCard.astro';
import TrustStripSection from '@/components/organisms/sections/TrustStripSection.astro';
import FeaturesSection from '@/components/organisms/sections/FeaturesSection.astro';
import HowItWorksSection from '@/components/organisms/sections/HowItWorksSection.astro';
import SkillsShowcase from '@/components/organisms/sections/SkillsShowcase';
import { PortfolioChat } from '@/components/organisms/ai-portfolio-chat';
import ProjectsSection from '@/components/organisms/sections/ProjectsSection.astro';
import EngagementSection from '@/components/organisms/sections/EngagementSection.astro';
import ComparisonSection from '@/components/organisms/sections/ComparisonSection.astro';
import ExperienceSection from '@/components/organisms/sections/ExperienceSection.astro';
import QuoteSection from '@/components/organisms/sections/QuoteSection.astro';
import BlogSection from '@/components/organisms/sections/BlogSection.astro';
import FAQSection from '@/components/organisms/sections/FAQSection.astro';
import CTASection from '@/components/organisms/sections/CTASection.astro';
import SectionHeader from '@/components/molecules/SectionHeader.astro';
import { getCollection } from 'astro:content';
import { createTechMap } from '@/utils/tech-lookup';
import homepageContent from '@/content/site/homepage.json';
import hireContent from '@/content/site/hire.json';
import ClippersLogo from '@/assets/images/clippers-logo.svg';
import MiamiHeatLogo from '@/assets/images/miami-heat-logo.svg';
import AzamaraLogo from '@/assets/images/azamara-logo.svg';
import CorsairLogo from '@/assets/images/corsair-logo.svg';

const trustedByLogos: Record<string, ImageMetadata> = {
  'LA Clippers': ClippersLogo,
  'Miami Heat': MiamiHeatLogo,
  Azamara: AzamaraLogo,
  Corsair: CorsairLogo,
};

const posts = await getCollection('blog');
const technologies = await getCollection('technologies');
const techMap = createTechMap(technologies);
const roles = await getCollection('roles');
const organizations = await getCollection('organizations');
const projects = await getCollection('projects');

const currentDate = new Date();
const recentPosts = posts
  .filter(post => post.data.publishDate !== null)
  .filter(post => post.data.publishDate! <= currentDate)
  .sort((a, b) => b.data.publishDate!.getTime() - a.data.publishDate!.getTime())
  .slice(0, 3);

const orgBySlug = new Map(organizations.map(o => [o.data.slug, o]));
const now = Date.now();

const featuredRoles = roles
  .filter(r => r.data.isActive !== false)
  .sort((a, b) => {
    const aCurrent = Boolean(a.data.current);
    const bCurrent = Boolean(b.data.current);
    if (aCurrent && bCurrent) {
      const aDuration = (a.data.endDate?.getTime() ?? now) - a.data.startDate.getTime();
      const bDuration = (b.data.endDate?.getTime() ?? now) - b.data.startDate.getTime();
      if (aDuration !== bDuration) return aDuration - bDuration;
    } else {
      if (aCurrent && !bCurrent) return -1;
      if (!aCurrent && bCurrent) return 1;
    }
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    if ((a.data.sortOrder ?? 0) !== (b.data.sortOrder ?? 0)) return (a.data.sortOrder ?? 0) - (b.data.sortOrder ?? 0);
    return b.data.startDate.getTime() - a.data.startDate.getTime();
  })
  .slice(0, 3);

const featuredProjects = projects
  .filter(project => project.data.isActive !== false)
  .sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    if ((a.data.sortOrder ?? 0) !== (b.data.sortOrder ?? 0)) return (a.data.sortOrder ?? 0) - (b.data.sortOrder ?? 0);
    return (b.data.completedOn?.getTime() || 0) - (a.data.completedOn?.getTime() || 0);
  })
  .slice(0, 3);

const yearsOfExperience = new Date().getFullYear() - homepageContent.yearsOfExperienceStartYear;
const heroDescription = homepageContent.hero.description.replaceAll('{yearsOfExperience}', String(yearsOfExperience));

const statsItems = homepageContent.stats.items.map(item => ({
  ...item,
  value: String(item.value).replaceAll('{yearsOfExperience}', String(yearsOfExperience)),
}));

const logoOverrides: Record<string, string> = {
  'claude-code': 'claude.svg',
  'mcp-servers': 'model-context-protocol.svg',
  sass: 'sass.svg',
};

const showcaseSkills = technologies
  .filter(t => t.data.featured && t.data.level)
  .sort((a, b) => a.data.name.localeCompare(b.data.name))
  .map(t => ({
    slug: t.data.slug,
    name: t.data.name,
    level: t.data.level ?? 0,
    projects: (t.data.projects ?? []).map(pSlug => ({
      slug: pSlug,
      title: projects.find(p => p.data.slug === pSlug)?.data.title ?? pSlug,
    })),
    logoPath: logoOverrides[t.data.slug] ?? `${t.data.slug}.svg`,
  }));

// Build Manifest widget: four real shipped flagship projects
const manifestSlugs = ['clippers-website', 'miami-heat-website', 'typelyft', 'onemusiccrate-spotify-app'];
const manifestEntries = manifestSlugs
  .map(slug => projects.find(p => p.data.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))
  .map(p => {
    const org = p.data.organization ? orgBySlug.get(p.data.organization)?.data.name : undefined;
    const primaryTech = p.data.technologies[0] ? techMap.get(p.data.technologies[0]) : undefined;
    return {
      title: p.data.title,
      meta: [org, primaryTech].filter(Boolean).join(' · ') || 'Production build',
      stamp: 'done' as const,
    };
  });

// Bento phase cards: services + AI showcase + a mini stat board
const bentoCards = [
  { phase: 'Build', title: homepageContent.services.items[0].title, description: homepageContent.services.items[0].description, span: 5 as const },
  { phase: 'Integrate', title: homepageContent.services.items[1].title, description: homepageContent.services.items[1].description, span: 7 as const },
  {
    phase: 'Ship',
    title: 'By the numbers',
    dark: true,
    span: 7 as const,
    statBoard: statsItems.slice(0, 3).map(s => ({ value: s.value, suffix: s.suffix, label: s.label })),
  },
  {
    phase: 'Architect',
    title: homepageContent.services.items[3].title,
    description: homepageContent.services.items[3].description,
    span: 5 as const,
    tags: ['TypeScript', 'CI/CD', 'Testing', 'A11y'],
  },
  { phase: 'Assist', title: homepageContent.services.items[2].title, description: homepageContent.services.items[2].description, span: 5 as const },
  { phase: 'Extend', title: homepageContent.aiShowcase.items[2].title, description: homepageContent.aiShowcase.items[2].description, span: 7 as const },
];

const howItWorksSteps = [
  { number: '01', tag: 'Discovery', title: 'Discover & propose', description: 'A discovery call to understand your goals, followed by a proposal with timeline and deliverables.' },
  { number: '02', tag: 'Build', title: 'Build & communicate', description: 'Regular communication through your preferred channels, with demos at key milestones as the build progresses.' },
  { number: '03', tag: 'Launch', title: 'Ship & support', description: 'Production deployment, then ongoing support so the handoff never feels like the end of the conversation.' },
];

const engagementPlans = [
  {
    eyebrow: 'Fixed-scope builds',
    name: 'Project-Based',
    description: 'For a defined website, app, or migration with a clear start and finish.',
    features: ['Fixed-scope proposal', 'Milestone demos', 'Single point of contact', 'Post-launch handoff notes'],
  },
  {
    eyebrow: 'Ongoing partnership',
    name: 'Retainer',
    description: 'For teams that need continuous frontend, AI, or Jamstack support month over month.',
    features: ['Priority response time', 'Recurring roadmap check-ins', 'Flexible scope month to month', 'Direct Slack or email access'],
    highlighted: true,
  },
  {
    eyebrow: 'Deeper integration',
    name: 'Fractional / Embedded',
    description: 'For teams that want senior full stack coverage inside their own sprint process.',
    features: ['Joins existing standups', 'Code review participation', 'Architecture ownership', 'AI-augmented delivery speed'],
  },
];

const comparisonRows = [
  { criterion: 'Direct senior-level communication', values: ['Always', 'Rarely', 'Varies'] },
  { criterion: 'AI-augmented delivery speed', values: ['Built in', 'Varies', 'Varies'] },
  { criterion: 'Fixed point of contact', values: ['Always', 'Rarely', 'Sometimes'] },
  { criterion: 'Enterprise-tested code quality', values: ['Clippers, Heat, Azamara, Corsair', 'Unverified', 'Varies'] },
];
---

<MainLayout title={homepageContent.meta.title} description={homepageContent.meta.description.replaceAll('{yearsOfExperience}', String(yearsOfExperience))}>
  <HeroSection
    variant="split"
    eyebrow={homepageContent.hero.headline}
    headline={homepageContent.hero.name}
    subheadline={homepageContent.hero.subheadline}
    description={heroDescription}
    badges={[homepageContent.hero.location, homepageContent.hero.availability]}
    primaryCta={{ label: homepageContent.buttons.hireMeLabel, href: '/contact' }}
    secondaryCta={{ label: homepageContent.buttons.viewWorkLabel, href: '/projects' }}
  >
    <BuildManifestCard
      slot="right"
      entries={manifestEntries}
      progressLabel="Shown above"
      progressFraction={`${manifestEntries.length}/${manifestEntries.length}`}
      progressPercent={100}
    />
  </HeroSection>

  <section class="section-py">
    <div class="container">
      <SectionHeader
        eyebrow="Live demo"
        title="Ask my portfolio anything"
        description="A working AI demo. The bot itself is the proof of work, grounded in this site's content."
        align="center"
        class="mx-auto mb-8"
      />
      <PortfolioChat client:idle />
    </div>
  </section>

  <TrustStripSection
    guaranteeText="Free discovery call on every project. No obligation, no sales pitch."
    badges={['TypeScript everywhere', 'AI-augmented workflow', '24hr Response Time', 'Remote US / Miami']}
    companies={homepageContent.trustedBy.companies.map(company => ({
      name: company.name,
      alt: company.alt,
      logo: trustedByLogos[company.name],
    }))}
  />

  <FeaturesSection
    eyebrow="Core capabilities"
    title="Built around how production web work actually happens."
    description={homepageContent.services.subtitle}
    cards={bentoCards}
  />

  <HowItWorksSection eyebrow="The project, in order" title="One workflow from discovery call to shipped code." steps={howItWorksSteps} />

  <SkillsShowcase skills={showcaseSkills} client:visible />

  <ProjectsSection
    eyebrow="Recent work"
    title={homepageContent.featuredProjects.title}
    projects={featuredProjects}
    cta={{ label: homepageContent.featuredProjects.viewAllLabel, href: homepageContent.featuredProjects.viewAllHref }}
  />

  <EngagementSection
    eyebrow="How we can work together"
    title="Simple engagement models for teams that need production-ready work."
    plans={engagementPlans}
    customNote="Need something outside these three shapes? Let's talk about scope and terms."
    customCta={{ label: 'Contact Me', href: '/contact' }}
  />

  <ComparisonSection
    eyebrow="Side by side"
    title="A focused alternative to a marketplace freelancer or a large agency."
    description="Here is where working with a senior full stack developer directly earns its keep."
    columns={['Working with me', 'Marketplace freelancer', 'Traditional agency']}
    rows={comparisonRows}
  />

  <ExperienceSection
    eyebrow="Where I've shipped"
    title={homepageContent.experience.title}
    roles={featuredRoles}
    organizations={orgBySlug}
    cta={{ label: homepageContent.experience.viewAllLabel, href: homepageContent.experience.viewAllHref }}
  />

  <QuoteSection />

  {recentPosts.length > 0 && (
    <BlogSection
      eyebrow="From the blog"
      title={homepageContent.blog.title}
      posts={recentPosts}
      techMap={techMap}
      cta={{ label: homepageContent.blog.viewAllLabel, href: homepageContent.blog.viewAllHref }}
    />
  )}

  <FAQSection eyebrow="Before you reach out" title="Common questions" faqs={hireContent.shared.faq} />

  <CTASection
    title={homepageContent.cta.title}
    description={homepageContent.cta.description}
    buttonLabel={homepageContent.cta.primaryButton.label}
    buttonHref={homepageContent.cta.primaryButton.href}
    secondaryLabel={homepageContent.cta.secondaryButton.label}
    secondaryHref={homepageContent.cta.secondaryButton.href}
  />
</MainLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`
Expected: no errors.

Run: `pnpm build`
Expected: build succeeds.

Run: `pnpm dev` (leave running), then open `http://localhost:4321/` in a browser and confirm: dark hero with the Build Manifest card, working chat widget, trust strip with real company logos, bento grid, numbered how-it-works steps, skills showcase popup still opens on click, project cards, engagement cards, comparison table, experience cards, quote card, blog cards, FAQ accordion opens/closes, final CTA. Stop the dev server after confirming (`Ctrl+C`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(home): rebuild homepage with Industrial Grotesk sections"
```

---

## Phase 7: Templates

Per correction #2, hire-page "services" content reuses the bento `FeaturesSection` pattern (same component the homepage uses), parameterized by a per-page `servicePhaseTags` array instead of a separate `ServiceCard`/`ServicesSection`. Per correction #3, there is no `TestimonialsSection` slot in the rewritten template — the one personal quote lives only on the homepage.

### Task 49: Rewrite `HireTemplate.astro`

**Files:**
- Modify: `src/templates/HireTemplate.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { CollectionEntry } from 'astro:content';
import MainLayout from '@/layouts/main-layout.astro';
import HeroSection from '@/components/organisms/sections/HeroSection.astro';
import StatsSection from '@/components/organisms/sections/StatsSection.astro';
import FeaturesSection from '@/components/organisms/sections/FeaturesSection.astro';
import SkillsSection from '@/components/organisms/sections/SkillsSection.astro';
import ProjectsSection from '@/components/organisms/sections/ProjectsSection.astro';
import FAQSection from '@/components/organisms/sections/FAQSection.astro';
import CTASection from '@/components/organisms/sections/CTASection.astro';
import HireNavigationTabs from '@/components/molecules/HireNavigationTabs.astro';
import type { TechMap } from '@/utils/tech-lookup';

interface HeroProps {
  headline: string;
  subheadline?: string;
  description?: string;
  badges?: string[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

interface StatItem {
  value: string;
  suffix?: string;
  label: string;
}

interface ServiceItem {
  title: string;
  description: string;
}

interface FeatureItem {
  title: string;
  description: string;
}

interface SkillCategory {
  name: string;
  skills: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface CTAProps {
  title: string;
  description?: string;
  buttonLabel: string;
  buttonHref: string;
}

interface Props {
  title: string;
  description?: string;
  currentPath: string;
  hero: HeroProps;
  stats: StatItem[];
  services: { title: string; subtitle?: string; items: ServiceItem[] };
  servicePhaseTags: string[];
  features: { title: string; items: FeatureItem[] };
  skills: { title: string; subtitle?: string; categories: SkillCategory[]; techMap: TechMap };
  projects: { title: string; items: CollectionEntry<'projects'>[]; viewAllHref: string; viewAllLabel: string };
  faq: { title: string; items: FAQItem[] };
  cta: CTAProps;
}

const {
  title,
  description,
  currentPath,
  hero,
  stats,
  services,
  servicePhaseTags,
  features,
  skills,
  projects,
  faq,
  cta,
} = Astro.props;

const bentoCards = services.items.map((item, i) => ({
  phase: servicePhaseTags[i] ?? 'Build',
  title: item.title,
  description: item.description,
  span: (i % 2 === 0 ? 5 : 7) as 5 | 7,
}));
---

<MainLayout title={title} description={description}>
  <HireNavigationTabs currentPath={currentPath} />

  <HeroSection
    variant="split"
    headline={hero.headline}
    subheadline={hero.subheadline}
    description={hero.description}
    badges={hero.badges}
    primaryCta={hero.primaryCta}
    secondaryCta={hero.secondaryCta}
  />

  <StatsSection stats={stats} tone="light" />

  <FeaturesSection eyebrow="How I can help" title={services.title} description={services.subtitle} cards={bentoCards} />

  <section class="section-py">
    <div class="container">
      <h2 class="font-display mb-8 text-2xl font-black tracking-tight text-ink uppercase md:text-3xl">{features.title}</h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        {features.items.map(item => (
          <div class="rounded-md border-2 border-ink bg-paper p-6 shadow-hard-sm">
            <h3 class="mb-2 font-bold text-ink">{item.title}</h3>
            <p class="text-graphite text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <SkillsSection eyebrow="Tools" title={skills.title} description={skills.subtitle} categories={skills.categories} techMap={skills.techMap} />

  {projects.items.length > 0 && (
    <ProjectsSection
      title={projects.title}
      projects={projects.items}
      cta={{ label: projects.viewAllLabel, href: projects.viewAllHref }}
    />
  )}

  <FAQSection eyebrow="Before you reach out" title={faq.title} faqs={faq.items} />

  <CTASection title={cta.title} description={cta.description} buttonLabel={cta.buttonLabel} buttonHref={cta.buttonHref} />
</MainLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`
Expected: fails until Tasks 57-60 (the four `/hire/*` pages) pass the new `servicePhaseTags` prop and drop `testimonials`/old prop shapes — confirm the failures are limited to those four page files.

- [ ] **Step 3: Commit**

```bash
git add src/templates/HireTemplate.astro
git commit -m "feat(templates): rebuild HireTemplate with bento services and no testimonials slot"
```

### Task 50: Rewrite `ProjectDetailTemplate.astro`

**Files:**
- Modify: `src/templates/ProjectDetailTemplate.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { CollectionEntry } from 'astro:content';
import MainLayout from '@/layouts/main-layout.astro';
import HeroSection from '@/components/organisms/sections/HeroSection.astro';
import CTASection from '@/components/organisms/sections/CTASection.astro';
import Button from '@/components/atoms/Button.astro';
import Badge from '@/components/atoms/Badge.astro';
import TagList from '@/components/molecules/TagList.astro';
import InfoBox from '@/components/molecules/InfoBox.astro';
import { Image } from 'astro:assets';
import { FaGithub } from '@/lib/icons';
import type { TechMap } from '@/utils/tech-lookup';

interface Props {
  project: CollectionEntry<'projects'>;
  techMap?: TechMap;
  ctaTitle?: string;
  ctaDescription?: string;
}

const {
  project,
  techMap,
  ctaTitle = 'Interested in working together?',
  ctaDescription = "I build high-performance websites with modern Jamstack architecture. Let's discuss your next project.",
} = Astro.props;

const { title, summary, featured, completedOn, liveUrl, repoUrl, technologies, featuredImage } = project.data;

const completionDate = completedOn?.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
---

<MainLayout title={title} description={summary}>
  <article class="mx-auto max-w-screen-lg">
    <nav class="mb-4 px-6">
      <Button href="/projects" variant="ghost-ink" size="sm">Back to Projects</Button>
    </nav>

    <HeroSection variant="minimal" headline={title} description={summary} class="py-4">
      <div class="mt-4 flex flex-wrap items-center gap-3">
        {featured && <Badge label="Featured" variant="phase" size="sm" />}
        {completionDate && <Badge label={completionDate} variant="outline" size="sm" />}
      </div>

      {technologies && technologies.length > 0 && techMap && (
        <TagList tags={technologies.slice(0, 8)} techMap={techMap} class="mt-6" />
      )}

      <div class="mt-8 flex flex-wrap items-center gap-3">
        {liveUrl && <Button href={liveUrl} variant="primary" external>Visit Live Project</Button>}
        {repoUrl && (
          <Button href={repoUrl} variant="ghost-ink" external>
            <FaGithub className="h-4 w-4" /> View Source
          </Button>
        )}
      </div>
    </HeroSection>

    {featuredImage && (
      <div class="mx-6 mt-8 overflow-hidden rounded-md border-2 border-ink shadow-hard">
        <Image src={featuredImage} alt={title} class="h-full w-full object-cover" loading="eager" width={1200} height={630} />
      </div>
    )}

    {project.body && (
      <div class="typography mx-auto max-w-screen-md px-6 py-12">
        <slot />
      </div>
    )}

    <section class="px-6 py-8">
      <InfoBox variant="muted">
        <div class="mb-4 flex items-end justify-between gap-4">
          <h2 class="font-display text-lg font-black text-ink uppercase">Project Details</h2>
          <span class="text-graphite text-sm">Quick facts</span>
        </div>

        <dl class="grid gap-4 md:grid-cols-2">
          {completionDate && (
            <div class="rounded-sm border-2 border-ink bg-paper p-4">
              <dt class="text-graphite mb-1 text-xs font-semibold tracking-wide uppercase">Completion Date</dt>
              <dd class="text-base font-medium text-ink">{completionDate}</dd>
            </div>
          )}
          {liveUrl && (
            <div class="rounded-sm border-2 border-ink bg-paper p-4">
              <dt class="text-graphite mb-1 text-xs font-semibold tracking-wide uppercase">Project URL</dt>
              <dd class="text-base">
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" class="text-signal-deep font-medium break-all underline underline-offset-2">
                  {liveUrl}
                </a>
              </dd>
            </div>
          )}
          {repoUrl && (
            <div class="rounded-sm border-2 border-ink bg-paper p-4 md:col-span-2">
              <dt class="text-graphite mb-1 text-xs font-semibold tracking-wide uppercase">Repository</dt>
              <dd class="text-base">
                <a href={repoUrl} target="_blank" rel="noopener noreferrer" class="text-signal-deep font-medium break-all underline underline-offset-2">
                  {repoUrl}
                </a>
              </dd>
            </div>
          )}
          {technologies && technologies.length > 0 && techMap && (
            <div class="rounded-sm border-2 border-ink bg-paper p-4 md:col-span-2">
              <dt class="text-graphite mb-3 text-xs font-semibold tracking-wide uppercase">Technologies</dt>
              <dd><TagList tags={technologies} techMap={techMap} /></dd>
            </div>
          )}
        </dl>
      </InfoBox>
    </section>

    <CTASection title={ctaTitle} description={ctaDescription} buttonLabel="Get in Touch" buttonHref="/contact" class="mt-8" />
  </article>
</MainLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/templates/ProjectDetailTemplate.astro
git commit -m "feat(templates): rebuild ProjectDetailTemplate with hard-bordered detail cards"
```

### Task 51: Rewrite `BlogPostTemplate.astro`

**Files:**
- Modify: `src/templates/BlogPostTemplate.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import type { CollectionEntry } from 'astro:content';
import MainLayout from '@/layouts/main-layout.astro';
import HeroSection from '@/components/organisms/sections/HeroSection.astro';
import CTASection from '@/components/organisms/sections/CTASection.astro';
import Button from '@/components/atoms/Button.astro';
import TagList from '@/components/molecules/TagList.astro';
import AuthorBio from '@/components/molecules/AuthorBio.astro';
import RelatedPosts from '@/components/molecules/RelatedPosts.astro';
import { formatDate, toISODateString } from '@/utils/date-format';
import type { TechMap } from '@/utils/tech-lookup';

interface Props {
  post: CollectionEntry<'blog'>;
  allPosts?: CollectionEntry<'blog'>[];
  techMap?: TechMap;
  ctaTitle?: string;
  ctaDescription?: string;
}

const {
  post,
  allPosts = [],
  techMap,
  ctaTitle = 'Want to work together?',
  ctaDescription = "I'm available for Jamstack development, headless CMS integration, and frontend architecture consulting.",
} = Astro.props;

const { title, description, publishDate, updatedDate, tags } = post.data;

const publishDateFormatted = publishDate ? formatDate(publishDate, 'long') : '';
const publishDateISO = publishDate ? toISODateString(publishDate) : '';
const updatedDateFormatted = updatedDate ? formatDate(updatedDate, 'long') : '';
const showUpdated = updatedDate && publishDate && updatedDate.getTime() !== publishDate.getTime();
---

<MainLayout title={title} description={description}>
  <article class="mx-auto max-w-screen-md">
    <nav class="mb-4 px-6">
      <Button href="/blog" variant="ghost-ink" size="sm">Back to Blog</Button>
    </nav>

    <HeroSection variant="minimal" headline={title} description={description} class="py-4">
      <div class="text-graphite mt-4 flex flex-wrap items-center gap-3 font-mono text-xs uppercase">
        {publishDate && <time datetime={publishDateISO}>{publishDateFormatted}</time>}
        {showUpdated && (
          <>
            <span>&middot;</span>
            <span>Updated {updatedDateFormatted}</span>
          </>
        )}
      </div>
    </HeroSection>

    <div class="typography px-6 py-8">
      <slot />
    </div>

    {tags && tags.length > 0 && techMap && (
      <section class="border-t-2 border-seam px-6 py-8">
        <p class="mb-4 font-mono text-xs font-bold tracking-[0.1em] text-graphite uppercase">Topics</p>
        <TagList tags={tags} techMap={techMap} linkToTagPage />
      </section>
    )}

    <AuthorBio class="mx-6 my-8" />

    {allPosts.length > 0 && tags && tags.length > 0 && (
      <RelatedPosts currentSlug={post.data.slug} currentTags={tags} posts={allPosts} class="mx-6 my-8" />
    )}

    <CTASection title={ctaTitle} description={ctaDescription} buttonLabel="Get in Touch" buttonHref="/contact" class="mt-8" />
  </article>
</MainLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/templates/BlogPostTemplate.astro
git commit -m "feat(templates): rebuild BlogPostTemplate with restyled prose and related posts"
```

---

## Phase 8: Remaining pages

### Task 52: Rewrite `src/pages/experience.astro`

**Files:**
- Modify: `src/pages/experience.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import MainLayout from '@/layouts/main-layout.astro';
import HeroSection from '@/components/organisms/sections/HeroSection.astro';
import ExperienceSection from '@/components/organisms/sections/ExperienceSection.astro';
import CTASection from '@/components/organisms/sections/CTASection.astro';
import InfoBox from '@/components/molecules/InfoBox.astro';
import ListItem from '@/components/molecules/ListItem.astro';
import { getCollection } from 'astro:content';
import homepageContent from '@/content/site/homepage.json';
import pages from '@/content/site/pages.json';
import cta from '@/content/site/cta.json';

const roles = await getCollection('roles');
const organizations = await getCollection('organizations');
const orgBySlug = new Map(organizations.map(o => [o.data.slug, o]));
const now = Date.now();

const sortedRoles = roles
  .filter(r => r.data.isActive !== false)
  .sort((a, b) => {
    const aCurrent = Boolean(a.data.current);
    const bCurrent = Boolean(b.data.current);
    if (aCurrent && bCurrent) {
      const aDuration = (a.data.endDate?.getTime() ?? now) - a.data.startDate.getTime();
      const bDuration = (b.data.endDate?.getTime() ?? now) - b.data.startDate.getTime();
      if (aDuration !== bDuration) return aDuration - bDuration;
    } else {
      if (aCurrent && !bCurrent) return -1;
      if (!aCurrent && bCurrent) return 1;
    }
    if ((a.data.sortOrder ?? 0) !== (b.data.sortOrder ?? 0)) return (a.data.sortOrder ?? 0) - (b.data.sortOrder ?? 0);
    return b.data.startDate.getTime() - a.data.startDate.getTime();
  });

const yearsOfExperience = new Date().getFullYear() - homepageContent.yearsOfExperienceStartYear;
const experienceSubheading = pages.experience.subheadingTemplate.replaceAll('{yearsOfExperience}', String(yearsOfExperience));
---

<MainLayout title={pages.experience.metaTitle} description={pages.experience.metaDescription}>
  <HeroSection variant="minimal" eyebrow={experienceSubheading} headline={pages.experience.heading} description={pages.experience.intro} />

  <ExperienceSection title={pages.experience.workExperienceTitle} roles={sortedRoles} organizations={orgBySlug} showAllDetails />

  <section class="section-py">
    <div class="container">
      <h2 class="font-display mb-8 text-2xl font-black tracking-tight text-ink uppercase md:text-3xl">
        {pages.experience.careerHighlightsTitle}
      </h2>

      <div class="grid gap-6 md:grid-cols-2">
        <InfoBox title={pages.experience.keyAchievementsTitle}>
          <ul class="space-y-3">
            {roles.flatMap(r => r.data.achievements).slice(0, 6).map(achievement => <ListItem icon="check">{achievement}</ListItem>)}
          </ul>
        </InfoBox>

        <InfoBox title={pages.experience.coreCompetenciesTitle}>
          <ul class="space-y-3">
            {pages.experience.coreCompetencies.map(item => <ListItem icon="check">{item.title}</ListItem>)}
          </ul>
        </InfoBox>
      </div>
    </div>
  </section>

  <CTASection title={cta.title} description={cta.description} buttonLabel={cta.buttonLabel} buttonHref={cta.buttonHref} />
</MainLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

Run: `pnpm dev`, open `/experience`, confirm the role cards render with highlights/achievements/tech tags, career-highlights boxes render, CTA renders. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/experience.astro
git commit -m "feat(experience): rebuild Experience page for Industrial Grotesk"
```

### Task 53: Rewrite `src/pages/contact.astro`

**Files:**
- Modify: `src/pages/contact.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import MainLayout from '@/layouts/main-layout.astro';
import HeroSection from '@/components/organisms/sections/HeroSection.astro';
import InfoBox from '@/components/molecules/InfoBox.astro';
import ListItem from '@/components/molecules/ListItem.astro';
import FormField from '@/components/molecules/FormField.astro';
import Button from '@/components/atoms/Button.astro';
import SocialLinks from '@/components/molecules/SocialLinks.astro';
import pages from '@/content/site/pages.json';
import settings from '@/content/site/settings.json';

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || 'YOUR_TURNSTILE_SITE_KEY';

const projectTypeOptions = [
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'fullstack', label: 'Full-Stack Application' },
  { value: 'website', label: 'Website Development' },
  { value: 'consultation', label: 'Technical Consultation' },
  { value: 'optimization', label: 'Performance Optimization' },
  { value: 'other', label: 'Other' },
];

const budgetOptions = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 - $15,000' },
  { value: '15k-30k', label: '$15,000 - $30,000' },
  { value: '30k-plus', label: '$30,000+' },
  { value: 'discuss', label: "Let's discuss" },
];
---

<MainLayout title={pages.contact.metaTitle} description={pages.contact.metaDescription}>
  <HeroSection variant="minimal" headline={pages.contact.heading} description={pages.contact.intro} />

  <div class="container mb-16 grid gap-12 lg:grid-cols-2">
    <InfoBox title={pages.contact.formTitle}>
      <form id="contact-form" name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="space-y-6">
        <div class="grid gap-6 md:grid-cols-2">
          <FormField label="Full Name" name="name" required placeholder="Your name" />
          <FormField label="Email Address" name="email" type="email" required placeholder="your@email.com" />
        </div>
        <FormField label="Company (Optional)" name="company" placeholder="Your company" />
        <FormField label="Project Type" name="project-type" type="select" options={projectTypeOptions} />
        <FormField label="Budget Range (Optional)" name="budget" type="select" options={budgetOptions} />
        <FormField label="Project Details" name="message" type="textarea" required placeholder="Tell me about your project, timeline, and any specific requirements..." />

        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="bot-field" />
        <div class="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />

        <Button type="submit" variant="primary" fullWidth>Send Message</Button>
      </form>
    </InfoBox>

    <div class="space-y-6">
      <InfoBox title={pages.contact.whyWorkWithMeTitle}>
        <div class="space-y-4">
          {pages.contact.whyWorkWithMeItems.map(item => (
            <div>
              <h4 class="font-bold text-ink">{item.title}</h4>
              <p class="text-graphite text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </InfoBox>

      <InfoBox title={pages.contact.responseTimeTitle}>
        <ul class="space-y-3">
          {pages.contact.responseTimeItems.map(text => <ListItem icon="clock" size="sm">{text}</ListItem>)}
        </ul>
      </InfoBox>

      <InfoBox title={pages.contact.readyToStartTitle} variant="muted">
        <p class="text-graphite mb-4 text-sm">{pages.contact.readyToStartDescription}</p>
        <div class="flex flex-wrap gap-3">
          <Button href="/projects" variant="ghost-ink" size="sm">{pages.contact.readyLinks.viewProjectsLabel}</Button>
          <Button href="/experience" variant="ghost-ink" size="sm">{pages.contact.readyLinks.viewExperienceLabel}</Button>
        </div>
      </InfoBox>
    </div>
  </div>

  <section class="container mb-16 rounded-md border-2 border-ink bg-ink p-8 text-center text-concrete">
    <h2 class="font-display mb-4 text-2xl font-black uppercase">{pages.contact.hireCta.title}</h2>
    <p class="text-steel mx-auto mb-6 max-w-2xl">{pages.contact.hireCta.description}</p>
    <Button href={pages.contact.hireCta.buttonHref} variant="primary" size="lg">{pages.contact.hireCta.buttonLabel}</Button>
  </section>

  <section class="container mb-16 rounded-md border-2 border-ink bg-concrete-2 p-8 text-center">
    <h2 class="font-display mb-4 text-2xl font-black text-ink uppercase">{pages.contact.socialSectionTitle}</h2>
    <p class="text-graphite mx-auto mb-6 max-w-2xl">{pages.contact.socialSectionDescription}</p>
    {settings.author.socialLinks && (
      <div class="flex justify-center">
        <SocialLinks links={settings.author.socialLinks} tone="light" />
      </div>
    )}
  </section>

  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</MainLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

Run: `pnpm dev`, open `/contact`, confirm the form renders with hard-bordered inputs, both info sections render, hire CTA and social sections render. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat(contact): rebuild Contact page with FormField molecule"
```

### Task 54: Rewrite `src/pages/projects/index.astro`

**Files:**
- Modify: `src/pages/projects/index.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import MainLayout from '@/layouts/main-layout.astro';
import HeroSection from '@/components/organisms/sections/HeroSection.astro';
import ProjectsSection from '@/components/organisms/sections/ProjectsSection.astro';
import CTASection from '@/components/organisms/sections/CTASection.astro';
import { getCollection } from 'astro:content';
import pages from '@/content/site/pages.json';
import cta from '@/content/site/cta.json';

const projects = await getCollection('projects');

const sortedProjects = projects
  .filter(project => project.data.isActive)
  .sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    if ((a.data.sortOrder ?? 0) !== (b.data.sortOrder ?? 0)) return (a.data.sortOrder ?? 0) - (b.data.sortOrder ?? 0);
    const aDate = a.data.completedOn ? new Date(a.data.completedOn).getTime() : 0;
    const bDate = b.data.completedOn ? new Date(b.data.completedOn).getTime() : 0;
    return bDate - aDate;
  });
---

<MainLayout title={pages.projectsIndex.metaTitle} description={pages.projectsIndex.metaDescription}>
  <HeroSection variant="minimal" headline={pages.projectsIndex.heading} description={pages.projectsIndex.intro} />

  {sortedProjects.length > 0 ? (
    <ProjectsSection projects={sortedProjects} columns={3} showCompletedDate class="pt-0" />
  ) : (
    <div class="container py-12 text-center">
      <p class="text-graphite">{pages.projectsIndex.emptyState}</p>
    </div>
  )}

  <CTASection title={cta.title} description={cta.description} buttonLabel={cta.buttonLabel} buttonHref={cta.buttonHref} />
</MainLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

Run: `pnpm dev`, open `/projects`, confirm the 3-column project grid and CTA render. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects/index.astro
git commit -m "feat(projects): rebuild Projects index page for Industrial Grotesk"
```

### Task 55: Rewrite `src/pages/blog/index.astro`

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import MainLayout from '@/layouts/main-layout.astro';
import HeroSection from '@/components/organisms/sections/HeroSection.astro';
import BlogSection from '@/components/organisms/sections/BlogSection.astro';
import CTASection from '@/components/organisms/sections/CTASection.astro';
import { getCollection } from 'astro:content';
import { createTechMap } from '@/utils/tech-lookup';
import pages from '@/content/site/pages.json';
import cta from '@/content/site/cta.json';

const posts = await getCollection('blog');
const technologies = await getCollection('technologies');
const techMap = createTechMap(technologies);
const currentDate = new Date();

const postsToShow = posts
  .filter(post => post.data.publishDate !== null)
  .filter(post => post.data.publishDate! <= currentDate)
  .sort((a, b) => b.data.publishDate!.getTime() - a.data.publishDate!.getTime());
---

<MainLayout title={pages.blogIndex.metaTitle} description={pages.blogIndex.metaDescription}>
  <HeroSection variant="minimal" headline={pages.blogIndex.heading} description={pages.blogIndex.intro} />

  {postsToShow.length > 0 ? (
    <BlogSection posts={postsToShow} techMap={techMap} showTags class="pt-0" />
  ) : (
    <div class="container py-12 text-center">
      <p class="text-graphite">{pages.blogIndex.emptyState}</p>
    </div>
  )}

  <CTASection title={cta.title} description={cta.description} buttonLabel={cta.buttonLabel} buttonHref={cta.buttonHref} />
</MainLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

Run: `pnpm dev`, open `/blog`, confirm the post grid and CTA render. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "feat(blog): rebuild Blog index page for Industrial Grotesk"
```

### Task 56: Rewrite `src/pages/blog/tag/[tag].astro`

**Files:**
- Modify: `src/pages/blog/tag/[tag].astro`

- [ ] **Step 1: Replace file contents**

```astro
---
import MainLayout from '@/layouts/main-layout.astro';
import HeroSection from '@/components/organisms/sections/HeroSection.astro';
import BlogSection from '@/components/organisms/sections/BlogSection.astro';
import CTASection from '@/components/organisms/sections/CTASection.astro';
import Button from '@/components/atoms/Button.astro';
import { getCollection } from 'astro:content';
import { createTechMap } from '@/utils/tech-lookup';
import cta from '@/content/site/cta.json';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  const technologies = await getCollection('technologies');
  const techMap = createTechMap(technologies);

  const allTags = new Set<string>();
  posts.forEach(post => post.data.tags?.forEach(tag => allTags.add(tag)));

  return Array.from(allTags).map(tag => ({
    params: { tag },
    props: { tag, techMapObj: Object.fromEntries(techMap) },
  }));
}

const { tag, techMapObj } = Astro.props;

const posts = await getCollection('blog');
const technologies = await getCollection('technologies');
const techMap = createTechMap(technologies);
const currentDate = new Date();

const taggedPosts = posts
  .filter(post => post.data.publishDate !== null)
  .filter(post => post.data.publishDate! <= currentDate)
  .filter(post => post.data.tags?.includes(tag))
  .sort((a, b) => b.data.publishDate!.getTime() - a.data.publishDate!.getTime());

const tagInfo = techMap.get(tag);
const tagDisplayName = tagInfo || tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const metaTitle = `${tagDisplayName} Articles | Aaron Molina`;
const metaDescription = `Read my articles about ${tagDisplayName}. Insights and tutorials from a senior Jamstack developer with 14+ years of experience.`;
---

<MainLayout title={metaTitle} description={metaDescription}>
  <nav class="container mb-4 pt-6">
    <Button href="/blog" variant="ghost-ink" size="sm">Back to Blog</Button>
  </nav>

  <HeroSection
    variant="minimal"
    headline={tagDisplayName}
    description={`${taggedPosts.length} article${taggedPosts.length !== 1 ? 's' : ''} tagged with ${tagDisplayName.toLowerCase()}`}
  />

  {taggedPosts.length > 0 ? (
    <BlogSection posts={taggedPosts} techMap={techMap} showTags class="pt-0" />
  ) : (
    <div class="container py-12 text-center">
      <p class="text-graphite">No posts found with this tag.</p>
    </div>
  )}

  <CTASection title={cta.title} description={cta.description} buttonLabel={cta.buttonLabel} buttonHref={cta.buttonHref} />
</MainLayout>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

Run: `pnpm dev`, open `/blog/tag/react` (or any real tag from the blog content), confirm the filtered post grid renders. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/tag/[tag].astro
git commit -m "feat(blog): rebuild Blog tag page for Industrial Grotesk"
```

### Task 57: Rewrite `src/pages/hire/index.astro` to use `HireTemplate`

**Files:**
- Modify: `src/pages/hire/index.astro`

The current file is hand-built (hardcoded `serviceOfferings`, `TechShowcase`/`TechShowcaseMobile`) and ignores the `hireContent.main` block that already exists in `hire.json` for exactly this page. Rewriting it onto `HireTemplate` — the same template the other three `/hire/*` pages use — removes that duplication and the two `TechShowcase` components entirely (deleted in Task 65).

- [ ] **Step 1: Replace file contents**

```astro
---
import { HireTemplate } from '@/templates';
import { getCollection } from 'astro:content';
import { createTechMap } from '@/utils/tech-lookup';
import hireContent from '@/content/site/hire.json';

const technologies = await getCollection('technologies');
const techMap = createTechMap(technologies);
const projects = await getCollection('projects');

const featuredProjects = projects
  .filter(p => p.data.isActive !== false)
  .sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return (a.data.sortOrder ?? 0) - (b.data.sortOrder ?? 0);
  })
  .slice(0, 6);

const yearsOfExperience = new Date().getFullYear() - hireContent.yearsOfExperienceStartYear;
const heroDescription = hireContent.main.hero.description.replace('{yearsOfExperience}', String(yearsOfExperience));

const stats = hireContent.shared.stats.map(stat => ({
  ...stat,
  value: String(stat.value).replace('{yearsOfExperience}', String(yearsOfExperience)),
}));
---

<HireTemplate
  title={hireContent.main.meta.title}
  description={hireContent.main.meta.description}
  currentPath="/hire"
  hero={{
    headline: hireContent.main.hero.headline,
    subheadline: hireContent.main.hero.subheadline,
    description: heroDescription,
    badges: hireContent.main.hero.badges,
    primaryCta: hireContent.main.hero.primaryCta,
    secondaryCta: hireContent.main.hero.secondaryCta,
  }}
  stats={stats}
  services={{
    title: hireContent.main.services.title,
    subtitle: hireContent.main.services.subtitle,
    items: hireContent.main.services.items,
  }}
  servicePhaseTags={['Build', 'Integrate', 'Assist', 'Architect']}
  features={{ title: hireContent.main.features.title, items: hireContent.main.features.items }}
  skills={{
    title: hireContent.main.skills.title,
    subtitle: hireContent.main.skills.subtitle,
    categories: hireContent.main.skills.categories,
    techMap,
  }}
  projects={{
    title: hireContent.main.projects.title,
    items: featuredProjects,
    viewAllHref: hireContent.main.projects.viewAllHref,
    viewAllLabel: hireContent.main.projects.viewAllLabel,
  }}
  faq={{ title: 'Frequently Asked Questions', items: hireContent.shared.faq }}
  cta={hireContent.shared.cta}
/>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

Run: `pnpm dev`, open `/hire`, confirm the hero, stats, bento services, "why choose me" grid, skills, projects, FAQ, and CTA all render, and the `HireNavigationTabs` row at the top highlights "Overview". Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/hire/index.astro
git commit -m "feat(hire): rebuild Hire overview page on HireTemplate, drop bespoke TechShowcase usage"
```

### Task 58: Update `src/pages/hire/react-developer.astro`

**Files:**
- Modify: `src/pages/hire/react-developer.astro`

- [ ] **Step 1: Add `servicePhaseTags` and drop the removed `testimonials`/`faq.subtitle` shape**

The frontmatter (imports, data fetching, `yearsOfExperience`/`heroDescription`/`stats` computation) is unchanged. Only the `<HireTemplate ... />` invocation changes — add `servicePhaseTags` and keep `faq` as `{ title, items }` (drop the `subtitle` field, which the rebuilt `HireTemplate`/`FAQSection` no longer accept):

```astro
<HireTemplate
  title={hireContent.react.meta.title}
  description={hireContent.react.meta.description}
  currentPath="/hire/react-developer"
  hero={{
    headline: hireContent.react.hero.headline,
    subheadline: hireContent.react.hero.subheadline,
    description: heroDescription,
    badges: hireContent.react.hero.badges,
    primaryCta: hireContent.react.hero.primaryCta,
    secondaryCta: hireContent.react.hero.secondaryCta,
  }}
  stats={stats}
  services={{
    title: hireContent.react.services.title,
    subtitle: hireContent.react.services.subtitle,
    items: hireContent.react.services.items,
  }}
  servicePhaseTags={['Build', 'Extend', 'Architect', 'Optimize']}
  features={{
    title: hireContent.react.features.title,
    items: hireContent.react.features.items,
  }}
  skills={{
    title: hireContent.react.skills.title,
    subtitle: hireContent.react.skills.subtitle,
    categories: hireContent.react.skills.categories,
    techMap: techMap,
  }}
  projects={{
    title: "React Projects",
    items: reactProjects,
    viewAllHref: "/projects",
    viewAllLabel: "View all projects",
  }}
  faq={{
    title: "Frequently Asked Questions",
    items: hireContent.shared.faq,
  }}
  cta={hireContent.shared.cta}
/>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

Run: `pnpm dev`, open `/hire/react-developer`, confirm it renders correctly and the "React" tab is highlighted in `HireNavigationTabs`. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/hire/react-developer.astro
git commit -m "fix(hire): add servicePhaseTags prop for rebuilt HireTemplate"
```

### Task 59: Update `src/pages/hire/nextjs-developer.astro`

**Files:**
- Modify: `src/pages/hire/nextjs-developer.astro`

- [ ] **Step 1: Replace the `<HireTemplate>` invocation**

The frontmatter (imports, `nextjsProjects` filter, `yearsOfExperience`/`heroDescription`/`stats` computation) is unchanged. Replace only the template call at the bottom of the file:

```astro
<HireTemplate
  title={hireContent.nextjs.meta.title}
  description={hireContent.nextjs.meta.description}
  currentPath="/hire/nextjs-developer"
  hero={{
    headline: hireContent.nextjs.hero.headline,
    subheadline: hireContent.nextjs.hero.subheadline,
    description: heroDescription,
    badges: hireContent.nextjs.hero.badges,
    primaryCta: hireContent.nextjs.hero.primaryCta,
    secondaryCta: hireContent.nextjs.hero.secondaryCta,
  }}
  stats={stats}
  services={{
    title: hireContent.nextjs.services.title,
    subtitle: hireContent.nextjs.services.subtitle,
    items: hireContent.nextjs.services.items,
  }}
  servicePhaseTags={['Build', 'Integrate', 'Assist', 'Ship']}
  features={{
    title: hireContent.nextjs.features.title,
    items: hireContent.nextjs.features.items,
  }}
  skills={{
    title: hireContent.nextjs.skills.title,
    subtitle: hireContent.nextjs.skills.subtitle,
    categories: hireContent.nextjs.skills.categories,
    techMap: techMap,
  }}
  projects={{
    title: "Next.js Projects",
    items: nextjsProjects,
    viewAllHref: "/projects",
    viewAllLabel: "View all projects",
  }}
  faq={{
    title: "Frequently Asked Questions",
    items: hireContent.shared.faq,
  }}
  cta={hireContent.shared.cta}
/>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

Run: `pnpm dev`, open `/hire/nextjs-developer`, confirm it renders correctly and the "Next.js" tab is highlighted in `HireNavigationTabs`. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/hire/nextjs-developer.astro
git commit -m "fix(hire): add servicePhaseTags prop for rebuilt HireTemplate"
```

### Task 60: Update `src/pages/hire/headless-cms.astro`

**Files:**
- Modify: `src/pages/hire/headless-cms.astro`

- [ ] **Step 1: Replace the `<HireTemplate>` invocation**

The frontmatter (imports, `cmsProjects` filter, `yearsOfExperience`/`stats` computation) is unchanged. Replace only the template call at the bottom of the file:

```astro
<HireTemplate
  title={hireContent.headlessCms.meta.title}
  description={hireContent.headlessCms.meta.description}
  currentPath="/hire/headless-cms"
  hero={{
    headline: hireContent.headlessCms.hero.headline,
    subheadline: hireContent.headlessCms.hero.subheadline,
    description: hireContent.headlessCms.hero.description,
    badges: hireContent.headlessCms.hero.badges,
    primaryCta: hireContent.headlessCms.hero.primaryCta,
    secondaryCta: hireContent.headlessCms.hero.secondaryCta,
  }}
  stats={stats}
  services={{
    title: hireContent.headlessCms.services.title,
    subtitle: hireContent.headlessCms.services.subtitle,
    items: hireContent.headlessCms.services.items,
  }}
  servicePhaseTags={['Build', 'Migrate', 'Extend', 'Scale']}
  features={{
    title: hireContent.headlessCms.features.title,
    items: hireContent.headlessCms.features.items,
  }}
  skills={{
    title: hireContent.headlessCms.skills.title,
    subtitle: hireContent.headlessCms.skills.subtitle,
    categories: hireContent.headlessCms.skills.categories,
    techMap: techMap,
  }}
  projects={{
    title: "Headless CMS Projects",
    items: cmsProjects,
    viewAllHref: "/projects",
    viewAllLabel: "View all projects",
  }}
  faq={{
    title: "Frequently Asked Questions",
    items: hireContent.shared.faq,
  }}
  cta={hireContent.shared.cta}
/>
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

Run: `pnpm dev`, open `/hire/headless-cms`, confirm it renders correctly and the "Headless CMS" tab is highlighted in `HireNavigationTabs`. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/pages/hire/headless-cms.astro
git commit -m "fix(hire): add servicePhaseTags prop for rebuilt HireTemplate"
```

---

## Phase 9: AI portfolio chat restyle (visual only — no logic changes)

The five files below currently use the *old* Tailwind semantic tokens (`border-border`, `bg-card`, `bg-primary`, `text-muted-foreground`, etc.) which no longer resolve to anything meaningful once `global.css` is replaced in Task 1 (Tailwind silently drops unknown utility classes rather than erroring, so the site still builds — it just renders unstyled). Each task below is a full-file className rewrite onto the new tokens; no state, effect, or handler logic changes.

### Task 61: Restyle `PortfolioChat.tsx`

**Files:**
- Modify: `src/components/organisms/ai-portfolio-chat/PortfolioChat.tsx`

- [ ] **Step 1: Replace file contents**

```tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import SuggestedPrompts from './SuggestedPrompts';
import LeadCaptureModal from './LeadCaptureModal';
import SystemPromptModal from './SystemPromptModal';
import type { ChatMessage as ChatMessageType, LeadFlag, StreamEvent } from './types';

const MAX_USER_TURNS = 10;
const MAX_INPUT_LENGTH = 1000;

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Root chat island. Owns conversation state, streams responses from
 * `/api/chat`, parses SSE events, and renders messages, suggested prompts,
 * and the lead-capture flow.
 */
export default function PortfolioChat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<LeadFlag | null>(null);
  const [promptOpen, setPromptOpen] = useState(false);

  const conversationIdRef = useRef<string>(makeId());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const userTurnsUsed = messages.filter(m => m.role === 'user').length;
  const limitReached = userTurnsUsed >= MAX_USER_TURNS;

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming || limitReached) return;

      setError(null);

      const userMsg: ChatMessageType = {
        id: makeId(),
        role: 'user',
        content: trimmed.slice(0, MAX_INPUT_LENGTH),
      };
      const assistantId = makeId();
      const assistantMsg: ChatMessageType = {
        id: assistantId,
        role: 'assistant',
        content: '',
      };

      const nextMessages = [...messages, userMsg, assistantMsg];
      setMessages(nextMessages);
      setInput('');
      setStreaming(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId: conversationIdRef.current,
            messages: [...messages, userMsg].map(m => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error || 'Chat is unavailable. Please try again later.');
          setMessages(prev => prev.filter(m => m.id !== assistantId));
          return;
        }
        if (!res.body) {
          setError('Streaming not supported in this browser.');
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const raw of events) {
            const line = raw.trim();
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (!payload) continue;
            let event: StreamEvent;
            try {
              event = JSON.parse(payload) as StreamEvent;
            } catch {
              continue;
            }

            if (event.type === 'text_delta') {
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId ? { ...m, content: m.content + event.text } : m,
                ),
              );
            } else if (event.type === 'lead_flag') {
              setMessages(prev =>
                prev.map(m => (m.id === assistantId ? { ...m, leadFlag: event.data } : m)),
              );
            } else if (event.type === 'error') {
              setError(event.message);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError('Connection lost. Please try again.');
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming, limitReached],
  );

  function handleForward(flag: LeadFlag) {
    setActiveLead(flag);
    setLeadOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="overflow-hidden rounded-md border-2 border-ink bg-paper shadow-hard">
        <div className="flex items-center justify-between border-b-2 border-ink bg-concrete-2 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-signal" aria-hidden />
            <p className="font-mono text-xs font-bold uppercase tracking-wide text-ink">Ask my portfolio anything</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-graphite">
            <span>Powered by Claude</span>
            <button
              type="button"
              onClick={() => setPromptOpen(true)}
              className="font-semibold text-signal-deep underline-offset-2 hover:underline"
            >
              See system prompt
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="max-h-[420px] min-h-[280px] space-y-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-graphite">
                Hi, I'm Aaron's portfolio assistant. Ask about his projects, experience, stack, or availability.
              </p>
              <SuggestedPrompts onPick={prompt => sendMessage(prompt)} />
            </div>
          ) : (
            messages.map(m => <ChatMessage key={m.id} message={m} onForward={handleForward} />)
          )}
          {error && (
            <p className="rounded-sm border-2 border-amber bg-amber/10 p-3 text-sm text-ink">{error}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t-2 border-ink bg-concrete p-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              limitReached
                ? 'Conversation limit reached. Email aaron@pagelyft.studio.'
                : 'Type your question...'
            }
            disabled={streaming || limitReached}
            maxLength={MAX_INPUT_LENGTH}
            className="flex-1 rounded-sm border-2 border-ink bg-paper px-4 py-2 text-sm text-ink placeholder:text-graphite focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={streaming || limitReached || !input.trim()}
            className="rounded-sm border-2 border-ink bg-signal px-5 py-2 text-sm font-bold text-ink shadow-hard-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {streaming ? '...' : 'Send'}
          </button>
        </form>
      </div>

      <LeadCaptureModal
        open={leadOpen}
        flag={activeLead}
        conversationId={conversationIdRef.current}
        onClose={() => setLeadOpen(false)}
        onSubmitted={() => {
          setActiveLead(null);
        }}
      />

      <SystemPromptModal open={promptOpen} onClose={() => setPromptOpen(false)} />
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/ai-portfolio-chat/PortfolioChat.tsx
git commit -m "style(chat): restyle PortfolioChat container for Industrial Grotesk"
```

### Task 62: Restyle `ChatMessage.tsx` and `SuggestedPrompts.tsx`

**Files:**
- Modify: `src/components/organisms/ai-portfolio-chat/ChatMessage.tsx`
- Modify: `src/components/organisms/ai-portfolio-chat/SuggestedPrompts.tsx`

- [ ] **Step 1: Replace `ChatMessage.tsx` contents**

```tsx
import type { ChatMessage as ChatMessageType, LeadFlag } from './types';

interface Props {
  message: ChatMessageType;
  onForward?: (flag: LeadFlag) => void;
}

const REASON_LABEL: Record<LeadFlag['reason'], string> = {
  hiring: 'Hiring inquiry',
  rates: 'Rates question',
  scope: 'Scope discussion',
  out_of_scope: 'Outside the bot\'s knowledge',
};

/**
 * Single chat bubble. Streams text incrementally and renders
 * an inline "Email Aaron about this" button when a lead flag is attached.
 */
export default function ChatMessage({ message, onForward }: Props) {
  const isUser = message.role === 'user';
  const flag = message.leadFlag;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-sm border-2 border-ink px-4 py-3 shadow-hard-sm ${
          isUser ? 'bg-signal text-ink' : 'bg-paper text-ink'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
          {message.content === '' && !isUser && (
            <span className="inline-block animate-pulse text-graphite">...</span>
          )}
        </p>
        {flag && onForward && (
          <div className="mt-3 rounded-sm border border-ink bg-concrete p-3">
            <p className="font-mono text-xs font-semibold uppercase tracking-wide text-graphite">
              {REASON_LABEL[flag.reason]}
            </p>
            <button
              type="button"
              onClick={() => onForward(flag)}
              className="mt-2 inline-flex items-center gap-2 rounded-sm border-2 border-ink bg-ink px-4 py-1.5 text-sm font-bold text-signal shadow-hard-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Email Aaron about this
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace `SuggestedPrompts.tsx` contents**

```tsx
interface Props {
  onPick: (prompt: string) => void;
}

const PROMPTS = [
  'What did you ship for the LA Clippers?',
  'Tell me about TypeLyft',
  'Are you available for contract work?',
  "What's your stack?",
];

/**
 * Suggested-prompt chips shown when the conversation is empty.
 * Clicking a chip prefills and submits the input.
 */
export default function SuggestedPrompts({ onPick }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {PROMPTS.map(prompt => (
        <button
          key={prompt}
          type="button"
          onClick={() => onPick(prompt)}
          className="rounded-sm border-2 border-ink bg-paper px-4 py-2 text-sm font-semibold text-ink shadow-hard-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-ink)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0_var(--color-ink)]"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/ai-portfolio-chat/ChatMessage.tsx src/components/organisms/ai-portfolio-chat/SuggestedPrompts.tsx
git commit -m "style(chat): restyle ChatMessage bubbles and SuggestedPrompts chips"
```

### Task 63: Restyle `LeadCaptureModal.tsx` and `SystemPromptModal.tsx`

**Files:**
- Modify: `src/components/organisms/ai-portfolio-chat/LeadCaptureModal.tsx`
- Modify: `src/components/organisms/ai-portfolio-chat/SystemPromptModal.tsx`

- [ ] **Step 1: Replace `LeadCaptureModal.tsx` contents**

```tsx
import { useState } from 'react';
import type { LeadFlag } from './types';

interface Props {
  open: boolean;
  flag: LeadFlag | null;
  conversationId: string;
  onClose: () => void;
  onSubmitted: () => void;
}

/**
 * Modal that pre-fills subject and body from the flag_lead tool call,
 * collects the visitor's email, and posts to /api/lead.
 */
export default function LeadCaptureModal({ open, flag, conversationId, onClose, onSubmitted }: Props) {
  const [visitorEmail, setVisitorEmail] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [subject, setSubject] = useState(flag?.suggested_email_subject ?? '');
  const [body, setBody] = useState(flag?.suggested_email_body ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!open || !flag) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorEmail,
          visitorName: visitorName || undefined,
          subject,
          body,
          conversationId,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data?.error || 'Could not send. Please email aaron@pagelyft.studio directly.');
        setStatus('error');
      } else {
        setStatus('success');
        setTimeout(() => {
          onSubmitted();
          onClose();
        }, 1500);
      }
    } catch {
      setErrorMessage('Could not send. Please email aaron@pagelyft.studio directly.');
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md border-2 border-ink bg-paper p-6 shadow-hard"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-display text-xl font-black uppercase text-ink">Forward to Aaron</h2>
          <button type="button" onClick={onClose} className="rounded-sm p-1 text-graphite hover:bg-concrete-2" aria-label="Close">
            &times;
          </button>
        </div>

        {status === 'success' ? (
          <div className="rounded-sm border-2 border-ink bg-signal p-4">
            <p className="font-semibold text-ink">Sent. Aaron will be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Your name (optional)</label>
              <input
                type="text"
                value={visitorName}
                onChange={e => setVisitorName(e.target.value)}
                className="w-full rounded-sm border-2 border-ink bg-concrete px-3 py-2 text-sm text-ink focus:outline-none"
                maxLength={120}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Your email</label>
              <input
                type="email"
                required
                value={visitorEmail}
                onChange={e => setVisitorEmail(e.target.value)}
                className="w-full rounded-sm border-2 border-ink bg-concrete px-3 py-2 text-sm text-ink focus:outline-none"
                maxLength={254}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full rounded-sm border-2 border-ink bg-concrete px-3 py-2 text-sm text-ink focus:outline-none"
                maxLength={200}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink">Message</label>
              <textarea
                required
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={6}
                className="w-full rounded-sm border-2 border-ink bg-concrete px-3 py-2 text-sm text-ink focus:outline-none"
                maxLength={4000}
              />
            </div>
            {status === 'error' && <p className="text-sm text-ink">{errorMessage}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm border-2 border-ink bg-paper px-4 py-2 text-sm font-semibold text-ink shadow-hard-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-sm border-2 border-ink bg-signal px-4 py-2 text-sm font-bold text-ink shadow-hard-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50"
              >
                {submitting ? 'Sending...' : 'Send to Aaron'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace `SystemPromptModal.tsx` contents**

```tsx
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

type PreviewData = {
  systemPrompt: string;
  tools: unknown[];
};

/**
 * Transparency modal showing the system prompt and tool spec used by the chat
 * function. Demonstrates auditable AI to recruiters and prospective clients.
 */
export default function SystemPromptModal({ open, onClose }: Props) {
  const [data, setData] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || data) return;
    fetch('/api/system-prompt-preview.json')
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setData)
      .catch(() => setError('Could not load preview.'));
  }, [open, data]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-md border-2 border-ink bg-paper shadow-hard"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b-2 border-ink p-4">
          <div>
            <h2 className="font-display text-xl font-black uppercase text-ink">System prompt</h2>
            <p className="text-sm text-graphite">The exact instructions and tools sent to Claude for every chat.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-sm p-1 text-graphite hover:bg-concrete-2" aria-label="Close">
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {error ? (
            <p className="text-sm text-ink">{error}</p>
          ) : !data ? (
            <p className="text-sm text-graphite">Loading...</p>
          ) : (
            <>
              <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-graphite">System prompt</h3>
              <pre className="mb-6 overflow-x-auto rounded-sm border-2 border-ink bg-concrete p-3 text-xs leading-relaxed text-ink">
                {data.systemPrompt}
              </pre>
              <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-wide text-graphite">Tools</h3>
              <pre className="overflow-x-auto rounded-sm border-2 border-ink bg-concrete p-3 text-xs leading-relaxed text-ink">
                {JSON.stringify(data.tools, null, 2)}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `pnpm exec astro check`

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/ai-portfolio-chat/LeadCaptureModal.tsx src/components/organisms/ai-portfolio-chat/SystemPromptModal.tsx
git commit -m "style(chat): restyle LeadCaptureModal and SystemPromptModal"
```

---

## Phase 10: SkillsShowcase restyle (visual only)

Per correction #4, `SkillsShowcase.tsx` keeps every piece of its existing behavior — the scattered icon grid, click-to-reveal popup, video-game health bar (red→green `COLOR_RAMP`, unchanged since it's a meaningful proficiency signal, not decorative chrome), and the star-burst/floating-star sparkle effects. Only styling changes: old `var(--surface)`/`var(--border)`/`var(--shadow-color)`/`var(--foreground)`/`var(--foreground-muted)`/`var(--muted)`/`var(--tactile-purple-mid)`/`var(--tactile-coral-mid)` references become the new tokens, border/radius sizes shrink to match the new 2px/hard-shadow system, and the rainbow purple/orange/cyan "mastered" glow becomes a two-tone signal-green + amber glow (dropping the two `hue-rotate` GSAP tweens, since rotating hue away from green no longer fits a two-accent palette — everything else in the two `useEffect` glow blocks is unchanged).

### Task 64: Restyle `SkillsShowcase.tsx`

**Files:**
- Modify: `src/components/organisms/sections/SkillsShowcase.tsx`

- [ ] **Step 1: Replace file contents**

```tsx
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

    const side = Math.floor(Math.random() * 4);
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
      }
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
        }
      );
    }

    if (activeSkill.level === 10 && popupRef.current) {
      const popup = popupRef.current;
      const glowLayer = popup.querySelector('.popup-glow-layer') as HTMLElement;

      gsap.to(popup, {
        boxShadow:
          '0 0 25px 5px oklch(87% 0.23 135 / 0.55), 0 0 50px 10px oklch(80% 0.16 75 / 0.3), 0 8px 0 0 var(--color-ink)',
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
        <div className="mb-10 text-center">
          <h2 className="font-display mb-3 text-3xl font-black uppercase tracking-tight text-ink md:text-4xl lg:text-5xl">
            Skills I Know
          </h2>
          <p className="mx-auto max-w-2xl text-base text-graphite md:text-lg">
            Over a decade of hands-on experience across the modern web stack.
            Click any skill to see my proficiency and the projects where I put it to work.
          </p>
        </div>

        <div
          ref={containerRef}
          className="mx-auto flex max-w-5xl flex-wrap justify-center gap-4 md:gap-5 lg:gap-6"
        >
          {skills.map(skill => {
            const isExpert = skill.level === 10;
            const isConcept = CONCEPT_SKILLS.has(skill.slug);

            return (
              <button
                key={skill.slug}
                onClick={() => setActiveSkill(skill)}
                className="skill-icon group relative flex h-16 w-16 items-center justify-center rounded-md border-2 border-ink bg-paper transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none md:h-20 md:w-20"
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
                        className="star-particle absolute text-amber"
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
                  <span className="font-mono text-xs font-black uppercase tracking-tight text-ink md:text-sm">
                    {CONCEPT_LABELS[skill.slug] || skill.name.slice(0, 3)}
                  </span>
                ) : (
                  <img
                    src={`${LOGO_BASE}${skill.logoPath}`}
                    alt={skill.name}
                    className="h-8 w-8 object-contain md:h-10 md:w-10"
                    loading="lazy"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeSkill && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
          onClick={e => {
            if (e.target === e.currentTarget) closePopup();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeSkill.name} skill details`}
        >
          <div
            ref={popupRef}
            className="relative w-full max-w-md overflow-visible rounded-md border-2 border-ink bg-paper p-6 md:p-8"
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
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-xs border-2 border-ink bg-concrete-2 text-lg font-bold text-graphite transition-colors"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="mb-6 flex items-center gap-4">
              <div
                className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md border-2 border-ink bg-concrete-2"
                style={{ boxShadow: '0 3px 0 0 var(--color-ink)' }}
              >
                {CONCEPT_SKILLS.has(activeSkill.slug) ? (
                  <span className="font-mono text-sm font-black uppercase text-ink">
                    {CONCEPT_LABELS[activeSkill.slug] || activeSkill.name.slice(0, 3)}
                  </span>
                ) : (
                  <img src={`${LOGO_BASE}${activeSkill.logoPath}`} alt={activeSkill.name} className="h-10 w-10 object-contain" />
                )}
              </div>
              <div>
                <h3 className="font-display text-xl font-black uppercase text-ink md:text-2xl">{activeSkill.name}</h3>
                <p className="font-mono text-sm font-bold uppercase tracking-wider text-graphite">
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
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-graphite">Proficiency</span>
                <span className="font-display text-sm font-black tabular-nums text-ink">{activeSkill.level}/10</span>
              </div>

              <div ref={healthBarWrapRef} className="relative">
                <div
                  className="relative h-6 overflow-hidden rounded-xs border-2 border-ink bg-concrete-2"
                  style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}
                >
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
                <h4 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-graphite">Projects</h4>
                <div className="flex flex-wrap gap-2">
                  {activeSkill.projects.map(project => (
                    <span
                      key={project.slug}
                      className="inline-flex items-center rounded-xs border-2 border-ink bg-concrete-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ink"
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
                className="mt-5 flex items-center justify-center gap-3 rounded-sm border-2 border-ink px-5 py-3 text-center"
                style={{ background: 'linear-gradient(135deg, var(--color-ink), var(--color-signal-deep))', boxShadow: '0 4px 0 0 var(--color-ink)' }}
              >
                <span className="text-xl text-amber drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">&#10022;</span>
                <span className="font-mono text-sm font-black uppercase tracking-widest text-concrete" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  Mastered
                </span>
                <span className="text-xl text-amber drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">&#10022;</span>
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
```

- [ ] **Step 2: Verify**

Run: `pnpm exec astro check`

Run: `pnpm dev`, open `/`, scroll to the skills showcase, click a skill icon, confirm the popup opens with the health bar animating and (for a 10/10 skill, if one exists in the featured technologies) the signal/amber glow and star sparkle effects still play. Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/sections/SkillsShowcase.tsx
git commit -m "style(skills): restyle SkillsShowcase for Industrial Grotesk, drop rainbow hue-rotate glow"
```

---

## Phase 11: Animation wiring

### Task 65: Extend `animations.ts`, wire section-reveal into the layout

**Files:**
- Modify: `src/lib/animations.ts`
- Modify: `src/layouts/main-layout.astro`

- [ ] **Step 1: Replace `src/lib/animations.ts` contents**

Adds `initSectionReveal` (a generic scroll-reveal for every top-level section, so individual section components don't each need a `.gsap-reveal` class added by hand) and removes `initTechShowcase`, which becomes dead code once `TechShowcase.astro`/`TechShowcaseMobile.astro` are deleted in Task 66. `initScrollReveal` and `initHeroEntrance` are unchanged — both are still called by name from `HeroSection.astro` (Task 30) and `main-layout.astro` respectively.

```ts
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
 * Initialize scroll-triggered reveal for every top-level `<section>` on the
 * page. Sections that already run their own entrance timeline (currently
 * only the split-variant `HeroSection`, marked via `[data-hero-animate]`
 * children) are skipped so the two animations don't stack.
 */
export function initSectionReveal(): void {
  const sections = document.querySelectorAll('main > section:not(:has([data-hero-animate]))');

  if (sections.length === 0) return;

  sections.forEach((el) => {
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
```

- [ ] **Step 2: Call `initSectionReveal` alongside `initScrollReveal` in the layout**

In `src/layouts/main-layout.astro`, replace the bottom script block:

```astro
    <script>
      import { initScrollReveal } from '@/lib/animations';
      document.addEventListener('DOMContentLoaded', () => {
        initScrollReveal();
      });
    </script>
```

with:

```astro
    <script>
      import { initScrollReveal, initSectionReveal } from '@/lib/animations';
      document.addEventListener('DOMContentLoaded', () => {
        initScrollReveal();
        initSectionReveal();
      });
    </script>
```

- [ ] **Step 3: Verify**

Run: `pnpm exec astro check`

Run: `grep -rln "initTechShowcase" src/` — expected: no results (confirms nothing still references the removed export before Task 66 deletes its only callers).

Run: `pnpm dev`, open `/`, scroll down the homepage and confirm sections fade up into view as they cross into the viewport (trust strip, bento, how-it-works, engagement, comparison, experience, quote, blog, FAQ, final CTA), and that the hero's own staggered entrance still plays once on load without visibly double-animating. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/lib/animations.ts src/layouts/main-layout.astro
git commit -m "feat(animations): add initSectionReveal, drop unused initTechShowcase"
```

---

## Phase 12: Cleanup — delete orphaned files

### Task 66: Delete components and docs superseded by this redesign

**Files:**
- Delete: `src/components/organisms/cards/ServiceCard.astro`
- Delete: `src/components/organisms/sections/ServicesSection.astro`
- Delete: `src/components/organisms/cards/TestimonialCard.astro`
- Delete: `src/components/organisms/sections/TestimonialsSection.astro`
- Delete: `src/components/organisms/TechShowcase.astro`
- Delete: `src/components/organisms/TechShowcaseMobile.astro`
- Delete: `src/components/organisms/sections/ContactSection.astro`
- Delete: `src/templates/BaseTemplate.astro`
- Delete: `src/components/molecules/NavLink.astro`
- Delete: `src/components/molecules/MediaObject.astro`
- Delete: `src/components/molecules/Breadcrumb.astro`
- Modify: `src/templates/index.ts`
- Modify: `src/components/organisms/cards/index.ts`
- Modify: `src/components/organisms/sections/index.ts`
- Modify: `src/components/organisms/index.ts`

- [ ] **Step 1: Confirm every file below has zero importers before deleting**

Run each of these and confirm no output (every one of these was already confirmed orphaned or made orphaned by Tasks 45-64 in this plan; this step is the final safety check right before deletion):

```bash
grep -rl "ServiceCard" src/ --include="*.astro"
grep -rl "sections/ServicesSection" src/ --include="*.astro"
grep -rl "TestimonialCard" src/ --include="*.astro"
grep -rl "sections/TestimonialsSection" src/ --include="*.astro"
grep -rl "organisms/TechShowcase" src/ --include="*.astro"
grep -rl "ContactSection" src/pages src/templates --include="*.astro"
grep -rl "BaseTemplate" src/pages --include="*.astro"
grep -rl "molecules/NavLink" src/ --include="*.astro"
grep -rl "MediaObject" src/ --include="*.astro"
grep -rl "molecules/Breadcrumb\.astro" src/ --include="*.astro"
```

If any command prints a file, stop and check whether that file still needs the import (it shouldn't, per Tasks 45-64 above) before continuing.

- [ ] **Step 2: Delete the files**

```bash
git rm src/components/organisms/cards/ServiceCard.astro
git rm src/components/organisms/sections/ServicesSection.astro
git rm src/components/organisms/cards/TestimonialCard.astro
git rm src/components/organisms/sections/TestimonialsSection.astro
git rm src/components/organisms/TechShowcase.astro
git rm src/components/organisms/TechShowcaseMobile.astro
git rm src/components/organisms/sections/ContactSection.astro
git rm src/templates/BaseTemplate.astro
git rm src/components/molecules/NavLink.astro
git rm src/components/molecules/MediaObject.astro
git rm src/components/molecules/Breadcrumb.astro
```

- [ ] **Step 3: Remove the matching export lines from each barrel file**

Read `src/templates/index.ts`, `src/components/organisms/cards/index.ts`, `src/components/organisms/sections/index.ts`, and `src/components/organisms/index.ts`; remove the `export { default as ... }` line for each deleted component from whichever barrel references it, leaving every other export untouched.

- [ ] **Step 4: Verify**

Run: `pnpm exec astro check && pnpm build`
Expected: both succeed with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove components and template superseded by Industrial Grotesk redesign"
```

---

## Phase 13: Final verification

### Task 67: Full build and manual walkthrough

**Files:** none (verification only)

- [ ] **Step 1: Type check and build**

Run: `pnpm exec astro check`
Expected: 0 errors.

Run: `pnpm build`
Expected: build succeeds, no warnings about missing components or broken imports.

- [ ] **Step 2: Confirm no leftover references to the old design system**

```bash
grep -rn "tactile-" src/ --include="*.astro" --include="*.tsx" --include="*.css"
grep -rn "data-theme" src/ --include="*.astro" --include="*.ts"
grep -rn "var(--surface)\|var(--border)\|var(--shadow-color)\|var(--foreground)" src/ --include="*.astro" --include="*.tsx"
```

Expected: no matches for any of the three commands (all old-system class names, the removed theme-toggle attribute, and the old semantic CSS variables are gone).

- [ ] **Step 3: Manual dev-server walkthrough**

Run: `pnpm dev`

Visit and check each of the following against the reference (`landing-c.html`) for shared visual language — hard 2px ink borders, offset hard shadows with no blur, Archivo Black display headings, IBM Plex Mono labels, signal-green accent, alternating dark/light section panels, no light/dark toggle anywhere:

- `/` — every homepage section from Task 48's list renders; AI chat sends a message and streams a reply; clicking "See system prompt" opens the modal; a lead-flagged reply opens `LeadCaptureModal`; the skills showcase popup opens and its health bar animates.
- `/hire`, `/hire/react-developer`, `/hire/nextjs-developer`, `/hire/headless-cms` — `HireNavigationTabs` highlights the correct tab on each; hero, stats, bento services, "why choose me" grid, skills, projects, FAQ, CTA all render.
- `/projects` and a project detail page — grid renders; detail page shows tags, live/repo links, and the "Project Details" info box.
- `/blog`, a blog post, and a `/blog/tag/[tag]` page — grid/post/tag pages render; a blog post shows its author bio and related posts (if the post's tags overlap with another post).
- `/experience` — role cards, career-highlights boxes, and CTA render.
- `/contact` — form renders with hard-bordered inputs; why-work-with-me, response-time, ready-to-start, hire CTA, and social sections render.

Resize the browser to check breakpoints roughly matching the reference (980px, 900px, 560px, 480px, 420px) — bento cards and hero stack to one column, nav collapses to the mobile menu, tables scroll horizontally instead of overflowing.

Tab through a page with the keyboard and confirm the signal-green focus-visible outline appears on links, buttons, and form fields.

Stop the dev server (`Ctrl+C`) once every page above has been checked.

- [ ] **Step 4: Final commit (only if Step 3 required fixes)**

If the manual walkthrough surfaced any small fixes, stage and commit them individually with a `fix:` message describing what was wrong — do not bundle unrelated fixes into one commit.


