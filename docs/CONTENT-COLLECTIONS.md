# Content Collections & Chatbot Knowledge

All portfolio, resume, and business data on aaronmolina.me lives in **Astro
Content Collections** with type-safe Zod schemas. Pages read from the
collections with `getCollection()`, and the "Ask my portfolio" chatbot is
grounded in the exact same content. There is a single source of truth: if a
fact appears on the site and the AI should know it, it comes from a collection.

## Where things live

| Collection      | Location                              | Format | Purpose                                   |
| --------------- | ------------------------------------- | ------ | ----------------------------------------- |
| `projects`      | `src/content/projects/*.md`           | MD     | Portfolio projects / case studies         |
| `roles`         | `src/content/roles/*.json`            | JSON   | Work experience (resume history)          |
| `organizations` | `src/content/organizations/*.json`    | JSON   | Companies referenced by roles/projects    |
| `services`      | `src/content/services/*.mdx`          | MDX    | Service offerings ("How I can help")      |
| `technologies`  | `src/content/technologies/*.json`     | JSON   | Skills / tech stack                       |
| `profile`       | `src/content/profile/profile.json`    | JSON   | Base bio + chatbot profile data           |
| `testimonials`  | `src/content/testimonials/*.json`     | JSON   | Client testimonials (optional)            |
| `blog`          | `src/content/blog/*.mdx`              | MDX    | Articles                                  |
| `education`, `certifications`, `awards` | `src/content/<name>/*.json` | JSON | Optional resume-adjacent collections |

Schemas are defined in [`src/content.config.ts`](../src/content.config.ts).
Collections marked "optional" use `optionalGlob`, so an empty directory (or no
directory at all) will not break the build.

> **Note:** The per-keyword `/hire/*` landing pages (`react`, `nextjs`,
> `headless-cms`) keep their SEO-tuned marketing copy in
> `src/content/site/hire.json`. The **canonical service offerings** used by the
> homepage, the main `/hire` page, and the chatbot all come from the `services`
> collection.

## The chatbot is grounded in collections

The chatbot never invents information. Its knowledge base is built at build time
from the collections and served as a static file that the chat function fetches
at runtime.

```
content collections
      │
      ▼
src/lib/chatbot-context.ts  ──►  buildChatbotContext()
      │                              (source-labeled, respects includeInChatbot)
      ▼
src/pages/chat-context.txt.ts  ──►  /chat-context.txt  (built to dist/)
      │
      ▼
netlify/functions/chat.ts  ──fetch──►  system prompt  ──►  Claude
```

Every fact in the generated context carries a **source label** so the model can
only answer from grounded content:

```
- Profile: Aaron Molina, Senior Frontend & Fullstack Developer.
- Service: Headless CMS Integration - Aaron integrates Sanity, Storyblok...
- Project: TypeLyft - A free open-source typography scale builder... Live: ...
- Experience: LA Clippers - Lead Full-stack Developer, 2024-11 to 2025-06...
- Skill: Astro (level 10/10)
```

The public `/llms.txt` file (`src/lib/portfolio-knowledge.ts`) is generated the
same way and shares the `services` collection so services are never duplicated.

## Controlling what the chatbot can see

Most collections support two chatbot fields:

- `includeInChatbot` (boolean, default `true`) — set to `false` to hide an entry
  from the AI knowledge base while keeping it on the website.
- `chatbotSummary` (string, optional) — a clean, third-person summary written
  specifically for the AI. Falls back to `summary` when omitted.

## How to add content

### Add a project

Create `src/content/projects/<slug>.md`:

```md
---
title: My New Project
slug: my-new-project
summary: One-sentence description shown on cards and in the chatbot.
technologies: [nextjs, typescript, tailwindcss]
liveUrl: https://example.com
completedOn: 2026-06-01
featured: true
sortOrder: -1        # lower sorts first among featured
isActive: true
includeInChatbot: true
# chatbotSummary: Optional AI-specific summary
---

Full case-study body in Markdown...
```

### Add a job / experience

Create `src/content/roles/<org>-<year>-<title>.json`. Reference an organization
by its `slug` (add the org under `src/content/organizations/` if it does not
exist yet):

```json
{
  "title": "Senior Engineer",
  "slug": "acme-2026-senior-engineer",
  "organization": "acme",
  "location": "Remote",
  "startDate": "2026-01-01",
  "current": true,
  "summary": "What you did in this role.",
  "highlights": ["..."],
  "achievements": ["..."],
  "technologies": ["react", "typescript"],
  "includeInChatbot": true
}
```

### Add a service

Create `src/content/services/<slug>.mdx`. `sortOrder` controls the order the
service appears in the homepage bento grid and the hire pages:

```mdx
---
title: My New Service
slug: my-new-service
summary: Short one-liner.
description: The longer marketing copy rendered on the site card.
icon: rocket           # rocket | globe | bolt | code | ...
phaseTag: Build        # label on the bento card
deliverables: ["Thing one", "Thing two"]
technologies: [astro, typescript]
sortOrder: 4
featured: true
chatbotSummary: Third-person summary the AI will use.
---

Optional MDX body.
```

### Add a skill / technology

Create `src/content/technologies/<slug>.json`. Skills appear in the chatbot's
"expert and near-expert" list when `featured` is `true` and `level >= 8`:

```json
{
  "name": "My Tool",
  "slug": "my-tool",
  "category": "tool",
  "level": 9,
  "featured": true,
  "includeInChatbot": true
}
```

### Add a testimonial

Create `src/content/testimonials/<slug>.json`:

```json
{
  "name": "Jane Doe",
  "slug": "jane-doe",
  "role": "CTO",
  "organization": "Acme",
  "quote": "Aaron shipped fast and communicated clearly.",
  "featured": true,
  "includeInChatbot": true
}
```

### Update chatbot profile / bio

Edit `src/content/profile/profile.json`. `chatbotSummary` and `specialties`
feed directly into the AI knowledge base. `{yearsOfExperience}` is interpolated
automatically.

## Verify your changes

```bash
pnpm build                 # builds the site + regenerates the chatbot context
cat dist/chat-context.txt  # inspect exactly what the AI will see
```

Updating any collection entry updates both the website and the chatbot on the
next build. No code changes required.
