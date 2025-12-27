import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const ROOT = process.cwd();

const PATHS = {
  siteConfig: path.join(ROOT, 'src', 'config', 'site.ts'),
  blogDir: path.join(ROOT, 'src', 'content', 'blog'),
  projectsDir: path.join(ROOT, 'src', 'content', 'projects'),
  experienceDir: path.join(ROOT, 'src', 'content', 'experience'),
  outFile: path.join(ROOT, 'public', 'llms.txt'),
};

function extractFrontmatter(markdown) {
  // Matches:
  // ---
  // key: value
  // ---
  // body...
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: markdown };

  const [, fmRaw, bodyRaw] = match;
  const data = yaml.load(fmRaw) ?? {};
  return { data, body: bodyRaw ?? '' };
}

function stripMarkdownToText(markdown) {
  // Keep it intentionally simple; this is just for short snippets.
  return String(markdown)
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[[^\]]+\]\([^)]+\)/g, (m) => {
      const text = m.match(/^\[([^\]]+)\]/)?.[1];
      return text ?? '';
    })
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeDate(value) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatISODate(d) {
  return d.toISOString().slice(0, 10);
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function parseSiteConfig(tsSource) {
  const pick = (re) => tsSource.match(re)?.[1]?.trim();

  const title = pick(/title:\s*'([^']+)'/);
  const description = pick(/description:\s*'([^']+)'/);
  const url = pick(/url:\s*'([^']+)'/);

  const authorName = pick(/name:\s*'([^']+)'/);
  const authorEmail = pick(/email:\s*'([^']+)'/);

  const contactEmail = pick(/contact:\s*\{\s*[\s\S]*?email:\s*'([^']+)'/);

  const github = pick(/github:\s*'([^']+)'/);
  const linkedin = pick(/linkedin:\s*'([^']+)'/);
  const instagram = pick(/instagram:\s*'([^']+)'/);

  return {
    title: title || 'Website',
    description: description || '',
    url: (url || '').replace(/\/$/, ''),
    author: {
      name: authorName || '',
      email: authorEmail || '',
      contactEmail: contactEmail || '',
      social: { github, linkedin, instagram },
    },
  };
}

async function readDirFiles(dir, filterFn) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => (filterFn ? filterFn(name) : true))
    .sort((a, b) => a.localeCompare(b));
  return files;
}

function freqMapAdd(map, items) {
  for (const item of items) {
    const k = String(item).toLowerCase();
    map.set(k, (map.get(k) ?? 0) + 1);
  }
}

async function main() {
  const now = new Date();

  const siteConfigSource = await fs.readFile(PATHS.siteConfig, 'utf8');
  const site = parseSiteConfig(siteConfigSource);
  const baseUrl = site.url || '';

  // Blog
  const blogFiles = await readDirFiles(PATHS.blogDir, (n) => n.endsWith('.md'));
  const blogPosts = [];

  for (const filename of blogFiles) {
    const fullPath = path.join(PATHS.blogDir, filename);
    const raw = await fs.readFile(fullPath, 'utf8');
    const { data, body } = extractFrontmatter(raw);

    const publishDate = safeDate(data.publishDate);
    if (!publishDate) continue;
    if (publishDate.getTime() > now.getTime()) continue;

    const slug = String(data.slug || '').trim();
    if (!slug) continue;

    const title = String(data.title || slug).trim();
    const description =
      String(data.description || '').trim() || stripMarkdownToText(body).slice(0, 180);
    const tags = asArray(data.tags);

    blogPosts.push({
      title,
      slug,
      url: `${baseUrl}/blog/${slug}`,
      publishDate,
      description,
      tags,
    });
  }

  blogPosts.sort((a, b) => b.publishDate.getTime() - a.publishDate.getTime());

  // Projects
  const projectFiles = await readDirFiles(PATHS.projectsDir, (n) => n.endsWith('.md'));
  const projects = [];

  for (const filename of projectFiles) {
    const fullPath = path.join(PATHS.projectsDir, filename);
    const raw = await fs.readFile(fullPath, 'utf8');
    const { data, body } = extractFrontmatter(raw);

    const isActive = data.isActive !== false;
    if (!isActive) continue;

    const slug = String(data.slug || filename.replace(/\.md$/, '')).trim();
    if (!slug) continue;

    const title = String(data.title || slug).trim();
    const description =
      String(data.description || '').trim() || stripMarkdownToText(body).slice(0, 180);
    const tags = asArray(data.tags);
    const completedOn = safeDate(data.completedOn);
    const link = typeof data.link === 'string' && data.link.trim() ? data.link.trim() : null;

    projects.push({
      title,
      slug,
      url: `${baseUrl}/projects/${slug}`,
      completedOn,
      link,
      description,
      tags,
    });
  }

  projects.sort((a, b) => {
    const aT = a.completedOn?.getTime() ?? 0;
    const bT = b.completedOn?.getTime() ?? 0;
    return bT - aT;
  });

  // Experience
  const experienceFiles = await readDirFiles(PATHS.experienceDir, (n) => n.endsWith('.json'));
  const experience = [];

  for (const filename of experienceFiles) {
    const fullPath = path.join(PATHS.experienceDir, filename);
    const raw = await fs.readFile(fullPath, 'utf8');
    const data = JSON.parse(raw);

    const title = String(data.title || '').trim();
    const slug = String(data.slug || filename.replace(/\.json$/, '')).trim();
    if (!title || !slug) continue;

    const start = safeDate(data.date);
    const end = safeDate(data.endDate);
    const role = String(data.role || '').trim();
    const location = String(data.location || '').trim();
    const tools = asArray(data.tools);
    const skills = asArray(data.skills);

    experience.push({
      title,
      slug,
      role,
      location,
      start,
      end,
      skills,
      tools,
      isActive: data.isActive !== false,
      current: !!data.current,
    });
  }

  experience.sort((a, b) => {
    const aCurrent = a.current ? 1 : 0;
    const bCurrent = b.current ? 1 : 0;
    if (aCurrent !== bCurrent) return bCurrent - aCurrent;
    const aT = a.start?.getTime() ?? 0;
    const bT = b.start?.getTime() ?? 0;
    return bT - aT;
  });

  // Topics
  const tagFreq = new Map();
  for (const p of blogPosts) freqMapAdd(tagFreq, p.tags);
  for (const p of projects) freqMapAdd(tagFreq, p.tags);
  const topTopics = [...tagFreq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 20)
    .map(([tag]) => tag);

  const lines = [];
  lines.push(`# ${site.title}`);
  if (site.description) lines.push(`> ${site.description}`);
  lines.push('');
  lines.push('Important notes:');
  lines.push('- This is a personal portfolio site for Aaron Molina (software/web engineering work, writing, and career history).');
  if (baseUrl) lines.push(`- Prefer canonical URLs on ${baseUrl}.`);
  lines.push('- Content may include code snippets and technical guidance; verify details against the linked pages and current docs.');
  lines.push('');

  lines.push('## Key pages');
  if (baseUrl) {
    lines.push(`- [Home](${baseUrl}/): Overview, featured work, and navigation.`);
    lines.push(`- [Projects](${baseUrl}/projects): Portfolio projects and case studies.`);
    lines.push(`- [Experience](${baseUrl}/experience): Professional experience timeline, skills, and achievements.`);
    lines.push(`- [Blog](${baseUrl}/blog): Articles about web development, tooling, and engineering decisions.`);
    lines.push(`- [Contact](${baseUrl}/contact): Contact form and social links.`);
  } else {
    lines.push('- Home: /');
    lines.push('- Projects: /projects');
    lines.push('- Experience: /experience');
    lines.push('- Blog: /blog');
    lines.push('- Contact: /contact');
  }
  lines.push('');

  lines.push('## Services / specialties');
  lines.push('- Frontend engineering (React, modern UI architecture)');
  lines.push('- Performance optimization (Core Web Vitals, Lighthouse-driven improvements)');
  lines.push('- Accessibility (WCAG-focused audits and remediation)');
  lines.push('- Full-stack web delivery (Node.js, TypeScript, integrations)');
  lines.push('');

  lines.push('## Projects');
  for (const p of projects) {
    const bits = [];
    if (p.completedOn) bits.push(`completed ${formatISODate(p.completedOn)}`);
    if (p.tags.length) bits.push(`tags: ${p.tags.join(', ')}`);
    const meta = bits.length ? ` (${bits.join('; ')})` : '';
    const extra = p.link ? ` External: ${p.link}` : '';
    lines.push(`- [${p.title}](${p.url}): ${p.description}${meta}.${extra}`.replace(/\.\./g, '.'));
  }
  lines.push('');

  lines.push('## Blog posts');
  for (const post of blogPosts) {
    const meta = ` (${formatISODate(post.publishDate)}; tags: ${post.tags.join(', ') || 'none'})`;
    lines.push(`- [${post.title}](${post.url}): ${post.description}${meta}`);
  }
  lines.push('');

  lines.push('## Experience (items listed on /experience)');
  for (const e of experience) {
    const start = e.start ? formatISODate(e.start) : null;
    const end = e.end ? formatISODate(e.end) : e.current ? 'present' : null;
    const dateRange = start && end ? `${start} → ${end}` : start ? start : '';
    const role = e.role ? ` — ${e.role}` : '';
    const loc = e.location ? ` (${e.location})` : '';
    const skills = e.skills.length ? `; skills: ${e.skills.slice(0, 10).join(', ')}` : '';
    lines.push(`- ${e.title}${role}${loc}${dateRange ? ` — ${dateRange}` : ''}${skills}`);
  }
  lines.push('');

  if (topTopics.length) {
    lines.push('## Topics');
    lines.push(topTopics.map((t) => `- ${t}`).join('\n'));
    lines.push('');
  }

  lines.push('## Contact');
  if (baseUrl) lines.push(`- [Contact page](${baseUrl}/contact)`);
  const email = site.author.contactEmail || site.author.email;
  if (email) lines.push(`- Email: ${email}`);
  if (site.author.social.github) lines.push(`- GitHub: ${site.author.social.github}`);
  if (site.author.social.linkedin) lines.push(`- LinkedIn: ${site.author.social.linkedin}`);
  if (site.author.social.instagram) lines.push(`- Instagram: ${site.author.social.instagram}`);
  lines.push('');

  const out = lines.join('\n');
  await fs.mkdir(path.dirname(PATHS.outFile), { recursive: true });
  await fs.writeFile(PATHS.outFile, out, 'utf8');
  console.log(`Wrote ${PATHS.outFile}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

