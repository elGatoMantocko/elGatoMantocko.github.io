// Lists outdated direct dependencies (plus Yarn itself) for the bump-deps skill.
//
// Yarn 4 has no `yarn outdated`, so this combines:
//   - `yarn info <pkg> --json`                 → installed version (from yarn.lock)
//   - `yarn npm info <pkg> --fields version`   → latest published version
//
// Usage: node .claude/skills/bump-deps/scripts/outdated.mjs [--json] [--all]
//   --json  machine-readable output
//   --all   include up-to-date packages

import { exec as execCb } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execAsync = promisify(execCb);
const args = new Set(process.argv.slice(2));
const asJson = args.has('--json');
const showAll = args.has('--all');

const YARN_DIST = '@yarnpkg/cli-dist';
const CONCURRENCY = 8;

// Packages that must move together even though they don't share a scope.
// Scoped packages not listed here group by scope automatically.
const EXPLICIT_GROUPS = {
  react: ['react', 'react-dom', '@types/react', '@types/react-dom'],
  tailwindcss: [/^tailwindcss$/, /^@tailwindcss\//],
  vite: [/^vite$/, /^@vitejs\//],
};

function groupOf(name) {
  for (const [group, members] of Object.entries(EXPLICIT_GROUPS)) {
    if (members.some((m) => (m instanceof RegExp ? m.test(name) : m === name)))
      return group;
  }
  if (name.startsWith('@')) return name.slice(0, name.indexOf('/'));
  return name;
}

function parseVersion(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(v);
  return m ? m.slice(1, 4).map(Number) : null;
}

function diffKind(current, latest) {
  const a = parseVersion(current);
  const b = parseVersion(latest);
  if (!a || !b) return 'unknown';
  if (a[0] !== b[0]) return b[0] > a[0] ? 'major' : 'up-to-date';
  if (a[1] !== b[1]) return b[1] > a[1] ? 'minor' : 'up-to-date';
  if (a[2] !== b[2]) return b[2] > a[2] ? 'patch' : 'up-to-date';
  return 'up-to-date';
}

// Package names come from package.json; validate before interpolating into a shell command.
const SAFE_ARG = /^[@a-z0-9._\/-]+$/i;

async function yarn(...cmd) {
  for (const arg of cmd) {
    if (!SAFE_ARG.test(arg))
      throw new Error(`Refusing to pass unsafe argument: ${arg}`);
  }
  const { stdout } = await execAsync(`yarn ${cmd.join(' ')}`, {
    maxBuffer: 1 << 24,
  });
  return stdout.trim();
}

async function installedVersion(name) {
  const out = await yarn('info', name, '--json');
  // One JSON object per line; take the first (direct dependency) instance.
  const first = out.split('\n').find((l) => l.startsWith('{'));
  return first ? JSON.parse(first).children.Version : null;
}

async function latestVersion(name) {
  const out = await yarn('npm', 'info', name, '--fields', 'version', '--json');
  return JSON.parse(out).version;
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]);
      }
    }),
  );
  return results;
}

const pkg = JSON.parse(await readFile('package.json', 'utf8'));

const entries = [
  ...Object.keys(pkg.dependencies ?? {}).map((name) => ({ name, dev: false })),
  ...Object.keys(pkg.devDependencies ?? {}).map((name) => ({
    name,
    dev: true,
  })),
];

const rows = await mapLimit(entries, CONCURRENCY, async ({ name, dev }) => {
  const [current, latest] = await Promise.all([
    installedVersion(name),
    latestVersion(name),
  ]);
  return {
    name,
    group: groupOf(name),
    current,
    latest,
    kind: diffKind(current, latest),
    dev,
  };
});

// Yarn itself, from the packageManager field.
const pm = /^yarn@(\S+)/.exec(pkg.packageManager ?? '');
if (pm) {
  const latest = await latestVersion(YARN_DIST);
  rows.push({
    name: 'yarn',
    group: 'yarn',
    current: pm[1],
    latest,
    kind: diffKind(pm[1], latest),
    dev: false,
  });
}

const kindOrder = { patch: 0, minor: 1, major: 2, unknown: 3, 'up-to-date': 4 };
rows.sort(
  (a, b) =>
    kindOrder[a.kind] - kindOrder[b.kind] ||
    a.group.localeCompare(b.group) ||
    a.name.localeCompare(b.name),
);

const visible = showAll ? rows : rows.filter((r) => r.kind !== 'up-to-date');

if (asJson) {
  console.log(JSON.stringify(visible, null, 2));
} else {
  const cols = ['name', 'group', 'current', 'latest', 'kind', 'dev'];
  const width = cols.map((c) =>
    Math.max(c.length, ...visible.map((r) => String(r[c]).length)),
  );
  const line = (vals) =>
    vals.map((v, i) => String(v).padEnd(width[i])).join('  ');
  console.log(line(cols));
  console.log(line(width.map((w) => '-'.repeat(w))));
  for (const r of visible) console.log(line(cols.map((c) => r[c])));
  console.log(
    `\n${visible.length} outdated of ${rows.length} (${rows.filter((r) => r.kind === 'up-to-date').length} up to date)`,
  );
}
