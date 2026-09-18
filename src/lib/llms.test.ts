import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import { PROFILE } from './profile.ts';
import {
  aggregateSkills,
  renderEducationLlmsTxt,
  renderLlmsTxt,
  renderWorkLlmsTxt,
} from './llms.ts';
import type { LlmsEducation, LlmsJob } from './llms.ts';

const jobs: LlmsJob[] = [
  {
    jobTitle: 'Staff Engineer',
    company: 'Acme',
    location: 'Seattle, WA',
    summary: 'Built the thing.',
    tags: ['Typescript', 'React'],
    content: 'Did A.\nDid B.',
    startDate: Temporal.PlainDate.from('2022-05-01'),
    endDate: undefined,
  },
  {
    jobTitle: 'Engineer',
    company: 'Initech',
    location: 'Chicago, IL',
    summary: 'Shipped TPS reports.',
    tags: ['Typescript', 'Go'],
    content: 'Did C.',
    startDate: Temporal.PlainDate.from('2016-07-01'),
    endDate: Temporal.PlainDate.from('2018-04-01'),
  },
];

const educations: LlmsEducation[] = [
  {
    school: 'State U',
    summary: 'BS, Computer Science',
    location: 'Somewhere, IN',
    tags: [],
    content: 'Clubs: chess.\nStudied things.',
    startDate: Temporal.PlainDate.from('2010-08-01'),
    endDate: Temporal.PlainDate.from('2016-05-01'),
  },
];

const FILE_LIST_LINE = /^- \[.+\]\(https?:\/\/.+\)(: .+)?$/;

describe('renderLlmsTxt', () => {
  const txt = renderLlmsTxt(jobs, educations);
  const lines = txt.split('\n');

  it('starts with the H1 and a blockquote summary', () => {
    expect(lines[0]).toBe(`# ${PROFILE.name}`);
    expect(lines[1]).toBe('');
    expect(lines[2]).toMatch(/^> /);
    expect(lines[2]).toContain(PROFILE.tagline);
  });

  it('includes every profile detail as a "Label: value" line', () => {
    for (const [label, value] of PROFILE.details) {
      expect(lines).toContain(`${label}: ${value}`);
    }
  });

  it('has no headings other than the H1 and a trailing Optional H2', () => {
    const headings = lines.filter((l) => l.startsWith('#'));
    expect(headings).toEqual([`# ${PROFILE.name}`, '## Optional']);
  });

  it('inlines every job and school with its details', () => {
    expect(txt).toContain(
      '- **Staff Engineer — Acme** (May 2022 – Present · Seattle, WA)',
    );
    expect(txt).toContain('  Built the thing.');
    expect(txt).toContain('  Skills: Typescript, React');
    expect(txt).toContain('  - Did A.\n  - Did B.');
    expect(txt).toContain(
      '- **BS, Computer Science — State U** (2010 – 2016 · Somewhere, IN)',
    );
    expect(txt).toContain('  - Clubs: chess.\n  - Studied things.');
  });

  it('omits the Skills line when there are no tags', () => {
    const [, ...education] = txt.split('**Education**');
    expect(education.join('')).not.toContain('Skills:');
  });

  it('only uses [name](url): notes lines inside the H2 section', () => {
    const body = lines
      .slice(lines.indexOf('## Optional') + 1)
      .filter((l) => l !== '');
    expect(body.length).toBeGreaterThan(0);
    for (const line of body) expect(line).toMatch(FILE_LIST_LINE);
  });

  it('links to the per-route files and the site', () => {
    expect(txt).toContain(`](${PROFILE.siteUrl}/work/llms.txt)`);
    expect(txt).toContain(`](${PROFILE.siteUrl}/education/llms.txt)`);
    expect(txt).toContain(`](${PROFILE.siteUrl})`);
  });

  it('marks open-ended jobs as current', () => {
    expect(lines[2]).toContain('Currently Staff Engineer at Acme');
  });

  it('lists jobs in the order given (newest first)', () => {
    expect(txt.indexOf('Staff Engineer — Acme')).toBeLessThan(
      txt.indexOf('Engineer — Initech'),
    );
  });

  it('says "Most recently" when the latest job has ended', () => {
    const ended = renderLlmsTxt([jobs[1]], educations);
    expect(ended.split('\n')[2]).toContain('Most recently Engineer at Initech');
  });
});

describe('aggregateSkills', () => {
  it('de-duplicates and orders tags by frequency', () => {
    expect(aggregateSkills(jobs)).toEqual(['Typescript', 'React', 'Go']);
  });
});

describe('per-route files', () => {
  it.each([
    ['work', renderWorkLlmsTxt(jobs)],
    ['education', renderEducationLlmsTxt(educations)],
  ])('%s follows the same H1 / blockquote / Optional shape', (_, txt) => {
    const lines = txt.split('\n');
    expect(lines[0]).toMatch(new RegExp(`^# ${PROFILE.name} — `));
    expect(lines[2]).toMatch(/^> /);
    expect(lines.filter((l) => l.startsWith('#'))).toEqual([
      lines[0],
      '## Optional',
    ]);
    const body = lines
      .slice(lines.indexOf('## Optional') + 1)
      .filter((l) => l !== '');
    for (const line of body) expect(line).toMatch(FILE_LIST_LINE);
    expect(txt).toContain(`](${PROFILE.siteUrl}/llms.txt)`);
  });

  it('renderWorkLlmsTxt inlines every job', () => {
    const txt = renderWorkLlmsTxt(jobs);
    expect(txt).toContain('- **Staff Engineer — Acme** (May 2022 – Present');
    expect(txt).toContain('- **Engineer — Initech** (Jul 2016 – Apr 2018');
    expect(txt).toContain('  - Did A.\n  - Did B.');
  });

  it('renderEducationLlmsTxt omits the Skills line when there are no tags', () => {
    const txt = renderEducationLlmsTxt(educations);
    expect(txt).toContain('- **BS, Computer Science — State U** (2010 – 2016');
    expect(txt).not.toContain('Skills:');
  });
});
