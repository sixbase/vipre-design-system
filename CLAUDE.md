# CLAUDE.md — Vipre Design System

Project rules for AI agents and engineers. Read `docs/playbook/` before any task — the playbook is the law.

## Identity

A token-driven design system for Vipre's product UI (the MSP **scope navigator** and related SaaS surfaces). Cool, clinical, data-dense. The **methodology** is borrowed from `sixbase/claude-design-system`; the **aesthetic is fresh**. It must stay **consumable** by Vipre's front-end team and **contributable** by designers.

## Architecture — the hierarchy

1. **Tokens are the foundation.** Every visual value comes from a token in `src/styles/_tokens.scss`, emitted as `--vds-*` CSS custom properties. Three tiers:
   - **Primitive** — raw ramps (`--vds-graphite-500`). Never used in components.
   - **Semantic** — intent (`--vds-primary`, `--vds-ink`). Bound to primitives in `:root` / `.dark`.
   - **Scale** — typescale, spacing, radius, shadow, motion, layout.
   - **Never use raw hex/px in a component.** If a token is missing, add it — don't inline a value.
2. **Components are the single source of truth.** All styling lives in the component's co-located `.scss`. Docs pages compose; they never restyle a component. If something looks wrong on a page, fix the component.
3. **Pages compose, they don't invent.** No page-level component overrides, no new visual values.

## Delivery model (don't break these)

- `npm run build:tokens` → `dist/vipre-tokens.css` (tokens only — plain `--vds-*` CSS custom properties consumers map into their own theme layer).
- `npm run build:styles` → `dist/vipre.css` (tokens + typescale + all component styles).
- `package.json` exports: `.` (components), `./tokens.css`, `./styles.css`. Keep these stable.
- Components ship as **source JSX** + a **global CSS bundle** (BEM classes). Consumers import the CSS once and use the React components — they never import a component's SCSS directly.

## Component standards

Each component is a **folder** under `src/components/{Name}/`:
```
Button/
├── Button.jsx     ← forwardRef, displayName, JSDoc with @example, native props spread
├── Button.scss    ← BEM with vds- prefix, token-bound only, @use the typescale mixin
└── index.js       ← re-export
```
Then register it: `src/components/index.js` (barrel) **and** `src/styles/_components.scss` (style aggregate).

Required patterns:
- `forwardRef` + `displayName`; spread native attributes (`...props`) onto the root.
- Defaults for `variant`/`size`/`tone` in the signature; classes assembled with `cx()`.
- BEM: `.vds-button`, `.vds-button--primary`, `.vds-badge__dot`.
- Disabled = `opacity: 0.5` + `pointer-events: none`, never a new gray.
- Visible `:focus-visible` ring using `--vds-focus-ring`.
- A11y is a gate: WCAG AA contrast, keyboard support, `prefers-reduced-motion`, sensible ARIA (e.g. status `Badge` tones get `role="status"`).

## Typography

- Font: **Rubik** (400/500/600/700). Always render text via `<Text>` / `<Heading>` — never raw `<h1>`/`<p>` with ad-hoc sizes.
- `level`/`variant` = visual size; `as` = semantic tag.

## Docs site

- One page per topic under `src/docs/pages/`, registered in `src/docs/routes.js` (the single source for sidebar + hash router).
- Component pages use the `ComponentPage` anatomy: title → description → Installation → example sections → Props → Accessibility.
- Foundation pages use `DocPage`. Token doc data lives in `src/docs/tokens.js` (mirrors `_tokens.scss` — keep in sync).

## Build & dev

```bash
npm run dev          # docs site at :5173
npm run build        # build the docs app (GitHub Pages)
npm run build:lib    # build both consumable CSS bundles
```
After renaming a token, `grep -r "old-token-name" src/` — CSS variables fail silently.

## Playbook maintenance

Every session: log significant choices in `docs/playbook/06-decisions-log.md`, capture gotchas in `07-lessons-learned.md`, and update the component status table in `01-planning.md` when components are added.
