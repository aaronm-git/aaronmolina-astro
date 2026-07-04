import { getCollection } from 'astro:content';
import homepageContent from '@/content/site/homepage.json';
import siteSettings from '@/content/site/settings.json';
import { getChatbotServices, renderServicesSection } from '@/lib/chatbot-context';

const SITE = siteSettings.siteUrl.replace(/\/$/, '');

const formatDate = (d?: Date | null): string => {
  if (!d) return 'present';
  return d.toISOString().slice(0, 10);
};

/**
 * Aggregates every portfolio content collection into a single markdown document.
 * Used by both `/llms.txt` and the chat function as a cached system-prompt knowledge base.
 */
export async function buildPortfolioKnowledge(): Promise<string> {
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

  const services = await getChatbotServices();
  const serviceLines = renderServicesSection(services);

  const tagSet = new Set<string>();
  blog.forEach(p => p.data.tags.forEach(t => tagSet.add(t)));
  projects.forEach(p => p.data.technologies.forEach(t => tagSet.add(t)));
  const topics = [...tagSet].sort();

  const projectLines = projects
    .map(p => {
      const summary = p.data.summary ? `: ${p.data.summary}` : '';
      const completed = p.data.completedOn ? ` (completed ${formatDate(p.data.completedOn)})` : '';
      const live = p.data.liveUrl ? ` Live: ${p.data.liveUrl}` : '';
      return `- [${p.data.title}](${SITE}/projects/${p.data.slug})${summary}${completed}.${live}`;
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

  const roleLines = roles
    .map(r => {
      const org = orgBySlug.get(r.data.organization);
      const orgName = org?.name ?? r.data.organization;
      const location = r.data.location ? ` (${r.data.location})` : '';
      const start = formatDate(r.data.startDate);
      const end = r.data.current ? 'present' : formatDate(r.data.endDate);
      const techs = r.data.technologies.length > 0 ? `; skills: ${r.data.technologies.join(', ')}` : '';
      return `- ${orgName} - ${r.data.title}${location} - ${start} to ${end}${techs}`;
    })
    .join('\n');

  const skillLines = skills
    .map(t => `- ${t.data.name}${t.data.level ? ` (level ${t.data.level}/10)` : ''}`)
    .join('\n');

  const topicLines = topics.map(t => `- ${t}`).join('\n');

  const social = siteSettings.author.socialLinks
    .map(s => `- ${s.label}: ${s.url}`)
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
${serviceLines}

## Projects
${projectLines}

## Blog posts
${blogLines}

## Experience
${roleLines}

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
