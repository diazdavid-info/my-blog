import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    h1: z.string(),
    author: z.string(),
    date: z.string(),
    image: z.string().url(),
  }),
});

export const collections = { posts };
