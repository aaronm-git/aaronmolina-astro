# Portfolio Redesign: Field Crew Bold → Industrial Grotesk

**Date:** 2026-07-03
**Status:** Approved, ready for implementation planning
**Scope:** Entire site (design system + all pages), single pass

## Summary

Replace the site's current "Tactile Maximalism" visual system (soft glassmorphism, rounded corners, purple/coral/cyan gradients) with a hard-edged, high-contrast industrial/neo-brutalist system, adapted from a Fable 5-generated reference design (`landing-c.html` / `direction-c.html`, a PoolPuma pool-service SaaS mockup). The reference's *visual system* is kept faithfully; all SaaS-specific copy and any section with no natural portfolio equivalent is replaced or repurposed with real content already living in this site's content collections.

This is a full teardown: every current atom, molecule, organism, and section component is deleted and rebuilt against the new system. Content collections, the AI portfolio chat feature, routing, and utilities are preserved.

## Reference source

- `file:///Users/aaronmolina/Sites/personal/Pool service app/poolpuma-monorepo/apps/marketing/design-directions/landing-c.html` — full landing page mockup (all sections)
- `file:///Users/aaronmolina/Sites/personal/Pool service app/poolpuma-monorepo/apps/marketing/design-directions/direction-c.html` — token/spec sheet (colors, type, shape, spacing)

## Design tokens

Ported into `src/styles/global.css` as Tailwind v4 `@theme` variables. Pool-specific names renamed to generic ones; already-generic industrial names kept.

| Token | Value | Notes |
|---|---|---|
| `--ink` | `oklch(16% 0.012 250)` | near-black foundation, dark section bg |
| `--asphalt` | `oklch(21% 0.014 250)` | raised dark panel |
| `--seam` | `oklch(32% 0.014 250)` | dark-side hairline border |
| `--concrete` | `oklch(93% 0.005 250)` | light section ground |
| `--concrete-2` | `oklch(88% 0.007 250)` | light section alt |
| `--paper` | `oklch(98% 0.002 250)` | card face on light |
| `--steel` | `oklch(62% 0.016 250)` | muted text on dark |
| `--graphite` | `oklch(38% 0.014 250)` | muted text on light |
| `--signal` (was `--chlorine`) | `oklch(87% 0.23 135)` | the one loud accent — buttons, highlights, stamps |
| `--signal-deep` (was `--chlorine-deep`) | `oklch(52% 0.16 140)` | accent, legible on light backgrounds |
| `--amber` | `oklch(80% 0.16 75)` | status-only (e.g. "in review") |

Shape: `--r-1: 2px`, `--r-2: 4px`, `--r-3: 6px`, `--bw: 2px` (border width), `--shadow-hard: 5px 5px 0 var(--ink)`, `--shadow-hard-sm: 3px 3px 0 var(--ink)`.

Spacing (4px base): `--s-1: 4px` through `--s-9: 112px`, matching the reference scale exactly.

Type: `--font-display` → Archivo Black (self-hosted via `@fontsource/archivo-black`), `--font-mono` → IBM Plex Mono (self-hosted via `@fontsource/ibm-plex-mono`), `--font-body` → system grotesk stack (Helvetica Neue / Arial / sans-serif), no external font requests.

**Architectural rule (per CLAUDE.md):** `global.css` holds only `@theme` token declarations, `@font-face`/font imports, and a minimal base layer (html/body reset, focus-visible outline in `--signal`). All visual detail — hard shadows, hazard-tape dividers, card layout, hover/press transforms — is implemented as Tailwind utility classes (with arbitrary values referencing the tokens, e.g. `shadow-[5px_5px_0_var(--color-ink)]`) directly in each component, or in that component's own scoped `<style>` block when a utility can't express it cleanly (e.g. the repeating-gradient hazard tape). No new global component classes get added to `global.css`.

No light/dark mode toggle. The reference has none — dark/light is a fixed alternating panel rhythm per section, not a user preference. The current theme-toggle script (`main-layout.astro`) and toggle button/logic (`Header.astro`) are removed.

## Docs cleanup

- **Delete** `ARCHITECTURE-PLAN.md` — describes the old glassmorphic system being replaced.
- **Delete** `IMPLEMENTATION-PLAN.md` — a progress tracker for that same old system.
- **Update** the "Tactile Maximalism" paragraph in `CLAUDE.md` and the matching paragraph in `AGENTS.md` to describe this new hard-edged industrial system as the site's design trend, so future work stays consistent.

## Component inventory (rebuilt from scratch)

All existing files under `src/components/atoms/`, `src/components/molecules/`, `src/components/organisms/{cards,navigation,sections,decorative,forms}/`, and `TechShowcase(Mobile).astro` are deleted and replaced with the list below (same atomic-design layering, no separate `templates/` layer — see "Hire pages" note).

**Atoms:** `Button` (primary/secondary/ink/ghost-ink variants, hard shadow + press transform), `Badge`/`Tag` (mono uppercase tracked pill, doubles as "phase" tag and "stamp" variants), `Heading` (display font, uppercase, black weight), `Text`, `Link`, `Divider` (includes a `tape` variant — the diagonal signal/ink hazard stripe), `Avatar`, `Skeleton`, `Icon`.

**Molecules:** `Card` (base hard-shadow card, `dark` variant for ink-background cards), `SectionHeader` (mono eyebrow + display heading + optional description), `StatItem`, `TagList`, `NavLink`, `SocialLink(s)`, `FormField`, `ListItem`, `MediaObject`, `Breadcrumb`/`Breadcrumbs` (mono uppercase tracked trail, e.g. `HOME / PROJECTS / TYPELYFT`), `InfoBox`.

**Organisms — navigation:** `Header` (dark sticky topbar, signal-bottom-border, wordmark mark, nav links, no theme toggle), `Footer` (ink background, signal top border, brand+columns grid, legal row).

**Organisms — decorative:** hazard-tape section divider, faint stencil-grid background overlay (used behind dark hero/CTA sections).

**Organisms — cards:** `ProjectCard`, `BlogPostCard`, `RoleCard`, `TestimonialCard` (repurposed as the single first-person pull-quote card).

**Organisms — sections:** `HeroSection` (with the "Build Manifest" signature widget), `TrustStripSection`, `FeaturesSection` (bento grid with phase tags), `HowItWorksSection` (3-step numbered stencil), `EngagementSection` (repurposed pricing-style cards), `ComparisonSection` (repurposed "why work with me" table), `QuoteSection`, `FAQSection` (accordion), `CTASection`, `StatsSection`, `SkillsSection`/tech-stack, `ExperienceSection`, `ProjectsSection`, `BlogSection`.

## Homepage: section-by-section content mapping

1. **Header/nav** — dark sticky bar; wordmark is a generic `AM` mark in a signal-green square (reference's "PP" paw, genericized); nav links from `src/content/site/navigation.json`; secondary button → Projects, primary → Contact.

2. **Hero** — headline/subheadline/description from `homepage.json` `hero` block, verbatim. Signature widget is the **Build Manifest** card (reskinned "Route Run" ticket): header row ("Build Manifest" + date-style label), a handful of real shipped projects from the `projects` collection (e.g. LA Clippers Website, Miami Heat Website, TypeLyft, OneMusicCrate) each with a status stamp (Shipped / Live / In Review), footer progress meter driven by the "Projects Shipped" stat (e.g. "This year: 12/15"). Internal naming: `.ticket`→`.manifest`, `.stop`→`.manifest-item`, `.r-name`/`.r-tech`→`.entry-title`/`.entry-meta`; `.stamp` and `.meter`/`.fill` keep their names (already generic).

3. **Trust strip** — merges the reference's guarantee-seal pattern with the existing `trustedBy` company logos (LA Clippers, Miami Heat, Azamara, Corsair). Seal copy: "Free discovery call on every project — no obligation." Badge row: "TypeScript everywhere", "AI-augmented workflow", "24hr response time", "Remote US / Miami" (all drawn from existing stats/copy, no invented claims).

4. **Feature bento** (6 cards, phase-tagged, mirrors the reference's Plan/Dispatch/Review/Field/Log/Assist rhythm):

   | Phase tag | Card content | Source |
   |---|---|---|
   | Build | Jamstack & Full Stack Development | `homepage.json` services.items[0] |
   | Integrate | Headless CMS Integration | services.items[1] |
   | Ship *(dark card)* | mini stat board: 14+ Years / 50+ Projects / 5+ AI Apps | `homepage.json` stats |
   | Architect | React & Frontend Architecture, tag list: TypeScript / CI/CD / Testing / A11y | services.items[3] + valueProps |
   | Assist | AI-Powered Development | services.items[2] |
   | Extend | MCP Server Integrations | aiShowcase items |

5. **How it works** (3 numbered steps, dark section) — Discover & Propose → Build & Communicate → Ship & Support, drawn directly from the `hire.json` shared FAQ answer describing the typical project process.

6. **Engagement models** (repurposed pricing section, no dollar figures — consulting work is quoted): three cards — Project-Based / **Retainer** (highlighted, middle) / Fractional-Embedded — each with a bullet list of what's included (fixed-scope proposal, regular milestone demos, clear communication channel, etc.), plus a dashed "custom scope? let's talk" row replacing the Enterprise row.

7. **Why work with me** (repurposed comparison table) — "Working with me" vs. "Marketplace freelancer" vs. "Traditional agency" across rows: direct senior-level communication, AI-augmented delivery speed, fixed point of contact, enterprise-tested code quality.

8. **Quote** (repurposed pull-quote — a personal statement, not a client testimonial; the `testimonials` collection stays empty/unused for now):

   > "I stopped writing every line by hand. I pair with Claude Code and Fable 5 on real production work end to end, and I still make every architecture call before a single file changes."
   > — Aaron Molina

9. **FAQ** — reuses `hire.json` shared FAQ (6 Q&As) verbatim.

10. **Final CTA** — reuses `src/content/site/cta.json`.

11. **Footer** — brand blurb + contact (from `footer.json` + `profile.json`), three link columns (Site nav, Hire Me sub-pages, Connect/social), legal row with copyright from `footer.json`. Signal-green top border, ink background.

## Rest of the site

- **Hire pages** (`/hire`, `/hire/react-developer`, `/hire/nextjs-developer`, `/hire/headless-cms`): each already has a full hero/services/features/skills/projects/FAQ/CTA data block in `hire.json`. Instead of a heavy templates layer, build one shared `HirePageSections` composition that takes a data slice; each route stays its own file for SEO metadata control.
- **Projects index** (`/projects`): grid of `ProjectCard`, copy from `pages.json` `projectsIndex`.
- **Project detail** (`/projects/[project]`): hero-style header (title, summary, tech tags, live/repo links), prose body reskinned with the new tokens (bordered/shadowed images and code blocks, tape-style `<hr>`).
- **Blog index** (`/blog`, `/blog/tag/[tag]`): grid of `BlogPostCard`, copy from `pages.json` `blogIndex`.
- **Blog post** (`/blog/[post]`): same reskinned prose pattern as project detail, plus tags/date and author bio/CTA footer.
- **Experience** (`/experience`): timeline of `RoleCard`s from the `roles`/`organizations` collections, core-competencies grid — copy from `pages.json` `experience`.
- **Contact** (`/contact`): contact form using new `FormField` styling, plus "why work with me," response-time, and social sections from `pages.json` `contact`.

## AI portfolio chat restyle

Visual pass only, no logic changes: `PortfolioChat`, `ChatMessage`, `SuggestedPrompts`, `LeadCaptureModal`, `SystemPromptModal` get re-skinned with the same tokens — paper background, hard ink border/shadow on the container, signal-green user message bubble, mono labels for timestamps/status.

## Animation strategy

Keep GSAP + `ScrollTrigger` via the existing `src/lib/animations.ts` (`initScrollReveal`), extended to target the new section markup. Hover/press micro-interactions (button and card lift + shadow shift) stay as plain Tailwind/CSS transitions, matching how the reference itself implements them — GSAP is reserved for scroll-triggered entrance reveals, not hover states.

## What's deleted vs. kept

**Deleted:** every current atom, molecule, organism, card, and section component; `Header.astro`/`Footer.astro`; `TechShowcase.astro`/`TechShowcaseMobile.astro`; the old `global.css` "Tactile Maximalism" theme; `ARCHITECTURE-PLAN.md`; `IMPLEMENTATION-PLAN.md`.

**Kept as-is:** all content collections (`blog`, `technologies`, `organizations`, `roles`, `projects`, `profile`, `education`, `certifications`, `awards`, `testimonials`, `services`) and `src/content/site/*.json`; the AI portfolio chat feature's logic (`src/lib/chat/`, `src/lib/portfolio-knowledge.ts`, `netlify/functions/`, `src/pages/api/`) — restyled visually only; `src/utils/`, `src/config/`; page routes (rebuilt internally, same URLs); `SEO-KEYWORD-RESEARCH.md`, `SEO-RESEARCH-TEMPLATE.md` (no conflict with the visual system).

## Testing / verification approach

- `astro check` (TypeScript) must pass after the rebuild.
- Manual pass in a browser for the homepage and one representative page of each other type (a hire page, a project detail, a blog post, experience, contact) checking: responsive breakpoints match the reference's (`980px`, `900px`, `560px`, `480px`, `420px`), focus-visible outlines work, hover/press states on buttons and cards behave, dark/light section rhythm reads correctly with no leftover theme-toggle remnants.
- Confirm the AI chat widget still functions (send message, lead capture modal) after the visual restyle.
- Lighthouse/Core Web Vitals spot check given the SEO goals already defined in `SEO-KEYWORD-RESEARCH.md` — self-hosted fonts and no added JS should keep this neutral-to-positive versus the current build.
