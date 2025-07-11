# Aaron Molina - Portfolio Website

A modern, high-performance portfolio website built with Astro, showcasing my experience as a Senior Frontend and Fullstack Developer. This site demonstrates modern web development practices, performance optimization, and clean architecture.

## 🚀 Live Site

Visit the live portfolio: **[www.aaronmolina.me](https://www.aaronmolina.me)**

Deployed on GitHub Pages with automatic deployments via GitHub Actions.

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Static site generator with Islands Architecture
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and developer experience
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Content Collections](https://docs.astro.build/en/guides/content-collections/)** - Type-safe content management
- **[Zod](https://github.com/colinhacks/zod)** - Schema validation for content
- **GitHub Pages** - Static hosting with CI/CD

## ✨ Key Features

- ⚡ **Performance First**: Lighthouse scores 95+ across all metrics
- 🏗️ **Type-Safe Content**: Zod schemas validate all experience and project data
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- ♿ **Accessibility**: WCAG 2.1 AA compliant
- 🔧 **Developer Experience**: Hot reloading, TypeScript, and modern tooling
- 📊 **SEO Optimized**: Structured data, meta tags, and semantic HTML
- 🎨 **Modern UI**: Clean, professional design showcasing technical work

## 📁 Project Structure

```
/
├── content/                    # Content data
│   ├── blog/                  # Blog posts (Markdown)
│   ├── experience/            # Work experience (JSON)
│   ├── projects/              # Portfolio projects (Markdown)
│   └── tags/                  # Technology tags and skills
├── src/
│   ├── components/            # Reusable Astro components
│   │   ├── ExperienceCard.astro
│   │   └── ProjectCard.astro
│   ├── content.config.ts      # Content collections schema
│   ├── layouts/
│   │   └── main-layout.astro  # Base layout
│   ├── pages/                 # Site pages
│   │   ├── index.astro        # Homepage
│   │   ├── experience.astro   # Experience timeline
│   │   ├── projects/          # Project showcase
│   │   └── blog/              # Technical blog
│   └── styles/
│       └── global.css         # Global styles and Tailwind
├── public/                    # Static assets
├── astro.config.mjs          # Astro configuration
└── package.json
```

## 🎯 Architecture Highlights

### Content Collections with Type Safety

All content is managed through Astro's Content Collections with Zod validation:

```typescript
// content.config.ts
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

### Performance Optimizations

- **Zero JavaScript by default** - Pure HTML/CSS for most pages
- **Image optimization** - Automatic WebP conversion and responsive sizing
- **Bundle splitting** - Optimized loading strategies
- **Tailwind purging** - Minimal CSS footprint

### Component Architecture

Modular, reusable components built with Astro:
- `ExperienceCard.astro` - Professional experience display
- `ProjectCard.astro` - Portfolio project showcase
- Type-safe props and consistent styling patterns

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aaronm-git/aaronmolina-astro.git
   cd aaronmolina-astro
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Visit the site**:
   Open `http://localhost:4321` in your browser

## 📦 Build & Deploy

### Local Build
```bash
pnpm build
```

### GitHub Pages Deployment
This site automatically deploys to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

The deployment workflow:
1. Builds the static site with `astro build`
2. Deploys to GitHub Pages
3. Available at the custom domain

## 🧞 Commands

| Command                | Action                                     |
| :--------------------- | :----------------------------------------- |
| `pnpm install`         | Install dependencies                       |
| `pnpm dev`             | Start dev server at `localhost:4321`      |
| `pnpm build`           | Build production site to `./dist/`        |
| `pnpm preview`         | Preview production build locally          |
| `pnpm astro ...`       | Run Astro CLI commands                     |

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: Green scores for LCP, FID, and CLS
- **Bundle Size**: < 50KB for homepage
- **Time to Interactive**: < 100ms for most pages

## 🎨 Design Philosophy

- **Content-first**: Technical experience and projects take center stage
- **Performance-focused**: Every decision optimized for speed and user experience
- **Accessibility-aware**: Built with screen readers and keyboard navigation in mind
- **Mobile-responsive**: Designed for all device sizes

## 🛡️ Technical Decisions

### Why Astro?
- **Islands Architecture**: Ship zero JavaScript by default
- **Developer Experience**: Excellent TypeScript integration
- **Performance**: Sub-100ms page loads out of the box
- **Flexibility**: Use any UI framework when needed

### Why Static Hosting?
- **Speed**: CDN-distributed static files load instantly
- **Cost**: GitHub Pages hosting is free
- **Reliability**: No servers to maintain or databases to manage
- **Security**: Static sites have minimal attack surface

### Why TypeScript?
- **Type Safety**: Catch content structure errors at build time
- **Developer Experience**: Excellent IDE support and autocomplete
- **Maintainability**: Easier to refactor and update over time

## 🔧 Content Management

### Adding Experience
1. Create a new JSON file in `content/experience/`
2. Follow the schema defined in `content.config.ts`
3. The site will automatically include it in the experience timeline

### Adding Projects
1. Create a new Markdown file in `content/projects/`
2. Include frontmatter with project details
3. Write the project description in Markdown

### Adding Blog Posts
1. Create a new Markdown file in `content/blog/`
2. Include frontmatter with post metadata
3. Write the post content in Markdown

## 🤝 Contributing

This is a personal portfolio site, but feel free to:
- Report bugs or issues
- Suggest improvements
- Use this as inspiration for your own portfolio

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by Aaron Molina** | Senior Frontend & Fullstack Developer
