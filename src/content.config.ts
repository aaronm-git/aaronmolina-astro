import { fileURLToPath } from 'node:url';

import fg from 'fast-glob';

import { defineCollection, z } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';

type GlobOptions = Parameters<typeof glob>[0];

/**
 * Returns a glob loader that stays quiet when an optional collection directory is empty.
 */
function optionalGlob(globOptions: GlobOptions): Loader {
  const baseLoader = glob(globOptions);

  return {
    ...baseLoader,
    name: 'optional-glob-loader',
    async load(context) {
      const baseDir = globOptions.base ? new URL(globOptions.base, context.config.root) : context.config.root;
      const basePath = fileURLToPath(baseDir);
      const files = await fg(globOptions.pattern, {
        cwd: basePath,
        dot: false,
        onlyFiles: true,
      });

      if (files.length > 0) {
        await baseLoader.load(context);
        return;
      }

      context.store.clear();

      if (!context.watcher || context.meta.has('optional-glob-watcher')) {
        return;
      }

      context.meta.set('optional-glob-watcher', 'true');
      context.watcher.add(basePath);

      const reload = async (changedPath: string) => {
        if (!changedPath.startsWith(basePath)) {
          return;
        }

        await baseLoader.load(context);
      };

      context.watcher.on('add', reload);
      context.watcher.on('change', reload);
      context.watcher.on('unlink', reload);
    },
  };
}

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/blog',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      publishDate: z.date().or(z.null()),
      updatedDate: z.date().optional().default(new Date()),
      description: z.string().optional(),
      image: image().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

const technologies = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/technologies',
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    category: z.enum(['language', 'framework', 'library', 'tool', 'platform', 'service', 'cms', 'concept', 'other']).default('other'),
    url: z.string().optional(),
    level: z.number().min(1).max(10).optional(),
    years: z.number().optional(),
    projects: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
  }),
});

const organizations = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/organizations',
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      slug: z.string(),
      website: z.string().optional(),
      location: z.string().optional(),
      logo: image().optional(),
      industry: z.string().optional(),
      summary: z.string().optional(),
      featured: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
    }),
});

const roles = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/roles',
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    organization: z.string(),
    location: z.string().optional(),
    employmentType: z
      .union([z.enum(['full_time', 'part_time', 'contract', 'freelance', 'internship']), z.literal('')])
      .optional()
      .transform(val => (val === '' ? undefined : val)),
    startDate: z.union([z.string(), z.date()]).transform(val => (typeof val === 'string' ? new Date(val) : val)),
    endDate: z
      .union([z.string(), z.date(), z.null()])
      .optional()
      .transform(val => {
        if (typeof val === 'string') return new Date(val);
        if (val === null) return undefined;
        return val;
      }),
    current: z.boolean().default(false),
    summary: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    achievements: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

const profile = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/profile',
  }),
  schema: ({ image }) =>
    z.object({
      fullName: z.string(),
      headline: z.string(),
      summary: z.string(),
      location: z.string().optional(),
      website: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      avatar: image().optional(),
      availability: z.enum(['open_to_work', 'available_for_contract', 'not_available']).optional(),
      primaryRoles: z.array(z.string()).default([]),
    }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      summary: z.string().optional(),
      technologies: z.array(z.string()).default([]),
      liveUrl: z.string().optional(),
      repoUrl: z.string().optional(),
      organization: z.string().optional(),
      roles: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
      featuredImage: image().optional(),
      body: z.string().optional(),
      completedOn: z
        .union([z.string(), z.date()])
        .optional()
        .transform(val => {
          if (typeof val === 'string') {
            // Handle partial dates like "2022-07" by appending default day
            if (val.match(/^\d{4}-\d{2}$/)) {
              return new Date(val + '-01');
            }
            return new Date(val);
          }
          return val;
        }),
      isActive: z.boolean().default(true),
    }),
});

const education = defineCollection({
  loader: optionalGlob({
    pattern: '**/*.json',
    base: './src/content/education',
  }),
  schema: z.object({
    school: z.string(),
    slug: z.string(),
    degree: z.string().optional(),
    field: z.string().optional(),
    startDate: z.union([z.string(), z.date(), z.null()]).optional(),
    endDate: z.union([z.string(), z.date(), z.null()]).optional(),
    location: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

const certifications = defineCollection({
  loader: optionalGlob({
    pattern: '**/*.json',
    base: './src/content/certifications',
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    issuer: z.string().optional(),
    issueDate: z.union([z.string(), z.date(), z.null()]).optional(),
    expirationDate: z.union([z.string(), z.date(), z.null()]).optional(),
    url: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

const awards = defineCollection({
  loader: optionalGlob({
    pattern: '**/*.json',
    base: './src/content/awards',
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    issuer: z.string().optional(),
    date: z.union([z.string(), z.date(), z.null()]).optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

const testimonials = defineCollection({
  loader: optionalGlob({
    pattern: '**/*.json',
    base: './src/content/testimonials',
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string().optional(),
    organization: z.string().optional(),
    quote: z.string(),
    url: z.string().optional(),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

const services = defineCollection({
  loader: optionalGlob({
    pattern: '**/*.json',
    base: './src/content/services',
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.string(),
    deliverables: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

export const collections = {
  blog,
  // entity model:
  technologies,
  organizations,
  roles,
  projects,
  profile,
  // resume-adjacent:
  education,
  certifications,
  awards,
  testimonials,
  services,
};
