// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob } from 'astro/loaders';

import tags from 'content/tags';

// Create tag slugs enum from tags data
const tagSlugs = tags.map(tag => tag.slug) as [string, ...string[]];

// 3. Define your collection(s)
const blog = defineCollection({
  loader: glob({ pattern: 'content/blog/**/*.md' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.date(),
    description: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.enum(tagSlugs)).default([]),
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
    tags: z.array(z.enum(tagSlugs)).default([]),
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
    tags: z.array(z.enum(tagSlugs)).default([]),
    featuredImage: z.string().optional(),
    link: z.string().optional(),
    body: z.string().optional(),
    completedOn: z.date().optional(),
    isActive: z.boolean().default(true),
    pinned: z.boolean().default(false),
    experience: z.string().optional(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog, projects, experience };
