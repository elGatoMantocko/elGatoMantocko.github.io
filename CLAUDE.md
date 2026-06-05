# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Dev server on port 3000
yarn build      # Production build (Nitro server adapter)
yarn lint       # ESLint
yarn format     # Prettier + ESLint --fix
yarn check      # Prettier --check (no write)
yarn test       # Vitest (run once)
```

Run a single test file: `yarn test src/path/to/file.test.tsx`

## Architecture

**Stack**: React 19, TanStack Start (full-stack SSR framework), Vite, TypeScript, Tailwind CSS v4, Shadcn/Radix UI.

**Routing**: TanStack Router with file-based routing under `src/routes/`. `__root.tsx` is the root layout (handles theme injection and devtools). `index.tsx` is the resume home page and opts out of SSR.

**Content**: Portfolio content (jobs, education) lives in `content/` as Markdown files with YAML frontmatter. The schema is validated with Zod in `content-collections.ts` via `@content-collections/vite`. Generated types come from `.content-collections/generated` (aliased as `content-collections`).

**UI Components**: `src/components/ui/` holds layout primitives — `Stack`, `Group`, `Item`, `Container` — built on Tailwind and CVA. Compose these rather than building one-off flex/grid layouts. The `cn()` helper (clsx + tailwind-merge) lives in `src/lib/utils.ts`.

**Theme System**: `src/components/Theme/` manages light/dark/system modes. The current theme is stored in `localStorage` and a blocking script in `__root.tsx` prevents flash on load.

**Dates**: Uses the TC39 Temporal API polyfill (`@js-temporal/polyfill`) — prefer `Temporal.PlainDate` over `Date` for content dates.

**Path aliases**: `@/` → `src/`

## Adding Content

To add a new job or education entry, create a Markdown file in `content/jobs/` or `content/education/` with the required frontmatter fields defined in `content-collections.ts`.
