/**
 * Generates the llms.txt family of files (https://llmstxt.org/) into public/
 * from the same content-collections pipeline the site uses.
 *
 * Run with `yarn generate:llms` (plain Node; no bundler, so imports are relative).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { createBuilder } from '@content-collections/core';

import { byEndDate, withTemporals } from '../src/lib/content.ts';
import {
  renderEducationMd,
  renderLlmsFullTxt,
  renderLlmsTxt,
  renderWorkMd,
} from '../src/lib/llms.ts';

const root = path.resolve(import.meta.dirname, '..');
const publicDir = path.join(root, 'public');

const builder = await createBuilder(path.join(root, 'content-collections.ts'));
await builder.build();

const { allJobs, allEducations } =
  await import('../.content-collections/generated/index.js');

const jobs = allJobs.map(withTemporals).sort(byEndDate);
const educations = allEducations.map(withTemporals);

const files = {
  'llms.txt': renderLlmsTxt(jobs, educations),
  'llms-full.txt': renderLlmsFullTxt(jobs, educations),
  'work.md': renderWorkMd(jobs),
  'education.md': renderEducationMd(educations),
};

await mkdir(publicDir, { recursive: true });
for (const [name, body] of Object.entries(files)) {
  const file = path.join(publicDir, name);
  await writeFile(file, body, 'utf8');
  console.log(`wrote ${path.relative(root, file)}`);
}
