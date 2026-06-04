import { defineCollection, defineConfig } from '@content-collections/core';
import { z } from 'zod';

const jobs = defineCollection({
  name: 'jobs',
  directory: 'content/jobs',
  include: '**/*.md',
  schema: z.object({
    jobTitle: z.string(),
    summary: z.string(),
    startDate: z.iso.date(),
    endDate: z.iso.date().optional(),
    company: z.string(),
    location: z.string(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
});

const education = defineCollection({
  name: 'education',
  directory: 'content/education',
  include: '**/*.md',
  schema: z.object({
    school: z.string(),
    summary: z.string(),
    location: z.string(),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    tags: z.array(z.string()),
    content: z.string(),
  }),
});

export default defineConfig({
  content: [jobs, education],
});
