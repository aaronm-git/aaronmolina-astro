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
		description: z.string().optional(),
		image: z.string().optional(),
		tags: z.array(z.string()).default([]),
	}),
});

const tags = defineCollection({
	loader: glob({ pattern: "./src/content/tags/**/*.json" }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		description: z.string().optional(),
		color: z.string().default("#000000"),
	}),
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { blog, tags };
