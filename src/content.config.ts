// Коллекции контента: блог живёт markdown-файлами в src/content/blog/.
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Дата публикации: YYYY-MM-DD. */
    date: z.coerce.date(),
    /** Язык поста — он же выбирает роут (/blog/ или /en/blog/). */
    lang: z.enum(['ru', 'en']),
    tags: z.array(z.string()).default([]),
    /** Черновик: не попадает в сборку и в RSS. */
    draft: z.boolean().default(false),
    /** Слаг исходного поста, если это перевод; пара связывается в обе стороны. */
    translationOf: z.string().optional(),
  }),
});

export const collections = { blog };
