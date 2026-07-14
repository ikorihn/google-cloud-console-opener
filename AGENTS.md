# Repository Guidelines

## Project Structure & Module Organization

This repository is a Raycast extension for opening Google Cloud Console pages and copying project identifiers. Command entry points live in `src/`: `google-cloud-console-opener.tsx` renders the service picker, `google-cloud-copy-project.tsx` renders the project copy command, and `preference.ts` defines shared preference types. Static extension assets live in `assets/`, while Raycast-visible command metadata and preferences are defined in `package.json`.

## Build, Test, and Development Commands

Install dependencies with `pnpm install`; the lockfile is `pnpm-lock.yaml`. Use `npm run dev` to run the extension locally through Raycast during development. Use `npm run build` before release-oriented changes to compile the extension with `ray build`. Use `npm run lint` to run the Raycast ESLint rules, and `npm run fix-lint` for automatic lint fixes. `npm run publish` invokes the Raycast publishing flow.

## Coding Style & Naming Conventions

Write TypeScript with strict compiler settings from `tsconfig.json`. Use React function components for Raycast commands and keep shared types or parsing helpers outside command components when they are reused. Follow the existing kebab-case command file names in `src/`, matching names declared in `package.json`. Formatting is handled by Prettier with double quotes and `printWidth: 200`; linting extends `@raycast`.

## Testing Guidelines

There is no dedicated automated test suite yet. Treat `npm run lint` and `npm run build` as the required verification steps for changes. For behavior changes, also run `npm run dev` and manually verify the affected Raycast command, including preference parsing, project selection, URL opening, and clipboard actions.

## Commit & Pull Request Guidelines

Recent history uses short, imperative commit subjects, with occasional Conventional Commit prefixes such as `feat:`. Prefer Conventional Commits for new work, for example `feat: add service shortcut` or `fix: handle empty project list`. Pull requests should describe the user-visible change, list verification commands run, and include screenshots or short recordings when Raycast UI behavior changes. Link related issues when available.

## Security & Configuration Tips

Do not commit real Google Cloud project IDs, project numbers, credentials, or local Raycast state. Keep sample preferences generic, such as `dev-project-abc123,prd-project-def456`, and document any new required preferences in both `package.json` and `README.md`.
