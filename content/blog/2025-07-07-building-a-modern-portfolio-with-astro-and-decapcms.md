---
title: "Building a Modern Portfolio with Astro: A Senior Developer's Approach"
slug: 2025-07-07-building-a-modern-portfolio-with-astro
date: 2025-07-07T10:00:00.000Z
description: Exploring the architecture and implementation of a modern portfolio site built with Astro, TypeScript, Content Collections, and Tailwind CSS. A deep dive into the technical decisions that make this stack ideal for developer portfolios.
image: ''
tags:
  - astro
  - typescript
  - frontend
  - fullstack
  - tailwindcss
  - github-pages
---

# Building a Modern Portfolio with Astro

When I rebuilt my portfolio site recently, I went through the usual developer decision paralysis. React? Next.js? Just stick with WordPress? After working with various teams and tech stacks over the years, I landed on something that might surprise you: Astro with Content Collections.

Here's why I made these choices and what I learned along the way. You can check out the full implementation on [my GitHub](https://github.com/aaronm-git) if you want to see how it all comes together.

## The Stack and Why I Picked It

### Astro: Finally, a Static Site Generator That Gets It

I've used Gatsby, Next.js, and plenty of other frameworks, but Astro just clicks. The Islands Architecture means I can write components without worrying about shipping unnecessary JavaScript. Most of my portfolio pages are pure HTML/CSS, which loads instantly.

The performance gains are real:

- Lighthouse scores above 95 consistently
- Pages load in under 100ms
- Bundle sizes that don't grow out of control

After dealing with hydration issues and massive bundle sizes in previous projects, this feels refreshing.

### Content Collections: Git-Based Content That Actually Works

I was skeptical about file-based content at first. Coming from teams using Contentful and Strapi, managing content in files seemed like a step backward. But after using Astro's Content Collections for a few months, I get it now.

Everything lives in Git alongside my code. No database to maintain, no API keys to manage, no vendor lock-in. When I update content, it's just a commit. When I deploy, content comes with it.

Plus, the type safety from Zod schemas means I catch content errors at build time, not in production.

### TypeScript: Because I Like Sleeping at Night

TypeScript isn't optional for me anymore. On this project, I used it throughout the content configuration:

```typescript
// Type-safe content collections
const experience = defineCollection({
  schema: z.object({
    title: z.string(),
    role: z.string(),
    date: z.date(),
    tags: z.array(z.enum(tagSlugs)).default([]),
    responsibilities: z.array(z.string()),
    achievements: z.array(z.string()),
  }),
});
```

Having type safety in the content schema means when I change content structure, I know exactly what breaks. No more runtime surprises.

### Tailwind: Utility Classes That Don't Suck

I used to be a Tailwind skeptic. "Just write CSS," I'd say. But after using it on larger projects, I'm converted. For a portfolio site, it's perfect.

Quick prototyping, consistent spacing, responsive design that just works. And with PurgeCSS, the final bundle is tiny.

## Architecture Decisions I'm Happy With

### Content Collections with Zod Validation

Astro's content collections are brilliant. I can define schemas that validate at build time:

```typescript
const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.enum(tagSlugs)).default([]),
    completedOn: z.date().optional(),
    featuredImage: z.string().optional(),
  }),
});
```

If I mess up frontmatter, the build fails. Fast feedback, no broken production deploys.

### Component Organization

I kept the component structure simple. One main layout, a few reusable pieces. Nothing fancy:

```astro
// layouts/main-layout.astro - keeps it simple
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Aaron Molina</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

Sometimes the simplest approach is the best approach.

### GitHub Pages Deployment

For a portfolio site, GitHub Pages is perfect. It's free, fast, and deploys automatically when I push to main. No server management, no monthly hosting fees.

The build process is simple:
1. `astro build` generates static files
2. GitHub Actions deploys to Pages
3. Available at my custom domain

## Performance Stuff That Actually Matters

### Images Don't Suck

Astro's image optimization is solid. I drop in images, it handles WebP conversion, responsive sizing, lazy loading. One less thing to think about.

### Bundle Size Reality Check

With Astro, I ship almost zero JavaScript. My homepage is under 50KB total. Compare that to my previous Next.js portfolio that was pushing 200KB just for the framework.

## Developer Experience Wins

### Hot Reloading That Works

Unlike some static site generators, Astro's dev server is fast. Changes appear instantly. No more waiting 30 seconds for a rebuild.

### TypeScript Integration

Full TypeScript support without configuration headaches. IntelliSense works, imports resolve correctly, type checking happens at build time.

### Git-Based Content Workflow

Content changes go through pull requests just like code. I can review copy changes, suggest edits, track content history. It's version control for everything.

## Why This Stack Makes Sense for Senior Devs

### Performance by Default

I don't have to optimize for performance later. The architecture encourages fast sites from the start.

### Maintainability

Six months from now, I'll understand this codebase. TypeScript helps, simple architecture helps, Git-based content helps.

### No Vendor Lock-in

If GitHub Pages disappears tomorrow, I can deploy anywhere. If Astro dies, I can migrate to another static site generator easily.

### Real Business Value

Fast sites convert better. Git-based workflows scale with teams. Self-hosted solutions don't have monthly fees.

## The Downsides (Because Nothing's Perfect)

Content Collections aren't as visual as traditional CMS interfaces. You need to understand frontmatter and Markdown. Complex content relationships require more manual work.

Astro is newer, so some third-party integrations aren't there yet. The ecosystem is smaller than React or Vue.

But for a developer portfolio? These tradeoffs are worth it.

## What I'd Do Differently Next Time

I'd spend more time on the content structure upfront. Getting the schemas right from the beginning saves refactoring later.

I'd also add more automated testing for the build process. Right now, I rely on TypeScript and manual testing.

## Final Thoughts

This stack works for me because it aligns with how I think about web development: performance first, simple when possible, maintainable for the long term.

Is it right for every project? No. But for developer portfolios where performance matters and content is code, it's a solid choice.

The web development landscape changes fast, but these fundamentals don't: fast sites win, simple code lasts, and developer experience affects everything else.

_Written and deployed using the very stack described above. Sometimes the best tools are the simplest ones._
