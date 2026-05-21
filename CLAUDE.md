# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Does

Provides markdown convention templates for AI coding assistants (Claude, Cursor, etc.). A CLI downloads these templates from GitHub and generates `docs/` files plus `CLAUDE.md`/`AGENTS.md` in the target project.

## CLI Development

```bash
cd cli
npm install
npm run dev     # run via ts-node (interactive, requires terminal)
npm run build   # compile TypeScript → dist/
```

No test suite exists. Verify changes by running `npm run build` and confirming no TypeScript errors.

## Architecture

The CLI flow: `prompt → downloadTemplates → generateFiles`

- `cli/src/prompt.ts` — collects stack choices (frontend, routing, backend, service impl style) via inquirer
- `cli/src/download.ts` — fetches `master.tar.gz` tarball from GitHub into a temp dir
- `cli/src/generate.ts` — copies template files based on answers, then writes `CLAUDE.md` and `AGENTS.md` (both identical) with `@docs/...` file references

### Template Selection Logic

| Selection | Source path |
|---|---|
| Frontend (React+TS) | `templates/frontend/*.md` + routing subdirectory |
| Frontend routing | `templates/frontend/{react-router,app-router}/routing.md` → `docs/frontend/routing.md` |
| Backend (NestJS) | `templates/backend/nestjs/*.md` + `architecture/no-impl/folder-structure.md` |
| Backend (Spring Boot) | `templates/backend/spring-boot/*.md` + `architecture/{impl,no-impl}/folder-structure.md` |
| Common | `templates/common/*.md` → `docs/*.md` |

NestJS only supports `no-impl` architecture; the `impl` option only applies to Spring Boot.

## Adding Templates

Add `.md` files under `templates/<area>/<framework>/`. The generate logic picks up all `.md` files directly inside each stack directory automatically — no code changes needed unless adding a new stack or routing strategy.

## Publishing

The CLI is published to npm as `ai-conventions-cli`. Run `npm run build` before `npm publish` (enforced via `prepublishOnly`).
