<<<<<<< HEAD
// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";

// 2. Import loader(s)
import { glob, file } from "astro/loaders";

// 3. Define your collection(s)
const blog = defineCollection({
  loader: glob({ pattern: "./src/content/blog/**/*.md" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.date(),
=======
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: 'content/blog/**/*.md' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    publishDate: z.date().or(z.null()),
    updatedDate: z.date().optional().default(new Date()),
>>>>>>> master
    description: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

<<<<<<< HEAD
const tags = defineCollection({
  loader: glob({ pattern: "./src/content/tags/**/*.json" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    color: z.string().default("#000000"),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: "./src/content/experience/**/*.json" }),
=======
const experience = defineCollection({
  loader: glob({ pattern: 'content/experience/**/*.json' }),
>>>>>>> master
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    company: z.string().optional(),
    location: z.string(),
<<<<<<< HEAD
    date: z.union([z.string(), z.date()]).transform((val) => {
      if (typeof val === "string") return new Date(val);
      return val;
    }),
    endDate: z
      .union([z.string(), z.date(), z.null()])
      .optional()
      .transform((val) => {
        if (typeof val === "string") return new Date(val);
        if (val === null) return undefined;
        return val;
      }),
    role: z.string(),
    responsibilities: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
=======
    date: z.string().transform(str => new Date(str)),
    endDate: z
      .string()
      .optional()
      .transform(str => (str ? new Date(str) : undefined)),
    role: z.string(),
    responsibilities: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
>>>>>>> master
    projects: z.array(z.string()).default([]),
    achievements: z.array(z.string()).default([]),
    body: z.string().optional(),
    isActive: z.boolean().default(true),
<<<<<<< HEAD
=======
    current: z.boolean().default(false),
    logo: z.string().optional(),
    url: z.string().optional(),
>>>>>>> master
  }),
});

const projects = defineCollection({
<<<<<<< HEAD
  loader: glob({ pattern: "./src/content/projects/**/*.md" }),
=======
  loader: glob({ pattern: 'content/projects/**/*.md' }),
>>>>>>> master
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().optional(),
    link: z.string().optional(),
    body: z.string().optional(),
<<<<<<< HEAD
    completedOn: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (typeof val === "string") {
          // Handle partial dates like "2022-07" by appending default day
          if (val.match(/^\d{4}-\d{2}$/)) {
            return new Date(val + "-01");
          }
          return new Date(val);
        }
        return val;
      }),
    isActive: z.boolean().default(true),
    pinned: z.boolean().default(false),
    experience: z.string().optional(),
  }),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog, tags, projects, experience };
=======
    completedOn: z.date().optional(),
    isActive: z.boolean().default(true),
    pinned: z.boolean().default(false),
    experience: z.string().optional(),
    githubLink: z.string().optional(),
  }),
});

export const collections = { blog, projects, experience };
>>>>>>> master
