# Content Management Guide

This guide explains how to manage content in the portfolio without a CMS. Content is stored as files in `src/content/` and validated at build time using Astro Content Collections with Zod schemas.

## Quick Reference

| Content Type   | Location                     | Format   | VS Code Snippet |
|---------------|------------------------------|----------|-----------------|
| Blog Posts    | `src/content/blog/`          | Markdown | `blogpost`      |
| Projects      | `src/content/projects/`      | Markdown | `project`       |
| Technologies  | `src/content/technologies/`  | JSON     | `tech`          |
| Organizations | `src/content/organizations/` | JSON     | `org`           |
| Roles         | `src/content/roles/`         | JSON     | `role`          |
| Site Settings | `src/content/site/`          | JSON     | (edit existing) |
| Profile       | `src/content/profile/`       | JSON     | (edit existing) |

## Creating New Content

### Adding a Blog Post

1. Create a new file in `src/content/blog/`
2. Name format: `YYYY-MM-DD-title-slug.md`
3. Type `blogpost` + Tab to use the snippet
4. Fill in the frontmatter fields
5. Write content in Markdown below the `---`

**Example:** `src/content/blog/2024-01-15-building-with-astro.md`

```markdown
---
title: Building with Astro
slug: building-with-astro
publishDate: 2024-01-15T00:00:00.000Z
description: My experience building a portfolio with Astro
tags:
  - astro
  - typescript
---

Your content here...
```

### Adding a Project

1. Create a new file in `src/content/projects/`
2. Name format: `project-slug.md`
3. Type `project` + Tab to use the snippet
4. Add project image to `src/images/`
5. Reference image in frontmatter: `../../images/project-name.jpg`

**Example:** `src/content/projects/my-awesome-app.md`

```markdown
---
title: My Awesome App
slug: my-awesome-app
summary: A brief description of the project
technologies:
  - react
  - typescript
  - tailwind
featuredImage: ../../images/my-awesome-app.jpg
liveUrl: https://example.com
repoUrl: https://github.com/user/repo
completedOn: 2024-01-01T00:00:00.000Z
isActive: true
featured: true
sortOrder: 0
---

Detailed project description...
```

### Adding a Technology/Skill

1. Create a new file in `src/content/technologies/`
2. Name format: `technology-slug.json`
3. Type `tech` + Tab to use the snippet
4. Run `pnpm run skills:generate` to update skill labels

**Example:** `src/content/technologies/vue.json`

```json
{
  "name": "Vue.js",
  "slug": "vue",
  "category": "framework",
  "url": "https://vuejs.org",
  "featured": false,
  "sortOrder": 0
}
```

### Adding Work Experience

1. Create organization in `src/content/organizations/` if it doesn't exist
2. Create role file in `src/content/roles/`
3. Name format: `org-year-title.json`
4. Link to organization via its slug

**Example:** `src/content/roles/acme-2024-senior-developer.json`

```json
{
  "title": "Senior Developer",
  "slug": "acme-2024-senior-developer",
  "organization": "acme-corp",
  "location": "Remote",
  "employmentType": "full_time",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "",
  "current": true,
  "summary": "Leading frontend development",
  "highlights": [
    "Led migration to React 18",
    "Implemented design system"
  ],
  "achievements": [],
  "technologies": ["react", "typescript", "tailwind"],
  "projects": [],
  "featured": true,
  "sortOrder": 0,
  "isActive": true
}
```

## Field Reference

### Common Fields

| Field       | Description                                    |
|-------------|------------------------------------------------|
| `slug`      | URL-safe identifier (lowercase, hyphens only)  |
| `featured`  | Show on homepage                               |
| `isActive`  | Show on site (false to hide without deleting)  |
| `sortOrder` | Display order (lower numbers appear first)     |

### Date Format

Use ISO 8601 format: `2024-01-15T00:00:00.000Z`

For "current" roles:
- Leave `endDate` as empty string `""`
- Set `current: true`

### Technology Arrays

Use technology slugs (not display names):

```json
"technologies": ["react", "typescript", "tailwind"]
```

Reference existing slugs from `src/content/technologies/`. Run `ls src/content/technologies/` to see available options.

### Categories for Technologies

| Category    | Description                        |
|-------------|------------------------------------|
| `language`  | Programming languages (JS, Python) |
| `framework` | Full frameworks (React, Vue)       |
| `library`   | Libraries (Lodash, Axios)          |
| `tool`      | Dev tools (Webpack, ESLint)        |
| `platform`  | Platforms (AWS, Vercel)            |
| `service`   | Services (Stripe, Auth0)           |
| `cms`       | Content management systems         |
| `concept`   | Concepts (REST, GraphQL)           |
| `other`     | Anything else                      |

## Validation

Content is validated at build time by Zod schemas defined in `src/content.config.ts`.

If validation fails, the build will error with details about the invalid field. For example:

```
[ERROR] Invalid frontmatter in "src/content/blog/my-post.md"
- title: Required
```

### Running Validation

```bash
# Full build (validates everything)
pnpm build

# Type checking only
npx astro check
```

## VS Code Features

### Snippets

Type the prefix and press Tab:

- `tech` - New technology entry
- `org` - New organization entry
- `role` - New role/experience entry
- `project` - New project frontmatter
- `blogpost` - New blog post frontmatter

### JSON Schema Validation

JSON files in `src/content/technologies/`, `src/content/organizations/`, and `src/content/roles/` have real-time validation. VS Code will show errors for:

- Missing required fields
- Invalid field values
- Wrong data types

### Recommended Extensions

Install recommended extensions when prompted, or run:

```bash
code --install-extension astro-build.astro-vscode
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension redhat.vscode-yaml
code --install-extension yzhang.markdown-all-in-one
code --install-extension davidanson.vscode-markdownlint
```

## Tips

1. **Preview changes**: Run `pnpm dev` to see changes immediately
2. **Check build**: Run `pnpm build` before committing to catch validation errors
3. **Skill labels**: After adding technologies, run `pnpm run skills:generate`
4. **Images**: Place images in `src/images/` and reference with relative paths
5. **Drafts**: Set `publishDate: null` for blog posts or `isActive: false` for other content

## Directory Structure

```
src/content/
├── blog/                 # Blog posts (Markdown)
├── projects/             # Portfolio projects (Markdown)
├── technologies/         # Skills and tools (JSON)
├── organizations/        # Companies/clients (JSON)
├── roles/                # Work experience (JSON)
├── profile/              # Personal profile (JSON)
├── site/                 # Site configuration (JSON)
│   ├── settings.json     # Site metadata, SEO
│   ├── navigation.json   # Nav items
│   ├── footer.json       # Footer content
│   ├── cta.json          # Call-to-action
│   ├── pages.json        # Page-level content
│   └── homepage.json     # Hero section
└── _legacy/              # Archived content
```
