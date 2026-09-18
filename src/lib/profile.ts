/**
 * Extra context for llms.txt only — not rendered on the site.
 * Each entry becomes a `Label: value` line in the details section.
 */
const DETAILS = [
  ['Location', 'Seattle, WA (Pacific Time)'],
  [
    'Workplace preference',
    'Prefers working in an office; a hybrid remote/in-office arrangement is also fine.',
  ],
  [
    'Target roles',
    'Senior or Staff full-stack / product engineer, as an individual contributor.',
  ],
  [
    'Focus',
    'Full-stack development and product engineering. Likes to build and own the database schema, the API contracts, and the frontend tooling used to present the core application.',
  ],
  ['Employment type', 'Full-time preferred; open to contract work.'],
  ['Relocation', 'Not looking to relocate from the Seattle area.'],
] as const;

export const PROFILE = {
  name: 'Elliott Mantock',
  tagline:
    'Driven Full-Stack software engineer with 10+ years of experience building frontends, APIs, data pipelines, and Infrastructure as Code.',
  siteUrl: 'https://elliott.mantock.com',
  email: 'emantock@gmail.com',
  github: 'https://github.com/elGatoMantocko',
  linkedin: 'https://linkedin.com/in/elliottmantock',
  details: DETAILS,
} as const;
