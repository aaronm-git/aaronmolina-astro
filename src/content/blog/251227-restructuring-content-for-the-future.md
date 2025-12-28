---
title: 'Restructuring Content for the Future'
slug: 'restructuring-content-for-the-future'
publishDate: 2025-12-27T00:00:00.000Z
description: 'Why I rebuilt my portfolio around entities instead of pages.'
tags:
  - astro
  - decapcms
  - architecture
  - structured-content
---

I've been building websites for over a decade. Somewhere along the way, I got tired of rebuilding the same portfolio from scratch every few years. This time, I wanted something different—a content system that could outlast whatever framework comes next.

## The Stack

**Astro 5** won me over the moment I understood what it was doing. It ships zero JavaScript by default. None. The pages are static HTML until you explicitly opt into client-side code. For a portfolio site that's mostly text and images, that's exactly right.

But Astro isn't just about being lightweight. The Content Layer API is what sold me. You define collections with Zod schemas, point them at folders of markdown or JSON, and Astro gives you fully typed data at build time. No runtime database queries. No API calls. Just files on disk, validated before they ever hit production.

I'm using React for a few interactive pieces through Astro's island architecture—components hydrate independently, so a theme toggle doesn't mean shipping React to every page. Tailwind 4 handles styling (CSS-first now, which feels cleaner), and GSAP powers some subtle scroll animations.

**DecapCMS** was an obvious choice once I understood the constraints. Most headless CMS platforms want you to host content on their servers. That means API calls, rate limits, and a monthly bill that scales with traffic. DecapCMS stores everything in Git. The content lives in my repository, version-controlled alongside the code.

The local development server is the killer feature. I can edit content through the same admin UI I'd use in production, but it writes directly to my local files. No waiting for webhooks. No syncing issues. The feedback loop is instant.

**Netlify** ties it together. Git Gateway handles authentication for the CMS—visitors with the right credentials can edit content through the browser without ever touching the codebase directly. Deploys trigger automatically on every push. The whole pipeline is invisible once it's set up.

## Why Entities Instead of Pages

Most portfolio sites are organized around pages. A homepage with hardcoded sections. An experience page with a list of jobs. A projects page with cards.

That works until you need to show the same information in different contexts. What if a project appears on the homepage, its own detail page, and in the experience section because it was part of a specific role? Now you're duplicating data or writing logic to sync it.

I reorganized everything around entities. A **Technology** isn't just a tag—it has a name, a slug, a category, and optionally a proficiency level. An **Organization** exists independently of any role I held there. A **Role** references an organization and a list of technologies. A **Project** can reference roles, technologies, and organizations.

The relationships form a graph. One technology like "React" might appear in five different roles and eight different projects. Change the display name once, and it updates everywhere.

```
Profile → Roles → Organizations
              ↘ Technologies ↙
Projects → Technologies
```

The CMS understands these relationships. When I edit a role, I select technologies from a searchable dropdown that shows human-readable names. The system stores slugs. The frontend maps them back to display names at build time.

## What the Content Layer Actually Does

Astro's glob loader watches folders and parses files into collections. Each collection has a schema:

```typescript
const technologies = defineCollection({
  loader: glob({ 
    pattern: '**/*.json',
    base: './src/content/technologies'
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    category: z.enum(['language', 'framework', 'library', 'tool', 'platform', 'service', 'cms', 'concept', 'other']),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  }),
});
```

If a file doesn't match the schema, the build fails. That's the point. Bad data gets caught before it ships.

On the frontend, I load technologies once and build a Map for lookups:

```typescript
const technologies = await getCollection('technologies');
const techMap = new Map(technologies.map(t => [t.data.slug, t.data.name]));
```

Every component that displays technology tags uses that map. The data flows one direction, and there's exactly one source of truth.

## Site Configuration in JSON

The navigation, footer, CTA sections, page metadata—all of it lives in JSON files that the CMS edits directly. The main layout pulls site settings on every page:

```typescript
import settings from '@/content/site/settings.json';
const { title = settings.siteTitle, description = settings.siteDescription } = Astro.props;
```

No more hunting through components to change a phone number or update the copyright year. The CMS has a "Site" section with every configurable value in one place.

## The Trade-offs

This approach has costs. The entity model is more complex than flat files. The CMS configuration is substantial—relation widgets, validation rules, display fields for every reference. The upfront investment is real.

But the payoff is that I won't rebuild this from scratch. The content structure supports a resume export, a JSON API, a skills matrix—whatever the next requirement turns out to be. The data model is flexible because it models reality, not pages.

The build takes under two seconds. Every relationship resolves at compile time. The browser receives static HTML with no framework runtime. Lighthouse scores are perfect without trying.

## What I Actually Like About This

Editing content through the CMS while watching the dev server hot-reload changes—that feedback loop is addictive. The admin UI shows me "React.js" and "DecapCMS" as human-readable options. Under the hood, it's all slugs and references, but the editing experience is friendly.

Git history tells me exactly what changed and when. No black-box database migrations. If I mess something up, I revert a commit.

The lack of a traditional backend means fewer moving parts. No server to maintain. No database to back up. No credentials to rotate. The complexity is in the build step, not the runtime.

---

This site isn't just a portfolio anymore. It's a content system that happens to render as web pages. The distinction matters when you're thinking about the next five years instead of the next five weeks.

The code is on GitHub. The site is on Netlify. The content is in Git. Everything is connected, and nothing is locked in.
