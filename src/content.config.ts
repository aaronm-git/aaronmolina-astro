import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: 'content/blog/**/*.md' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    publishDate: z.date().or(z.null()),
    updatedDate: z.date().optional().default(new Date()),
    description: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: 'content/experience/**/*.json' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    company: z.string().optional(),
    location: z.string(),
    date: z.string().transform(str => new Date(str)),
    endDate: z
      .string()
      .optional()
      .transform(str => (str ? new Date(str) : undefined)),
    role: z.string(),
    responsibilities: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]),
    achievements: z.array(z.string()).default([]),
    body: z.string().optional(),
    isActive: z.boolean().default(true),
    current: z.boolean().default(false),
    logo: z.string().optional(),
    url: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: 'content/projects/**/*.md' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().optional(),
    link: z.string().optional(),
    body: z.string().optional(),
    completedOn: z.date().optional(),
    isActive: z.boolean().default(true),
    pinned: z.boolean().default(false),
    experience: z.string().optional(),
    githubLink: z.string().optional(),
  }),
});

export const collections = { blog, projects, experience };
