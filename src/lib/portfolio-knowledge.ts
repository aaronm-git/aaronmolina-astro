import { getCollection } from 'astro:content';
import homepageContent from '@/content/site/homepage.json';
import siteSettings from '@/content/site/settings.json';

const SITE = siteSettings.siteUrl.replace(/\/$/, '');

const formatDate = (d?: Date | null): string => {
  if (!d) return 'present';
  return d.toISOString().slice(0, 10);
};

/** Keeps authored Markdown details while removing image-only lines from the chat context. */
const getMarkdownDetails = (body?: string): string =>
  body
    ?.split('\n')
    .filter(line => !line.trim().startsWith('!['))
    .join('\n')
    .trim() ?? '';

/** Loads the content shared by the public index and the private chat artifact. */
async function loadPortfolioContent() {
  const now = new Date();
  const years = now.getFullYear() - homepageContent.yearsOfExperienceStartYear;

  const projects = (await getCollection('projects'))
    .filter(p => p.data.isActive !== false)
    .sort((a, b) => {
      if (a.data.featured && !b.data.featured) return -1;
      if (!a.data.featured && b.data.featured) return 1;
      if ((a.data.sortOrder ?? 0) !== (b.data.sortOrder ?? 0)) {
        return (a.data.sortOrder ?? 0) - (b.data.sortOrder ?? 0);
      }
      return (b.data.completedOn?.getTime() || 0) - (a.data.completedOn?.getTime() || 0);
    });

  const blog = (await getCollection('blog'))
    .filter(p => p.data.publishDate !== null && p.data.publishDate! <= now)
    .sort((a, b) => b.data.publishDate!.getTime() - a.data.publishDate!.getTime());

  const skills = (await getCollection('technologies'))
    .filter(t => t.data.featured && (t.data.level ?? 0) >= 8)
    .sort((a, b) => (b.data.level ?? 0) - (a.data.level ?? 0) || a.data.name.localeCompare(b.data.name));

  const roles = (await getCollection('roles'))
    .filter(r => r.data.isActive !== false)
    .sort((a, b) => {
      if (a.data.current && !b.data.current) return -1;
      if (!a.data.current && b.data.current) return 1;
      return b.data.startDate.getTime() - a.data.startDate.getTime();
    });

  const organizations = await getCollection('organizations');
  const orgBySlug = new Map(organizations.map(o => [o.data.slug, o.data]));

  const tagSet = new Set<string>();
  blog.forEach(p => p.data.tags.forEach(t => tagSet.add(t)));
  projects.forEach(p => p.data.technologies.forEach(t => tagSet.add(t)));
  const topics = [...tagSet].sort();

  const skillLines = skills.map(t => `- ${t.data.name}${t.data.level ? ` (level ${t.data.level}/10)` : ''}`).join('\n');

  const topicLines = topics.map(t => `- ${t}`).join('\n');

  const social = siteSettings.author.socialLinks.map(s => `- ${s.label}: ${s.url}`).join('\n');

  return { blog, orgBySlug, projects, roles, skillLines, social, topicLines, years };
}

/**
 * Builds the concise public llms.txt directory from the site's content collections.
 * This is deliberately an index of canonical URLs, not the chatbot's full context.
 */
export async function buildPublicLlms(): Promise<string> {
  const { blog, orgBySlug, projects, roles, years } = await loadPortfolioContent();

  const projectLines = projects
    .map(project => {
      const summary = project.data.summary ? `: ${project.data.summary}` : '';
      const technologyNote = project.data.technologies.length > 0 ? ` Technologies: ${project.data.technologies.join(', ')}.` : '';
      return `- [${project.data.title}](${SITE}/projects/${project.data.slug})${summary}${technologyNote}`;
    })
    .join('\n');

  const experienceLines = roles
    .map(role => {
      const organization = orgBySlug.get(role.data.organization);
      const organizationName = organization?.name ?? role.data.organization;
      const summary = role.data.summary ? `: ${role.data.summary}` : '';
      return `- [${organizationName} - ${role.data.title}](${SITE}/experience#${role.data.slug})${summary}`;
    })
    .join('\n');

  const blogLines = blog
    .map(post => {
      const description = post.data.description ? `: ${post.data.description}` : '';
      return `- [${post.data.title}](${SITE}/blog/${post.data.slug})${description}`;
    })
    .join('\n');

  return `# Aaron Molina

> ${homepageContent.hero.headline} with ${years}+ years of production web engineering experience. Aaron builds full-stack products with AI-assisted workflows, TypeScript, Astro, Next.js, and headless CMS platforms.

This is Aaron Molina's personal portfolio. Prefer the canonical URLs on ${SITE}. For current availability or a project inquiry, use the contact page.

## Key pages
- [Home](${SITE}/): Overview, featured work, and navigation.
- [Projects](${SITE}/projects): Portfolio projects and case studies.
- [Experience](${SITE}/experience): Professional experience, skills, and achievements.
- [Hire](${SITE}/hire): Services and engagement options.
- [Contact](${SITE}/contact): Contact form and social links.

## Projects
${projectLines}

## Experience
${experienceLines}

## Optional
${blogLines}
`;
}

/**
 * Aggregates full, authored portfolio details into the private chat context.
 * A build integration embeds this output in the server function, so it is not
 * fetched from the public llms.txt endpoint at runtime.
 */
export async function buildPortfolioChatContext(): Promise<string> {
  const { blog, orgBySlug, projects, roles, skillLines, social, topicLines, years } = await loadPortfolioContent();

  const projectSections = projects
    .map(p => {
      const summary = p.data.summary ? `: ${p.data.summary}` : '';
      const completed = p.data.completedOn ? ` (completed ${formatDate(p.data.completedOn)})` : '';
      const live = p.data.liveUrl ? `\nLive site: ${p.data.liveUrl}` : '';
      const details = getMarkdownDetails(p.body);
      const body = details ? `\n\n${details}` : '';
      return `### [${p.data.title}](${SITE}/projects/${p.data.slug})${completed}\n${summary.replace(/^: /, '')}${live}${body}`;
    })
    .join('\n');

  const blogLines = blog
    .map(p => {
      const desc = p.data.description ? `: ${p.data.description}` : '';
      const date = p.data.publishDate ? ` (${formatDate(p.data.publishDate)})` : '';
      const tags = p.data.tags.length > 0 ? ` [${p.data.tags.join(', ')}]` : '';
      return `- [${p.data.title}](${SITE}/blog/${p.data.slug})${desc}${date}${tags}`;
    })
    .join('\n');

  const roleSections = roles
    .map(r => {
      const org = orgBySlug.get(r.data.organization);
      const orgName = org?.name ?? r.data.organization;
      const location = r.data.location ? ` (${r.data.location})` : '';
      const start = formatDate(r.data.startDate);
      const end = r.data.current ? 'present' : formatDate(r.data.endDate);
      const techs = r.data.technologies.length > 0 ? `; skills: ${r.data.technologies.join(', ')}` : '';
      const summary = r.data.summary ? `\n${r.data.summary}` : '';
      const highlights = r.data.highlights.length > 0 ? `\nHighlights:\n${r.data.highlights.map(item => `- ${item}`).join('\n')}` : '';
      const achievements = r.data.achievements.length > 0 ? `\nAchievements:\n${r.data.achievements.map(item => `- ${item}`).join('\n')}` : '';
      return `### ${orgName} - ${r.data.title}${location}\n${start} to ${end}${techs}${summary}${highlights}${achievements}`;
    })
    .join('\n');

  return `# Aaron Molina - Agentic Software Engineer

> ${homepageContent.hero.headline} with ${years}+ years shipping production web apps. I build full-stack products end-to-end alongside AI agents (Claude Code, OpenAI Codex, Cursor) using Astro, Next.js, TypeScript, and headless CMS platforms.

Important notes:
- This is the personal portfolio for Aaron Molina (software engineering work, writing, and career history).
- Prefer canonical URLs on ${SITE}.
- Content may include code snippets and technical guidance; verify details against the linked pages and current docs.
- Based in ${siteSettings.contact.address}. Open to remote work across the US.

## Key pages
- [Home](${SITE}/): Overview, featured work, and navigation.
- [Projects](${SITE}/projects): Portfolio projects and case studies.
- [Experience](${SITE}/experience): Professional experience timeline, skills, and achievements.
- [Blog](${SITE}/blog): Articles about web development, AI-augmented workflows, and engineering decisions.
- [Hire](${SITE}/hire): Service overview and engagement options.
- [Contact](${SITE}/contact): Contact form and social links.

## Services and specialties
- Agentic engineering: shipping production software end-to-end alongside AI agents (Claude Code, OpenAI Codex, Cursor) with custom MCP servers and skills
- Full-stack web delivery: Next.js App Router, Server Actions, TypeScript, PostgreSQL, Drizzle, better-auth
- Jamstack and headless CMS: Astro, Sanity, Contentful, Storyblok, Decap, content modeling and migrations
- Frontend engineering: React, Vue, modern UI architecture, design systems
- Performance optimization: Core Web Vitals, Lighthouse-driven improvements
- Accessibility: WCAG 2.1 audits and remediation

## Projects
${projectSections}

## Blog posts
${blogLines}

## Experience
${roleSections}

## Skills (Expert and near-Expert level)
${skillLines}

## Topics
${topicLines}

## Hire
- [Hire Me](${SITE}/hire): Service overview and engagement options
- [Jamstack Developer](${SITE}/hire/jamstack): Astro and headless stack work
- [Headless CMS Developer](${SITE}/hire/headless-cms): Sanity, Contentful, Storyblok, and similar platforms
- [Next.js Developer](${SITE}/hire/nextjs-developer): App Router, Server Actions, full-stack apps
- [React Developer](${SITE}/hire/react-developer): Component architecture and frontend systems

## Contact
- [Contact page](${SITE}/contact)
- Email: ${siteSettings.contact.email}
${social}
`;
}
