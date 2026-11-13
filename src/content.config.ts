import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog posts: one Markdown file per post in src/content/blog/.
 * Files starting with "_" are ignored (use them as templates).
 * Posts with `draft: true` show in `pnpm dev` but not on the live site.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** Optional link to the original X thread, for cross-posts. */
    xThread: z.url().optional(),
  }),
});

export const collections = { blog };
