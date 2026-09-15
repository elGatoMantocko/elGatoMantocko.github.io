---
name: bump-deps
description: Upgrade npm dependencies (and Yarn itself) one package or coupled group per commit, validating each with lint+test before committing. Use when asked to bump, update, or upgrade deps/packages.
---

# bump-deps

Upgrade dependencies so that each package (or coupled group) lands in its own
commit, validated before commit. Never produce a single "bump deps" commit.

Project facts that matter:

- Yarn 4 (berry). There is no `yarn outdated`; use the helper script below.
- `.yarnrc.yml` sets `npmMinimalAgeGate: 7d` — `yarn up` may resolve _below_
  the latest published version. That is expected; never pass `--no-time-gate`.
- CI runs `yarn lint`, `yarn check`, `yarn test`, `yarn build`.
- Commits are conventional (`chore(deps): …`) and GPG-signed.
- `.yarn/install-state.gz` is a build artifact and must never be committed.

## 0. Preconditions

1. `git status --porcelain` must be empty. If not, stop and ask.
2. If on `main`, create a branch: `git switch -c chore/bump-deps-YYYY-MM-DD`.
3. If `git ls-files --error-unmatch .yarn/install-state.gz` succeeds, untrack it
   first in its own commit (`.gitignore` already covers it):
   ```
   git rm --cached .yarn/install-state.gz
   git commit -m "chore: stop tracking yarn install-state"
   ```

## 1. Discover

```
node .claude/skills/bump-deps/scripts/outdated.mjs          # table
node .claude/skills/bump-deps/scripts/outdated.mjs --json   # for parsing
```

Columns: `name`, `group`, `current` (installed, from yarn.lock), `latest`,
`kind` (patch/minor/major), `dev`. Rows are already sorted patch → minor →
major, then by group. A `yarn` row is included (from `packageManager`).

Show the user the table before starting.

## 2. Grouping

Packages sharing a `group` value are bumped together in **one** `yarn up`
invocation and **one** commit. The script computes groups as:

- Explicit cross-scope groups: `react` (`react`, `react-dom`, `@types/react`,
  `@types/react-dom`), `tailwindcss` (`tailwindcss`, `@tailwindcss/*`),
  `vite` (`vite`, `@vitejs/*`).
- Every other scoped package groups by scope (`@tanstack/*`, `@radix-ui/*`,
  `@types/*`, `@testing-library/*`, …).
- Unscoped packages are their own group.

A group's kind is the highest kind among its members. If a group contains a
major, the whole group is handled in the majors tier.

## 3. Order

1. **Yarn itself** (if outdated) — first, so all later `yarn up` runs use the new release.
2. All **patch** groups, alphabetically.
3. All **minor** groups, alphabetically.
4. **Major** groups, one at a time, with confirmation (section 5).

## 4. Per-bump loop (yarn, patch, minor — fully automatic)

For a package group:

```
yarn up <member> [<member> …]
git status --porcelain          # expect only package.json and yarn.lock
yarn lint && yarn test
```

For **yarn itself**:

```
yarn set version berry
yarn install
git status --porcelain          # expect .yarnrc.yml, package.json, .yarn/releases/*, maybe yarn.lock
yarn lint && yarn test
```

Then read the actually-installed version (may be lower than `latest` due to the
age gate): `yarn info <pkg> --json` → `children.Version`, or `packageManager`
in `package.json` for yarn.

**Green** → stage only the expected files and commit:

```
git add package.json yarn.lock                       # packages
git add package.json yarn.lock .yarnrc.yml .yarn/releases   # yarn
git commit -m "chore(deps): bump <pkg> from <current> to <new>"
```

Group commit message: `chore(deps): bump <group>/* to <new>` (e.g.
`chore(deps): bump @tanstack/* to 1.170.36`), with each member's
`name: from → to` listed in the body. Use the group name for cross-scope groups
(`chore(deps): bump react to 19.3.0`).

**Red** →

- If the failure is a small, obviously-related change (renamed export, type
  tweak, config key), fix it, re-run `yarn lint && yarn test`, and include the
  fix in the same commit with a body line describing it.
- Otherwise revert and continue:
  ```
  git checkout -- package.json yarn.lock && yarn install          # packages
  git checkout -- package.json yarn.lock .yarnrc.yml .yarn/releases && git clean -f .yarn/releases && yarn install   # yarn
  ```
  Record the package as **skipped** with the first few lines of the error.

Never use `--no-verify`, `--no-time-gate`, or `git add -A`.

## 5. Majors (confirm each)

After all patch/minor groups are committed, for each major group:

1. Fetch release notes: `yarn npm info <pkg> --fields repository --json` → if a
   GitHub URL, WebFetch its releases page (or CHANGELOG) and summarize breaking
   changes in 2–4 lines.
2. AskUserQuestion with the summary and options: **bump now**, **skip**, **stop**.
3. If bumping: run the section-4 loop, but validation is
   `yarn lint && yarn test && yarn build`.

## 6. Finish

1. `yarn check && yarn build`.
   - If `yarn check` fails because prettier/eslint were bumped, run `yarn format`
     and commit `style: reformat after <pkg> bump`.
2. Confirm `git status --porcelain` is empty (except an untracked/modified
   `.yarn/install-state.gz`, which is ignored).
3. Print a report:
   - **Committed**: `<pkg> <from> → <to>` with short SHA
   - **Skipped**: `<pkg>` + reason
   - **Gated**: packages whose installed version is below `latest` because of the age gate
   - **Majors declined**
4. Do **not** push. Tell the user the branch name.

## Troubleshooting

- `git commit` hangs: GPG pinentry is waiting. Ask the user to run
  `! git commit -m "…"` themselves.
- `yarn up` changes nothing: the newer version is inside the 7-day age gate.
  Report it as gated and move on.
- `yarn info` prints multiple JSON lines: several versions are installed
  transitively; the first line is the direct dependency.
