# Copilot / AI agent instructions — ifn-frontend

This file gives succinct, actionable context for AI coding agents working on this repository.

- Project type: Angular 20 application with optional SSR (server-side rendering).
- Source root: `src/`. Public/static assets live in `public/` and are copied into the build (see `angular.json`).

Key files to inspect (short list):
- `package.json` — scripts: `start` (dev server `ng serve`), `build` (`ng build`), `test` (`ng test`), `serve:ssr:ifn-frontend` (`node dist/ifn-frontend/server/server.mjs`).
- `angular.json` — build/serve/test configurations; note `server: src/main.server.ts` and SSR entry `src/server.ts`.
- `src/main.ts` and `src/main.server.ts` — bootstrap points for browser and server builds.
- `src/server.ts` — Express-based SSR handler using `@angular/ssr/node` (AngularNodeAppEngine). API endpoints can be added here.
- `src/app/app.ts`, `src/app/app.config.ts`, `src/app/app.routes.ts` — app bootstrap, providers (router, hydration), and route definitions. `routes` is currently an empty array.

Architecture notes (what to know):
- App uses the modern standalone bootstrap flow (`bootstrapApplication` in `src/main.ts`). Prefer adding standalone components or explicit `imports` in `@Component` metadata (see `src/app/app.ts` where `RouterOutlet` is included via `imports`).
- SSR is enabled: the build includes a server bundle (`main.server.ts`) and `src/server.ts` wires the server to render pages and serve static assets from the browser bundle (`dist/.../browser`). For production SSR, the repo uses `node dist/ifn-frontend/server/server.mjs`.
- The server uses Express and the AngularNodeAppEngine to produce Node responses — changes to rendering behavior likely belong in `src/server.ts` or server-side bootstrap files.

Build / test / debug commands (concrete):
- Dev server (live reload): `npm start` (runs `ng serve`) — listens on localhost:4200 by default.
- Build (production default): `npm run build` (reads `angular.json` configuration; `production` is the default configuration).
- Build development watch: `npm run watch` (ng build --watch --configuration development).
- Run unit tests: `npm test` (Karma + Jasmine via Angular build kit).
- Run SSR server after a production build: `npm run serve:ssr:ifn-frontend` or `node dist/ifn-frontend/server/server.mjs`.

Project conventions and patterns (concrete):
- SCSS is the default styling language (see `angular.json` and `package.json` Prettier overrides). Keep `*.scss` styling.
- Components are expected to be standalone-friendly. When adding components, use the `imports` array in the `@Component` metadata for other standalone features (see `src/app/app.ts`).
- Routes live in `src/app/app.routes.ts` and are provided via `provideRouter(routes)` in `src/app/app.config.ts`.
- Static assets are sourced from `public/` (referenced in `angular.json`).

Integration points / external dependencies:
- Uses `@angular/ssr` and `@angular/platform-server` for server rendering. The server uses `express` and `@angular/ssr/node` primitives.
- Map support via `leaflet` and `@asymmetrik/ngx-leaflet` (check `package.json` dependencies if adding map features).

How AI should reason about changes (rules-of-thumb):
- For UI changes, modify or add standalone components, update templates under `src/app`, and register routes in `src/app/app.routes.ts` where appropriate.
- For SSR-related changes (rendering, headers, API endpoints), edit `src/server.ts` or server bootstrap (`main.server.ts`).
- When changing build behavior, update `angular.json` and ensure `package.json` scripts remain consistent.
- Tests: update or add Karma specs alongside components; run `npm test` to validate.

Files to open when investigating a change:
- `src/main.ts`, `src/main.server.ts`, `src/server.ts`, `src/app/app.config.ts`, `src/app/app.routes.ts`, `src/app/app.ts`, `src/styles.scss`, `public/`

If you update this file: keep it short and only include code-discoverable conventions. After making changes, run `npm test` and `npm run build` locally to verify no regressions.

Questions for the maintainers (if missing from repository):
- Preferred browser/SSR debugging workflow (e.g., `ng run ifn-frontend:serve` flags, environment variables for SSR).
- Any runtime environment assumptions (NODE version, hosting platform) beyond what's in `package.json`.

— end
