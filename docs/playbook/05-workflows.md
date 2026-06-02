# 05 — Workflows

## Add a new component

1. **Create the folder** `src/components/{Name}/`:
   - `{Name}.jsx` — `forwardRef` + `displayName`, defaults in the signature, `cx()` for classes, spread `...props`, JSDoc with an `@example`.
   - `{Name}.scss` — BEM (`.vds-{name}`, `--modifier`, `__part`), token-bound only, `@use '../../styles/typography' as type;` if it needs the type scale.
   - `index.js` — `export { {Name} } from './{Name}.jsx'`.
2. **Register it:**
   - `src/components/index.js` — add to the barrel.
   - `src/styles/_components.scss` — `@use '../components/{Name}/{Name}';`.
3. **Document it:**
   - `src/docs/pages/{Name}Page.jsx` — use `ComponentPage` (title → description → Installation → example sections via `Preview` → Props via the `props` array → Accessibility).
   - `src/docs/routes.js` — add a route entry under the right nav group.
4. **Verify & record:**
   - `npm run dev`, check light + dark, keyboard focus, and the Props table.
   - `npm run build` and `npm run build:lib` succeed.
   - Move the component into the status table in [01-planning.md](01-planning.md); log any real decision in [06-decisions-log.md](06-decisions-log.md).

## Add or rename a token

1. Edit `src/styles/_tokens.scss`.
2. If it's a documented value, update `src/docs/tokens.js` so the foundation pages stay accurate.
3. After a rename: `grep -r "old-token-name" src/` — CSS variables fail silently.

## Ship a release / update the live docs

- `npm run build:lib` regenerates the consumable bundles in `dist/`.
- Push to `main` → the GitHub Actions workflow builds the docs app and redeploys GitHub Pages.

## Contribution flow

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for the human-facing version and the pre-PR checklist.
