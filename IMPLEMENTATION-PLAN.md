# Implementation Plan: aaronmolina.me

**Created:** February 3, 2026
**Last Updated:** February 3, 2026
**Status:** In Progress

---

## Overview

This plan combines the Atomic Design Architecture restructure with SEO keyword implementation. It tracks all phases, their completion status, and remaining work.

**Key Documents:**
- `ARCHITECTURE-PLAN.md` - Component architecture specifications
- `SEO-KEYWORD-RESEARCH.md` - Keyword strategy and page recommendations
- `CLAUDE.md` - Development rules and guidelines

**Tech Stack:**
- Framework: Astro
- Styling: Tailwind CSS 4
- Animation: GSAP (ScrollTrigger, ScrollToPlugin)
- Validation: Zod schemas
- Package Manager: pnpm
- Design System: Tactile Maximalism

---

## Progress Summary

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 1 | Foundation & Directory Structure | Complete | 100% |
| 2 | Atoms & Molecules | Complete | 100% |
| 3 | Organisms - Sections | Complete | 100% |
| 4 | Page Refactoring | Complete | 100% |
| 5 | Templates | Complete | 100% |
| 6 | SEO - Hire Pages | Complete | 100% |
| 7 | SEO - Content Optimization | Not Started | 0% |
| 8 | SEO - Blog Content | Not Started | 0% |
| 9 | Animation Polish | Partial | 30% |
| 10 | Testing & Optimization | Not Started | 0% |

---

## Phase 1: Foundation & Directory Structure

**Status:** Complete
**Commits:** `1911e69`

### Completed Tasks

- [x] Create atomic design directory structure
  - `src/components/atoms/`
  - `src/components/molecules/`
  - `src/components/organisms/cards/`
  - `src/components/organisms/sections/`
  - `src/components/organisms/navigation/`
  - `src/components/organisms/decorative/`
- [x] Move existing components to new locations
- [x] Create `cn()` utility for class merging (`src/lib/cn.ts`)
- [x] Update import paths throughout project
- [x] Set up barrel exports where needed

---

## Phase 2: Atoms & Molecules

**Status:** Complete
**Commits:** `1911e69`

### Completed Tasks

- [x] Create/enhance `Button.astro` with variants (primary, secondary, outline, ghost, tactile)
- [x] Create `Heading.astro` with size variants
- [x] Create `Text.astro` typography component
- [x] Create `Badge.astro` for labels/status
- [x] Create `Avatar.astro` for profile images
- [x] Create `Icon.astro` with icon lookup
- [x] Move `TagList.astro` to molecules
- [x] Move `SectionHeader.astro` to molecules
- [x] Move `InfoBox.astro` to molecules
- [x] Move `ListItem.astro` to molecules
- [x] Create `Card.astro` base component
- [x] Create `SocialLinks.astro` molecule
- [x] Create `FormField.astro` molecule

---

## Phase 3: Organisms - Sections

**Status:** Complete
**Commits:** `1911e69`, `441d1aa`

### Completed Tasks

- [x] Create `HeroSection.astro` with variants (centered, split, minimal, fullscreen, profile)
- [x] Create `FeaturesSection.astro`
- [x] Create `ServicesSection.astro`
- [x] Create `ProjectsSection.astro`
- [x] Create `ExperienceSection.astro`
- [x] Create `BlogSection.astro`
- [x] Create `SkillsSection.astro`
- [x] Create `CTASection.astro`
- [x] Create `StatsSection.astro`
- [x] Create `FAQSection.astro`
- [x] Create `TestimonialsSection.astro`
- [x] Create `ContactSection.astro`
- [x] Refactor card organisms (BlogPostCard, ProjectCard, RoleCard)

---

## Phase 4: Page Refactoring

**Status:** Complete
**Commits:** `441d1aa`, `71f1df9`

### Completed Tasks

- [x] Refactor `index.astro` (homepage)
  - Uses: HeroSection (profile), StatsSection, ServicesSection, SkillsSection, ProjectsSection, FeaturesSection, ExperienceSection, BlogSection, CTASection
  - Content from `homepage.json` with SEO-aligned structure
- [x] Refactor `projects/index.astro`
  - Uses: HeroSection (minimal), ProjectsSection, CTASection
- [x] Refactor `blog/index.astro`
  - Uses: HeroSection (minimal), BlogSection (list), CTASection
- [x] Refactor `experience.astro`
  - Uses: HeroSection (minimal), ExperienceSection, CTASection
- [x] Refactor `contact.astro`
  - Uses: HeroSection (minimal), custom form, InfoBox sections
- [x] Refactor `blog/[post].astro` (detail page)
  - Uses: HeroSection (minimal), CTASection, Button, TagList
- [x] Refactor `projects/[project].astro` (detail page)
  - Uses: HeroSection (minimal), CTASection, Badge, TagList, InfoBox

### Content Files Updated

- [x] `src/content/site/homepage.json` - Enhanced with SEO-aligned content
  - meta, hero, stats, techStack, services, valueProps, featuredProjects, experience, blog, cta sections
  - Dynamic years of experience calculation

---

## Phase 5: Templates

**Status:** Complete
**Commits:** `33817d4`

### Completed Tasks

- [x] Create `BaseTemplate.astro` - Core layout wrapper with back nav, hero, content, CTA slots
- [x] Create `BlogPostTemplate.astro` - Blog post layout with dates, tags, CTA
- [x] Create `ProjectDetailTemplate.astro` - Project layout with badges, image, details, CTA
- [x] Create `HireTemplate.astro` - Comprehensive hire page layout with optional sections:
  - Hero, Stats, Services, Features, Skills, Projects, Testimonials, FAQ, CTA
- [x] Refactor `blog/[post].astro` to use BlogPostTemplate (83 lines -> 28 lines)
- [x] Refactor `projects/[project].astro` to use ProjectDetailTemplate (186 lines -> 28 lines)
- [x] Update barrel export (`src/templates/index.ts`)

### Template Architecture

Templates compose with MainLayout and section organisms (no HTML duplication):
```
Page -> Template -> MainLayout -> Section Organisms -> Molecules -> Atoms
```

---

## Phase 6: SEO - Hire Pages (Tier 1 Keywords)

**Status:** Complete
**Commits:** `15f3416`
**Reference:** SEO-KEYWORD-RESEARCH.md Part 5, Part 6

### Completed Tasks

#### Main Hire Hub Page (`/hire`)

- [x] Create `/hire/index.astro`
- [x] Target keywords:
  - Primary: "hire jamstack developer" (vol 50, KD 1)
  - Secondary: "jamstack developer", "remote frontend developer"
- [x] SEO-optimized meta tags
- [x] Sections: Hero, Stats, Services, Features, Skills, Projects, FAQ, CTA

#### React Developer Page (`/hire/react-developer`)

- [x] Create `/hire/react-developer.astro`
- [x] Target: "hire react developer" (vol 1,000, KD 8)
- [x] Projects filtered by React/Next.js/TypeScript technologies

#### Next.js Developer Page (`/hire/nextjs-developer`)

- [x] Create `/hire/nextjs-developer.astro`
- [x] Target: "hire next.js developer" (vol 150, KD 0)
- [x] Projects filtered by Next.js/React/Vercel technologies

#### Headless CMS Page (`/hire/headless-cms`)

- [x] Create `/hire/headless-cms.astro`
- [x] Target: "headless cms developer" (vol 150, KD 62)
- [x] Projects filtered by Sanity/Contentful/Strapi technologies

#### Content & Navigation

- [x] Create `src/content/site/hire.json` with all page content
- [x] Shared FAQ section for all hire pages
- [x] Dynamic years of experience calculation
- [x] Add "Hire Me" link to main navigation

### Pages Created

| URL | Primary Keyword | Volume | KD |
|-----|-----------------|--------|-----|
| `/hire` | hire jamstack developer | 50 | 1 |
| `/hire/react-developer` | hire react developer | 1,000 | 8 |
| `/hire/nextjs-developer` | hire next.js developer | 150 | 0 |
| `/hire/headless-cms` | headless cms developer | 150 | 62 |

---

## Phase 7: SEO - Content Optimization (Tier 2)

**Status:** Not Started
**Reference:** SEO-KEYWORD-RESEARCH.md Part 5, Part 6

### Homepage Optimization

- [x] Update title to include "Jamstack Developer"
- [x] Add "Remote US / Miami, FL" to hero section
- [x] Include target keywords naturally in content

### Experience Page Optimization

- [ ] Add "Senior React Developer" naturally in descriptions
- [ ] Add "Senior Frontend Developer" in appropriate places
- [ ] Ensure role descriptions are keyword-rich

### Projects Page Optimization

- [ ] Ensure project tags include: Jamstack, Astro, Next.js, Sanity, Headless CMS
- [ ] Add technology filters if not present
- [ ] Optimize project descriptions for SEO

### Contact Page Optimization

- [ ] Add "Looking to hire a Jamstack developer?" CTA
- [ ] Link to /hire page prominently

### Technical SEO

- [ ] Add JSON-LD structured data (Person, Organization)
- [ ] Update sitemap.xml with new pages
- [ ] Submit new URLs to Google Search Console
- [ ] Verify mobile responsiveness

---

## Phase 8: SEO - Blog Content (Tier 3)

**Status:** Not Started
**Reference:** SEO-KEYWORD-RESEARCH.md Part 5

### Priority Blog Posts

#### Post 1: Best Headless CMS

- [ ] Title: "Best Headless CMS for Marketing Sites in 2026"
- [ ] Target: "most popular headless cms" (vol 150, KD 7)
- [ ] Include: Sanity, Contentful comparison
- [ ] Word count: 2,000-3,000 words
- [ ] Internal links to /hire/headless-cms

#### Post 2: Deployment Platform Comparison

- [ ] Title: "Vercel vs Render vs Netlify: A Developer's Guide"
- [ ] Target: "vercel vs render" (vol 250, KD 0)
- [ ] Easy win, establishes expertise
- [ ] Word count: 1,500-2,500 words

#### Post 3: Jamstack Explainer

- [ ] Title: "What is Jamstack? Why I Build Every Project With It"
- [ ] Target: "jamstack" (vol 2,100, KD 31)
- [ ] Thought leadership, link to /hire
- [ ] Word count: 2,000-3,000 words

### Blog Infrastructure

- [ ] Add category/tag pages for better SEO
- [ ] Implement related posts feature
- [ ] Add author bio section with links to /hire

---

## Phase 9: Animation Polish

**Status:** Partial (30%)
**Reference:** ARCHITECTURE-PLAN.md Part 9

### Completed

- [x] GSAP installed and configured (v3.13.0)
- [x] ScrollTrigger and ScrollToPlugin registered
- [x] Basic scroll animations for `.animate-section` class
- [x] Animation utility class exists (`src/scripts/animations.ts`)

### Remaining Tasks

- [ ] Create GSAP presets file (`src/lib/gsap-presets.ts`)
- [ ] Add tactile button micro-interactions
- [ ] Add card hover lift effects
- [ ] Add staggered children animations for grids
- [ ] Add page transition effects
- [ ] Optimize animation performance (will-change, GPU acceleration)

---

## Phase 10: Testing & Optimization

**Status:** Not Started

### Performance

- [ ] Run Lighthouse audit (target: 90+ all categories)
- [ ] Optimize Core Web Vitals (LCP, FID, CLS)
- [ ] Review bundle sizes
- [ ] Implement lazy loading where beneficial

### Accessibility

- [ ] Run axe accessibility audit
- [ ] Verify keyboard navigation
- [ ] Check color contrast ratios
- [ ] Add skip links
- [ ] Verify screen reader compatibility

### Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Visual Regression

- [ ] Screenshot key pages at various breakpoints
- [ ] Verify responsive behavior

---

## Backlink Building (Ongoing)

**Reference:** SEO-KEYWORD-RESEARCH.md Part 8

- [ ] Update LinkedIn profile with aaronmolina.me link
- [ ] Add site to GitHub profile
- [ ] Submit to relevant developer directories
- [ ] Consider guest posting opportunities

---

## File Reference

### Key Content Files

| File | Purpose |
|------|---------|
| `src/content/site/homepage.json` | Homepage content and SEO meta |
| `src/content/site/pages.json` | Other page content |
| `src/content/site/settings.json` | Site-wide settings |
| `src/content/site/navigation.json` | Navigation structure |

### Key Component Files

| File | Purpose |
|------|---------|
| `src/components/organisms/sections/HeroSection.astro` | Hero sections with variants |
| `src/components/organisms/sections/CTASection.astro` | Call-to-action sections |
| `src/components/organisms/sections/ProjectsSection.astro` | Project grids |
| `src/components/organisms/sections/ExperienceSection.astro` | Work history |
| `src/components/organisms/sections/BlogSection.astro` | Blog post lists |

### Key Page Files

| File | Purpose |
|------|---------|
| `src/pages/index.astro` | Homepage |
| `src/pages/experience.astro` | Experience page |
| `src/pages/contact.astro` | Contact page |
| `src/pages/projects/index.astro` | Projects listing |
| `src/pages/blog/index.astro` | Blog listing |

---

## Git Commits Reference

| Hash | Description | Phase |
|------|-------------|-------|
| `1911e69` | refactor: implement atomic design component architecture | 1, 2, 3 |
| `441d1aa` | feat: enhance homepage with SEO-aligned content and section organisms | 3, 4 |
| `71f1df9` | refactor: update pages to use section organisms (atomic design) | 4 |
| `72e1d09` | docs: update architecture plan and create implementation roadmap | Docs |
| `5b4768d` | refactor: update detail pages to use section organisms | 4 |
| `5456a61` | docs: update implementation plan with detail page completion | Docs |
| `33817d4` | feat: create page templates and refactor detail pages | 5 |
| `2a373dc` | docs: mark Phase 5 (Templates) as complete | Docs |
| `15f3416` | feat: create SEO-optimized hire pages | 6 |

---

## Notes

### Design Guidelines (Tactile Maximalism)

- Big, bold typography with oversized headlines
- Layered textures and depth with shadows
- Micro-delight interactions (bouncy buttons, reactive elements)
- Frosted glass effects (glassmorphism)
- 3D sculptural, pressable-feeling components
- Rich color palette (purple/coral/cyan)

### Content Guidelines (from CLAUDE.md)

- No em dashes - rephrase or use other punctuation
- Use proper punctuation and grammar
- Avoid complex words - use simpler alternatives
- Follow SEO best practices
- Align with keyword research goals

### Technical Guidelines (from CLAUDE.md)

- Always use TypeScript
- Always use Zod schemas for validation
- Use Astro Content Collections for content
- Use Tailwind utility classes
- Use GSAP for animations (no other animation libraries)
- Use pnpm as package manager

---

## Next Steps

**Immediate Priority:**
1. Phase 5: Create page templates for consistency
2. Phase 6: Build /hire pages (highest SEO value)

**Secondary Priority:**
3. Phase 7: Content optimization across existing pages
4. Phase 8: Blog content creation

**Final Polish:**
5. Phase 9: Animation enhancements
6. Phase 10: Testing and optimization

---

*Plan version 1.0 - February 2026*
