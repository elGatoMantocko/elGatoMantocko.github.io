# Elliott Mantock's Portfolio

A personal portfolio/resume site built with TanStack Start. Features a home page with intro, filterable work experience, and education history — all driven by Markdown content files.

## Getting Started

```bash
yarn install
yarn dev       # Dev server on port 3000
```

## Commands

```bash
yarn dev       # Dev server on port 3000
yarn build     # Production build (Nitro server adapter)
yarn preview   # Preview production build locally
yarn test      # Vitest (run once)
yarn lint      # ESLint
yarn format    # Prettier + ESLint --fix
yarn check     # Prettier --check (no write)
yarn generate:llms  # Regenerate public/llms.txt, work/llms.txt, education/llms.txt from content/
```

## Project Structure

```
├── content/
│   ├── jobs/              # Work experience entries (Markdown)
│   └── education/         # Education entries (Markdown)
├── src/
│   ├── components/
│   │   ├── Jobs.tsx       # Job card components
│   │   ├── Education.tsx  # Education card components
│   │   ├── Theme/         # Light/dark/system theme management
│   │   └── ui/            # Layout primitives and Shadcn/Radix components
│   ├── lib/
│   │   ├── content.ts     # Temporal date utilities for content
│   │   ├── llms.ts        # Renderers for the llms.txt files
│   │   ├── profile.ts     # Name, tagline, and contact links
│   │   ├── hooks.ts       # Custom hooks
│   │   └── utils.ts       # cn() helper (clsx + tailwind-merge)
│   ├── routes/
│   │   ├── __root.tsx     # Root layout (nav, theme switcher, header)
│   │   ├── index.tsx      # Home page (intro, social links)
│   │   ├── work.tsx       # Work experience page
│   │   └── education.tsx  # Education page
│   └── styles.css         # Global CSS, Tailwind theme, custom fonts
├── public/                # Static assets (+ generated llms.txt, work/llms.txt, education/llms.txt)
├── scripts/
│   └── generate-llms.ts   # Builds the llms.txt files from content-collections
├── content-collections.ts # Content schema definitions (Zod)
└── vite.config.ts
```

## Adding Content

### Work Experience

Create a Markdown file in `content/jobs/` with this frontmatter:

```markdown
---
jobTitle: Your Job Title
company: Company Name
location: City, State
startDate: 2024-01-01
endDate: 2024-12-31 # omit for current position
summary: Brief summary of your role
tags:
  - React
  - TypeScript
---

Detailed description of responsibilities and achievements...
```

### Education

Create a Markdown file in `content/education/`:

```markdown
---
school: School Name
summary: Degree or Program Name
startDate: 2020-01-01
endDate: 2024-01-01
tags:
  - Relevant
  - Skills
---

Details about your education...
```

## LLM-friendly content

Following the [llms.txt proposal](https://llmstxt.org/), the build generates one `llms.txt` per route from the same content collections that drive the site: `/llms.txt` covers the whole profile, and `/work/llms.txt` and `/education/llms.txt` cover their sections. Each file has the same shape — H1, summary blockquote, every entry inline as heading-free Markdown, then a single `## Optional` link list. They are written to `public/` (gitignored) by `yarn generate:llms`, which `yarn dev` and `yarn build` run automatically.

## Deploy

The production build outputs a self-contained Nitro server:

```bash
yarn build
node dist/server/index.mjs
```

For static hosting or other adapters, see the [Nitro deploy docs](https://v3.nitro.build/deploy).
