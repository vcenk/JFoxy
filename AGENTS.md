# Repository Guidelines

## Project Structure & Module Organization
JobFoxy is a Next.js 14 App Router app. Key directories:
- `app/` route segments, layouts, and API routes under `app/api/`.
- `components/` UI and feature components (resume, practice, mock, landing).
- `lib/` shared logic: `engines/` AI processing, `clients/` API wrappers, `data/` static datasets, `utils/`.
- `contexts/`, `hooks/`, `store/` for React state and Zustand.
- `database/` Supabase schemas, migrations, and generated types.
- `public/` assets; `styles/` global CSS; `scripts/` maintenance utilities.

## Build, Test, and Development Commands
Use npm scripts from `package.json`:
```bash
npm run dev        # Start Next.js dev server at http://localhost:3000
npm run build      # Production build
npm run start      # Run the production build locally
npm run lint       # Next.js ESLint rules
npm run type-check # TypeScript typecheck (no emit)
```
Install deps with `npm install` before running.

## Coding Style & Naming Conventions
- TypeScript + React with Tailwind CSS; keep formatting consistent with existing files (2-space indentation, no semicolons, single quotes).
- Use path alias imports like `@/components/...` from the repo root.
- Component files use PascalCase (`ResumeCanvas.tsx`), hooks use `useX` naming, and route segments follow Next.js conventions (`[id]`, `(legal)`).

## Testing Guidelines
- No dedicated test runner is configured yet; rely on `npm run lint` and `npm run type-check` for baseline checks.
- Ad-hoc scripts exist for manual verification (e.g., `node test-theme-render.js`, `node test-liveavatar-ids.js`).
- TypeScript utilities in `scripts/` may require `.env.local` keys; run them with your preferred TS runner when needed.

## Commit & Pull Request Guidelines
- Commit messages in this repo are short and imperative (e.g., "Fix ...", "Add ..."); occasional `feat:` prefixes appear; use them when appropriate.
- PRs should include a concise summary, testing notes, and screenshots for UI changes. Link related issues and update `.env.example` when adding new config.

## Security & Configuration
- Keep secrets in `.env.local` only; never commit real keys.
- Database changes live in `database/schemas/` and `database/migrations/`; keep `database/types/database.types.ts` in sync.
