import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: './src/content/blog/**/*.md' }),
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

// Legacy tags collection (pre-entity model). Kept temporarily to avoid breaking older content.
// New taxonomy should live in `technologies`.
const tags = defineCollection({
  loader: glob({ pattern: './src/content/tags/**/*.json' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    color: z.string().default('#000000'),
  }),
});

const technologies = defineCollection({
  loader: glob({ pattern: './src/content/technologies/**/*.json' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z
      .enum(['language', 'framework', 'library', 'tool', 'platform', 'service', 'cms', 'concept', 'other'])
      .default('other'),
    url: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
    years: z.number().optional(),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
  }),
});

const organizations = defineCollection({
  loader: glob({ pattern: './src/content/organizations/**/*.json' }),
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
  loader: glob({ pattern: './src/content/roles/**/*.json' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    organization: z.string(),
    location: z.string().optional(),
    employmentType: z
      .union([z.enum(['full_time', 'part_time', 'contract', 'freelance', 'internship']), z.literal('')])
      .optional()
      .transform((val) => (val === '' ? undefined : val)),
    startDate: z.union([z.string(), z.date()]).transform((val) => (typeof val === 'string' ? new Date(val) : val)),
    endDate: z
      .union([z.string(), z.date(), z.null()])
      .optional()
      .transform((val) => {
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
  loader: glob({ pattern: './src/content/profile/**/*.json' }),
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

const experience = defineCollection({
  loader: glob({ pattern: './src/content/experience/**/*.json' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      company: z.string().optional(),
      location: z.string(),
      date: z.union([z.string(), z.date()]).transform((val) => {
        if (typeof val === 'string') return new Date(val);
        return val;
      }),
      endDate: z
        .union([z.string(), z.date(), z.null()])
        .optional()
        .transform((val) => {
          if (typeof val === 'string') return new Date(val);
          if (val === null) return undefined;
          return val;
        }),
      role: z.string(),
      responsibilities: z.array(z.string()).default([]),
      skills: z.array(z.string()).default([]),
      tools: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      projects: z.array(z.string()).default([]),
      achievements: z.array(z.string()).default([]),
      body: z.string().optional(),
      isActive: z.boolean().default(true),
      current: z.boolean().default(false),
      logo: image().optional(),
      url: z.string().optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: './src/content/projects/**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string().optional(),
      // New entity-model fields
      summary: z.string().optional(),
      technologies: z.array(z.string()).default([]),
      liveUrl: z.string().optional(),
      repoUrl: z.string().optional(),
      organization: z.string().optional(),
      roles: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
      // Legacy fields (kept during migration)
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      featuredImage: image().optional(),
      link: z.string().optional(),
      body: z.string().optional(),
      completedOn: z
        .union([z.string(), z.date()])
        .optional()
        .transform((val) => {
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
      pinned: z.boolean().default(false),
      experience: z.string().optional(),
      githubLink: z.string().optional(),
    }),
});

const education = defineCollection({
  loader: glob({ pattern: './src/content/education/**/*.json' }),
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
  loader: glob({ pattern: './src/content/certifications/**/*.json' }),
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
  loader: glob({ pattern: './src/content/awards/**/*.json' }),
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
  loader: glob({ pattern: './src/content/testimonials/**/*.json' }),
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
  loader: glob({ pattern: './src/content/services/**/*.json' }),
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
  // legacy:
  tags,
  experience,
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
