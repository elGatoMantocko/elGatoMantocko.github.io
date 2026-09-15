import type { Temporal } from '@js-temporal/polyfill';

import { PROFILE } from './profile.ts';

/**
 * Renderers for the llms.txt family of files (https://llmstxt.org/).
 * Pure functions over already-sorted content so they can be unit tested and
 * run from a plain Node script.
 */

export interface LlmsJob {
  jobTitle: string;
  company: string;
  location: string;
  summary: string;
  tags: readonly string[];
  content: string;
  startDate: Temporal.PlainDate;
  endDate: Temporal.PlainDate | undefined;
}

export interface LlmsEducation {
  school: string;
  summary: string;
  location: string;
  tags: readonly string[];
  content: string;
  startDate: Temporal.PlainDate;
  endDate: Temporal.PlainDate | undefined;
}

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
    ...PROFILE.details.map(([label, value]) => `${label}: ${value}`),
    '',
    `Skills: ${aggregateSkills(jobs).join(', ')}`,
  ];
}

export function renderLlmsTxt(
  jobs: readonly LlmsJob[],
  educations: readonly LlmsEducation[],
) {
  const out = [
    ...head(jobs),
    '',
    '## Work Experience',
    '',
    ...jobs.map(
      (job) =>
        `- [${job.jobTitle}, ${job.company} (${jobDates(job)})](${PROFILE.siteUrl}/work.md): ${job.summary}`,
    ),
    '',
    '## Education',
    '',
    ...educations.map(
      (education) =>
        `- [${education.summary}, ${education.school} (${educationDates(education)})](${PROFILE.siteUrl}/education.md): ${[education.location, lines(education.content)[0]].filter(Boolean).join('; ')}`,
    ),
    '',
    '## Optional',
    '',
    `- [Full portfolio](${PROFILE.siteUrl}/llms-full.txt): everything above plus per-role detail in one file`,
    `- [Portfolio site](${PROFILE.siteUrl}): interactive version (client-rendered; prefer the .md links above)`,
  ];
  return out.join('\n') + '\n';
}

function workBody(jobs: readonly LlmsJob[]) {
  return jobs.flatMap((job) => [
    `## ${job.jobTitle} — ${job.company}`,
    '',
    `- Location: ${job.location}`,
    `- Dates: ${jobDates(job)}`,
    ...(job.tags.length > 0 ? [`- Skills: ${job.tags.join(', ')}`] : []),
    '',
    job.summary,
    '',
    ...lines(job.content).map((line) => `- ${line}`),
    '',
  ]);
}

function educationBody(educations: readonly LlmsEducation[]) {
  return educations.flatMap((education) => [
    `## ${education.summary} — ${education.school}`,
    '',
    `- Location: ${education.location}`,
    `- Dates: ${educationDates(education)}`,
    ...(education.tags.length > 0
      ? [`- Skills: ${education.tags.join(', ')}`]
      : []),
    '',
    ...lines(education.content).map((line) => `- ${line}`),
    '',
  ]);
}

export function renderWorkMd(jobs: readonly LlmsJob[]) {
  return (
    [
      '# Work Experience',
      '',
      `${PROFILE.name}'s work history, newest first. Source: ${PROFILE.siteUrl}/work`,
      '',
      ...workBody(jobs),
    ].join('\n') + '\n'
  );
}

export function renderEducationMd(educations: readonly LlmsEducation[]) {
  return (
    [
      '# Education',
      '',
      `${PROFILE.name}'s education history. Source: ${PROFILE.siteUrl}/education`,
      '',
      ...educationBody(educations),
    ].join('\n') + '\n'
  );
}

export function renderLlmsFullTxt(
  jobs: readonly LlmsJob[],
  educations: readonly LlmsEducation[],
) {
  return (
    [
      ...head(jobs),
      '',
      '## Work Experience',
      '',
      ...workBody(jobs).map((line) =>
        line.startsWith('## ') ? `#${line}` : line,
      ),
      '## Education',
      '',
      ...educationBody(educations).map((line) =>
        line.startsWith('## ') ? `#${line}` : line,
      ),
    ].join('\n') + '\n'
  );
}
