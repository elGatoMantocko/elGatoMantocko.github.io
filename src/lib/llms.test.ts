import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';

import { PROFILE } from './profile.ts';
import {
  aggregateSkills,
  renderEducationMd,
  renderLlmsFullTxt,
  renderLlmsTxt,
  renderWorkMd,
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

  it('has the expected H2 sections, ending with Optional', () => {
    const headings = lines.filter((l) => l.startsWith('#'));
    expect(headings).toEqual([
      `# ${PROFILE.name}`,
      '## Work Experience',
      '## Education',
      '## Optional',
    ]);
  });

  it('only uses [name](url): notes lines inside H2 sections', () => {
    const firstH2 = lines.indexOf('## Work Experience');
    const body = lines
      .slice(firstH2)
      .filter((l) => l !== '' && !l.startsWith('## '));
    expect(body.length).toBeGreaterThan(0);
    for (const line of body) expect(line).toMatch(FILE_LIST_LINE);
  });

  it('renders open-ended jobs as Present and marks them current', () => {
    expect(txt).toContain('(May 2022 – Present)');
    expect(lines[2]).toContain('Currently Staff Engineer at Acme');
  });

  it('lists jobs in the order given (newest first)', () => {
    expect(txt.indexOf('Staff Engineer, Acme')).toBeLessThan(
      txt.indexOf('Engineer, Initech'),
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

describe('markdown pages', () => {
  it('renderWorkMd has an H2 per job with bullets from content lines', () => {
    const md = renderWorkMd(jobs);
    expect(md.split('\n')[0]).toBe('# Work Experience');
    expect(md).toContain('## Staff Engineer — Acme');
    expect(md).toContain('## Engineer — Initech');
    expect(md).toContain('- Dates: Jul 2016 – Apr 2018');
    expect(md).toContain('- Did A.\n- Did B.');
  });

  it('renderEducationMd omits the Skills line when there are no tags', () => {
    const md = renderEducationMd(educations);
    expect(md).toContain('## BS, Computer Science — State U');
    expect(md).toContain('- Dates: 2010 – 2016');
    expect(md).not.toContain('- Skills:');
  });

  it('renderLlmsFullTxt nests page sections under the index H2s', () => {
    const full = renderLlmsFullTxt(jobs, educations);
    const headings = full.split('\n').filter((l) => l.startsWith('#'));
    expect(headings).toEqual([
      `# ${PROFILE.name}`,
      '## Work Experience',
      '### Staff Engineer — Acme',
      '### Engineer — Initech',
      '## Education',
      '### BS, Computer Science — State U',
    ]);
  });
});
