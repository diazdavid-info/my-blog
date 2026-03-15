# AGENTS.md

## Purpose

This file gives coding agents the minimum repo-specific context needed to work safely in this project.
It is intentionally practical: commands first, then conventions, then caveats discovered from the codebase.

## Repository Snapshot

- App type: small static Astro blog deployed to Cloudflare Pages.
- Package manager: `pnpm` is the source of truth (`pnpm-lock.yaml` is committed).
- Runtime requirement: Node.js `>=22.12.0` (`.node-version` pins `22.16.0`).
- Styling: Tailwind CSS v4 plus `@tailwindcss/typography` via `@tailwindcss/vite`.
- Content source: Markdown posts in `src/content/posts/` managed through Astro content collections configured in `src/content.config.ts`.
- TypeScript mode: strict Astro preset via `tsconfig.json` extending `astro/tsconfigs/strict`.
- Key files: `astro.config.mjs`, `.prettierrc.mjs`, `src/layouts/Layout.astro`, `src/styles/global.css`, `src/pages/index.astro`, `src/pages/[id].astro`, `src/content.config.ts`.

## Agent Rules Files Present

- No `.cursorrules` file found.
- No `.cursor/rules/` directory found.
- No `.github/copilot-instructions.md` file found.
- If any of these are added later, treat them as higher-priority local guidance and merge them into your plan before editing.

## Validation Status Discovered During Analysis

- `node --run dev` / `pnpm dev` starts successfully after migrating Tailwind to the v4 Vite plugin setup and fixing the content collections configuration.
- Cloudflare Pages must use a Node 22+ build environment; the v2 build image defaults to Node 18 and will fail for Astro 6 unless overridden.
- `pnpm astro check` is not usable yet because `@astrojs/check` is not installed.
- `pnpm build` succeeds as a plain static Astro build after removing the Cloudflare adapter and moving the collection config to `src/content.config.ts`.
- The repository intentionally does not include a root Wrangler config because this static Pages deployment does not need one, and having one causes noisy Pages warnings.
- There is no dedicated lint script in `package.json`.
- There is no automated test framework configured in `package.json` or config files.

## Build, Lint, And Test Commands

Use `pnpm` unless the user explicitly asks for another package manager.

### Build

- Install dependencies: `pnpm install`
- Local dev server: `pnpm dev`
- Full build: `pnpm build`
- Preview built output: `pnpm preview`
- Direct Astro CLI: `pnpm astro ...`
- For Cloudflare Pages, prefer build image v3 or set `NODE_VERSION=22.16.0` and `PNPM_VERSION=10.12.1`.

### Lint / Static Checks

- Formatting check for whole repo: `pnpm exec prettier --check .`
- Formatting fix for whole repo: `pnpm format`
- Formatting fix for one file: `pnpm exec prettier --write path/to/file`
- Formatting check for one file: `pnpm exec prettier --check path/to/file`
- Astro diagnostics after adding dependency: `pnpm astro check`
- If `astro check` is needed and missing, install first: `pnpm add -D @astrojs/check typescript`

### Tests

- There is no test runner configured right now.
- There are no `test`, `test:unit`, `test:e2e`, `vitest`, `jest`, or `playwright` scripts.
- There are no discovered `*.test.*` or `*.spec.*` files in the app source.
- For now, the closest thing to validation is running formatting checks plus a successful Astro build.

### Running A Single Test

- Not available in the current repo state because no test framework is configured.
- Do not invent `pnpm test -- <name>` commands in this repository.
- If a test framework is added later, update this file with the exact single-test command syntax.

## Recommended Agent Validation Flow

After code changes, prefer this order:

1. `pnpm exec prettier --check <touched-files-or-.>`
2. `pnpm astro check` if the dependency exists.
3. `pnpm build`

If validation is blocked by missing dependencies or repo misconfiguration, report that clearly instead of masking it.

## Coding Style

Follow existing project conventions before applying general preferences.

### Imports

- Use ES module syntax everywhere.
- Keep local Astro imports relative, e.g. `../layouts/Layout.astro`.
- Keep `astro:content` imports named and explicit, e.g. `import { getCollection, render } from "astro:content";`.
- Match the repo's current quote style: double quotes in JS/TS/Astro frontmatter.
- Preserve semicolons in JS/TS files; existing config files use them consistently.

### Formatting

- Use Prettier as the formatter of record.
- `.astro` files are formatted through `prettier-plugin-astro`.
- Keep files ASCII unless the file already uses Spanish prose or another justified Unicode string.
- Markdown post content already uses Spanish accents and can keep them.

### Types

- Treat TypeScript strictness as enabled.
- Avoid `any`; the current pages use `post: any`, but new code should prefer proper Astro collection types.
- Reuse schema-driven types from `src/content.config.ts` when possible.
- In Astro components, define a `Props` interface when component props are expected.
- Destructure typed props near the top of the frontmatter block.

### Naming

- Components and layouts: PascalCase, e.g. `Layout.astro`.
- Route files: follow Astro routing conventions such as `index.astro` and `[id].astro`.
- Variables and functions: camelCase.
- Collection names: lower-case plural nouns, e.g. `posts`.
- Markdown filenames should remain URL-friendly slugs.
- Frontmatter keys should stay stable and match the schema exactly: `title`, `description`, `h1`, `author`, `date`, `image`.

### Astro And Markup Conventions

- Keep the frontmatter block at the top of `.astro` files.
- Do data loading in frontmatter, not inline in the template.
- Keep page templates simple and mostly declarative.
- Prefer `getCollection("posts")` for content access rather than ad hoc filesystem reads.
- Use `getStaticPaths()` for dynamic content routes that are statically generated.
- Continue using the shared `Layout` wrapper for pages unless there is a strong reason not to.

### Tailwind And Styling

- Use utility classes inline in Astro markup, as the existing pages do.
- Keep styling simple and consistent with the current minimal blog aesthetic.
- Prefer Tailwind utilities over adding large custom CSS blocks.
- Reserve `<style>` blocks for truly global or structural rules, like the existing shell reset in `Layout.astro`.
- If typography changes affect rendered Markdown, consider the `prose` class usage in `src/pages/[id].astro`.

### Content Authoring Rules

- Blog posts live in `src/content/posts/` as Markdown files.
- Every post must include all schema-required frontmatter fields.
- `image` must be a valid URL string because the schema enforces `.url()`.
- Keep content language and tone consistent with the existing Spanish posts unless the user requests otherwise.
- Prefer descriptive headings and fenced code blocks with language tags.

### Error Handling And Safety

- Favor failing fast at build/content-validation time instead of silently accepting bad data.
- When changing content schema, update all impacted content files.
- Do not swallow exceptions in config or data-loading code without a clear reason.
- If a command is known to fail because of repo setup, say so explicitly in your final report.
- Do not add new dependencies just to satisfy style preferences unless the user asks.

## Known Codebase Issues Worth Preserving In Context

- `src/pages/[id].astro` still types `Astro.props` via an explicit cast; further cleanup could improve this.
- `README.md` is still the default Astro starter README and is not a reliable source of project-specific workflow.

## When Editing This Repo

- Prefer small, targeted changes over broad refactors.
- Preserve the existing Astro + Markdown content pipeline.
- Do not introduce a new testing or linting stack unless the user asks for it.
- If you add scripts, also update this file.
- If you change the Tailwind integration or add `@astrojs/check`, update the command/status sections here.
