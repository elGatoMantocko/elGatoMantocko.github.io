import type { Temporalized } from './content.ts';
import { PROFILE } from './profile.ts';

import type { Education, Job } from 'content-collections';

/**
 * Renderers for the llms.txt files (https://llmstxt.org/).
 * Pure functions over already-sorted content so they can be unit tested and
 * run from a plain Node script.
 */

/** Content-collection documents after `withTemporals`; `_meta` is unused. */
export type LlmsJob = Temporalized<Omit<Job, '_meta'>>;
export type LlmsEducation = Temporalized<Omit<Education, '_meta'>>;

const MONTH_YEAR = { year: 'numeric', month: 'short' } as const;

function jobDates(job: LlmsJob) {
  const start = job.startDate.toLocaleString('en', MONTH_YEAR);
  const end = job.endDate?.toLocaleString('en', MONTH_YEAR) ?? 'Present';
  return `${start} – ${end}`;
}

function educationDates(education: LlmsEducation) {
  return `${education.startDate.year} – ${education.endDate?.year ?? 'Present'}`;
}

function lines(content: string) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Tags across all jobs, de-duplicated and ordered by how often they appear. */
export function aggregateSkills(jobs: readonly LlmsJob[]) {
  const counts = new Map<string, number>();
  for (const job of jobs) {
    for (const tag of job.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([tag]) => tag);
}

function head(jobs: readonly LlmsJob[]) {
  const latest = jobs.at(0);
  const role =
    latest == null
      ? ''
      : ` ${latest.endDate == null ? 'Currently' : 'Most recently'} ${latest.jobTitle} at ${latest.company} — ${latest.location}.`;

  return [
    `# ${PROFILE.name}`,
    '',
    `> ${PROFILE.tagline}${role}`,
    '',
    `Contact: ${PROFILE.email} · GitHub: ${PROFILE.github} · LinkedIn: ${PROFILE.linkedin}`,
    '',
    ...PROFILE.details.map(([label, value]) => `${label}: ${value}` as const),
    '',
    `Skills: ${aggregateSkills(jobs).join(', ')}`,
  ] as const;
}

/**
 * One job as a nested list item. The spec forbids headings between the
 * blockquote and the H2 file lists, so entries use a bold title instead.
 */
function jobEntry(job: LlmsJob) {
  return [
    `- **${job.jobTitle} — ${job.company}** (${jobDates(job)} · ${job.location})`,
    `  ${job.summary}`,
    ...(job.tags.length > 0 ? [`  Skills: ${job.tags.join(', ')}`] : []),
    ...lines(job.content).map((line) => `  - ${line}`),
  ];
}

function educationEntry(education: LlmsEducation) {
  return [
    `- **${education.summary} — ${education.school}** (${educationDates(education)} · ${education.location})`,
    ...(education.tags.length > 0
      ? [`  Skills: ${education.tags.join(', ')}`]
      : []),
    ...lines(education.content).map((line) => `  - ${line}`),
  ];
}

const WORK_URL = `${PROFILE.siteUrl}/work/llms.txt`;
const EDUCATION_URL = `${PROFILE.siteUrl}/education/llms.txt`;

/**
 * The whole portfolio in one file, shaped per https://llmstxt.org/: H1,
 * blockquote, heading-free detail, then a single H2 "file list". Everything
 * a reader needs is inline; the links only offer the same content per route.
 */
export function renderLlmsTxt(
  jobs: readonly LlmsJob[],
  educations: readonly LlmsEducation[],
) {
  const out = [
    ...head(jobs),
    '',
    '**Work Experience** (newest first)',
    '',
    ...jobs.flatMap(jobEntry),
    '',
    '**Education**',
    '',
    ...educations.flatMap(educationEntry),
    '',
    '## Optional',
    '',
    `- [Work Experience](${WORK_URL}): the work history above on its own`,
    `- [Education](${EDUCATION_URL}): the education history above on its own`,
    `- [Portfolio site](${PROFILE.siteUrl}): interactive version (client-rendered; this file is the canonical source)`,
  ];
  return out.join('\n') + '\n';
}

/** Link back to the root file from a per-route one. */
function rootLink() {
  return [
    '## Optional',
    '',
    `- [${PROFILE.name}](${PROFILE.siteUrl}/llms.txt): full profile — contact details, skills, work experience, and education`,
  ] as const;
}

/** Per-route file for /work, covering the URLs under that path. */
export function renderWorkLlmsTxt(jobs: readonly LlmsJob[]) {
  return (
    [
      `# ${PROFILE.name} — Work Experience`,
      '',
      `> ${PROFILE.name}'s work history, newest first.`,
      '',
      ...jobs.flatMap(jobEntry),
      '',
      ...rootLink(),
    ].join('\n') + '\n'
  );
}

/** Per-route file for /education, covering the URLs under that path. */
export function renderEducationLlmsTxt(educations: readonly LlmsEducation[]) {
  return (
    [
      `# ${PROFILE.name} — Education`,
      '',
      `> ${PROFILE.name}'s education history.`,
      '',
      ...educations.flatMap(educationEntry),
      '',
      ...rootLink(),
    ].join('\n') + '\n'
  );
}
