/**
 * Generates the llms.txt files (https://llmstxt.org/) into public/ from the
 * same content-collections pipeline the site uses.
 *
 * Run with `yarn generate:llms` (plain Node; no bundler, so imports are relative).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { createBuilder } from '@content-collections/core';

import { byEndDate, withTemporals } from '../src/lib/content.ts';
import {
  renderEducationLlmsTxt,
  renderLlmsTxt,
  renderWorkLlmsTxt,
} from '../src/lib/llms.ts';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');

const builder = await createBuilder(path.join(root, 'content-collections.ts'));
await builder.build();

const { allJobs, allEducations } =
  await import('../.content-collections/generated/index.js');

const jobs = allJobs.map(withTemporals).sort(byEndDate);
const educations = allEducations.map(withTemporals);

// One llms.txt per route: the root covers the whole site, each subpath file
// covers the URLs under it (https://llmstxt.org/).
const files = {
  'llms.txt': renderLlmsTxt(jobs, educations),
  'work/llms.txt': renderWorkLlmsTxt(jobs),
  'education/llms.txt': renderEducationLlmsTxt(educations),
};

for (const [name, body] of Object.entries(files)) {
  const file = path.join(publicDir, name);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body, 'utf8');
  console.log(`wrote ${path.relative(root, file)}`);
}
