import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const repoRoot = process.cwd();

const paths = {
  tagsDir: path.join(repoRoot, 'src/content/tags'),
  experienceDir: path.join(repoRoot, 'src/content/experience'),
  projectsDir: path.join(repoRoot, 'src/content/projects'),
  blogDir: path.join(repoRoot, 'src/content/blog'),
  siteSettings: path.join(repoRoot, 'src/content/site/settings.json'),
  siteHomepage: path.join(repoRoot, 'src/content/site/homepage.json'),
  profileDir: path.join(repoRoot, 'src/content/profile'),
  profileFile: path.join(repoRoot, 'src/content/profile/profile.json'),
  technologiesDir: path.join(repoRoot, 'src/content/technologies'),
  organizationsDir: path.join(repoRoot, 'src/content/organizations'),
  rolesDir: path.join(repoRoot, 'src/content/roles'),
};

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function techCategoryForSlug(slug) {
  const language = new Set(['javascript', 'typescript', 'python', 'php', 'sql']);
  const framework = new Set(['react', 'nextjs', 'nuxt', 'vue', 'gatsby']);
  const cms = new Set(['wordpress', 'drupal', 'sanity', 'prismic', 'contentful', 'datocms', 'decapcms']);
  const tool = new Set(['git', 'github', 'figma', 'photoshop', 'gtm', 'ga4', 'graphql', 'rest-api', 'oauth']);
  const platform = new Set(['firebase', 'aws', 'gcp', 'shopify', 'serverless', 'mongodb', 'nodejs']);
  const library = new Set(['sass', 'bootstrap', 'material-ui', 'tailwindcss', 'express']);
  const concept = new Set(['seo', 'frontend', 'fullstack', 'accessibility']);

  if (language.has(slug)) return 'language';
  if (framework.has(slug)) return 'framework';
  if (library.has(slug)) return 'library';
  if (tool.has(slug)) return 'tool';
  if (platform.has(slug)) return 'platform';
  if (cms.has(slug)) return 'cms';
  if (concept.has(slug)) return 'concept';
  return 'other';
}

const skillToSlug = new Map([
  ['html', 'html5'],
  ['html5', 'html5'],
  ['css', 'css3'],
  ['css3', 'css3'],
  ['javascript', 'javascript'],
  ['typescript', 'typescript'],
  ['react', 'react'],
  ['bootstrap', 'bootstrap'],
  ['rest api', 'rest-api'],
  ['rest-api', 'rest-api'],
  ['node.js', 'nodejs'],
  ['nodejs', 'nodejs'],
  ['google tag manager', 'gtm'],
  ['gtm', 'gtm'],
  ['ga4', 'ga4'],
]);

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

async function writeJson(filePath, data) {
  const content = JSON.stringify(data, null, 2) + '\n';
  await fs.writeFile(filePath, content, 'utf8');
}

async function listFiles(dir, ext) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && (!ext || e.name.endsWith(ext)))
    .map((e) => path.join(dir, e.name));
}

function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---')) return { data: {}, body: markdown };
  const end = markdown.indexOf('\n---', 3);
  if (end === -1) return { data: {}, body: markdown };
  const raw = markdown.slice(3, end + 1); // includes trailing newline
  const body = markdown.slice(end + '\n---'.length + 1); // after closing --- and newline
  const data = yaml.load(raw) ?? {};
  return { data, body };
}

function stringifyFrontmatter(data, body) {
  const fm = yaml.dump(data, { lineWidth: 120, quotingType: "'", noRefs: true });
  return `---\n${fm}---\n${body.replace(/^\n/, '')}`;
}

async function migrateProfile() {
  await ensureDir(paths.profileDir);

  if (await fileExists(paths.profileFile)) return;

  const [settings, homepage] = await Promise.all([readJson(paths.siteSettings), readJson(paths.siteHomepage)]);
  const profile = {
    fullName: homepage?.hero?.name ?? settings?.author?.name ?? 'Your Name',
    headline: homepage?.hero?.headline ?? 'Your Headline',
    summary: homepage?.hero?.description ?? settings?.siteDescription ?? '',
    location: settings?.author?.location ?? '',
    website: settings?.siteUrl ?? '',
    email: settings?.contact?.email ?? settings?.author?.email ?? '',
    phone: settings?.contact?.phone ?? '',
    // Intentionally blank: Decap media is in public/images; you can upload and set later.
    avatar: '',
    availability: 'open_to_work',
    primaryRoles: [],
  };

  await writeJson(paths.profileFile, profile);
}

async function migrateTechnologiesFromTags() {
  await ensureDir(paths.technologiesDir);

  const tagFiles = await listFiles(paths.tagsDir, '.json');
  const created = new Set();

  for (const file of tagFiles) {
    const tag = await readJson(file);
    const slug = tag.slug ?? slugify(tag.title);
    const outPath = path.join(paths.technologiesDir, `${slug}.json`);

    const tech = {
      title: tag.title ?? slug,
      slug,
      category: techCategoryForSlug(slug),
      url: '',
      featured: false,
      sortOrder: 0,
    };

    if (!(await fileExists(outPath))) {
      await writeJson(outPath, tech);
    }
    created.add(slug);
  }

  return created;
}

async function ensureTechnology(slug, title) {
  await ensureDir(paths.technologiesDir);
  const outPath = path.join(paths.technologiesDir, `${slug}.json`);
  if (await fileExists(outPath)) return;
  await writeJson(outPath, {
    title: title ?? slug,
    slug,
    category: techCategoryForSlug(slug),
    url: '',
    featured: false,
    sortOrder: 0,
  });
}

async function migrateOrgsAndRoles() {
  await ensureDir(paths.organizationsDir);
  await ensureDir(paths.rolesDir);

  const experienceFiles = await listFiles(paths.experienceDir, '.json');

  for (const file of experienceFiles) {
    const exp = await readJson(file);
    const orgSlug = exp.slug ?? slugify(exp.title);
    const orgOut = path.join(paths.organizationsDir, `${orgSlug}.json`);

    const organization = {
      name: exp.title ?? orgSlug,
      slug: orgSlug,
      website: exp.url ?? '',
      location: exp.location ?? '',
      logo: exp.logo ?? '',
      industry: '',
      summary: exp.description ?? '',
      featured: false,
      sortOrder: 0,
    };

    if (!(await fileExists(orgOut))) {
      await writeJson(orgOut, organization);
    }

    const start = exp.date ? new Date(exp.date) : null;
    const startYear = start ? String(start.getUTCFullYear()) : 'date';
    const roleSlugPart = slugify(exp.role ?? 'role');
    const roleSlug = `${orgSlug}-${startYear}-${roleSlugPart}`.replace(/-+/g, '-');
    const roleOut = path.join(paths.rolesDir, `${roleSlug}.json`);

    const techSlugs = [];
    for (const item of [...(exp.skills ?? []), ...(exp.tools ?? [])]) {
      const normalized = String(item).trim().toLowerCase();
      const mapped = skillToSlug.get(normalized) ?? slugify(normalized);
      techSlugs.push(mapped);
      await ensureTechnology(mapped, item);
    }

    const role = {
      title: exp.role ?? 'Role',
      slug: roleSlug,
      organization: orgSlug,
      location: exp.location ?? '',
      employmentType: '',
      startDate: exp.date ?? '',
      endDate: exp.endDate ?? '',
      current: Boolean(exp.current) || !exp.endDate,
      summary: exp.description ?? '',
      highlights: exp.responsibilities ?? [],
      achievements: exp.achievements ?? [],
      technologies: [...new Set(techSlugs)],
      projects: [],
      featured: false,
      sortOrder: 0,
      isActive: exp.isActive ?? true,
    };

    if (!(await fileExists(roleOut))) {
      await writeJson(roleOut, role);
    }
  }
}

async function migrateProjectsFrontmatter() {
  const projectFiles = await listFiles(paths.projectsDir, '.md');

  for (const file of projectFiles) {
    const raw = await fs.readFile(file, 'utf8');
    const { data, body } = parseFrontmatter(raw);

    // Add new fields while keeping legacy fields until frontend is switched.
    if (!data.summary && data.description) data.summary = data.description;
    if (!data.technologies && Array.isArray(data.tags)) data.technologies = [...data.tags];
    if (!data.liveUrl && data.link) data.liveUrl = data.link;
    if (!data.repoUrl && data.githubLink) data.repoUrl = data.githubLink;
    if (typeof data.featured === 'undefined' && typeof data.pinned !== 'undefined') data.featured = Boolean(data.pinned);
    if (typeof data.sortOrder === 'undefined') data.sortOrder = 0;

    // Ensure technology entities exist for tags/technologies
    const slugs = new Set([...(data.tags ?? []), ...(data.technologies ?? [])].filter(Boolean));
    for (const slug of slugs) {
      await ensureTechnology(slug, slug);
    }

    const updated = stringifyFrontmatter(data, body);
    await fs.writeFile(file, updated, 'utf8');
  }
}

async function main() {
  await ensureDir(paths.profileDir);
  await ensureDir(paths.technologiesDir);
  await ensureDir(paths.organizationsDir);
  await ensureDir(paths.rolesDir);

  await migrateProfile();
  await migrateTechnologiesFromTags();
  await migrateOrgsAndRoles();
  await migrateProjectsFrontmatter();
}

await main();


