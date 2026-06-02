# Contributing to the Vipre Design System

For designers refining the system and front-end engineers building it out. The golden rule: **every visual value is a token, and every component owns its styles.**

## Setup

```bash
npm install
npm run dev      # http://localhost:5173
```

## Editing an existing component

Everything for a component lives in one folder — `src/components/{Name}/`:

- `{Name}.jsx` — the React component (props, class assembly, a11y)
- `{Name}.scss` — its styles (BEM, token-bound)
- `index.js` — re-export

Change the look → edit the `.scss`. Change behavior/props → edit the `.jsx`. The docs page for it lives at `src/docs/pages/{Name}Page.jsx`. Save and the docs hot-reload.

**Rules:** no raw hex/px (use `var(--vds-*)` tokens); no `!important`; no inline styles; disabled = opacity, not a new color; keep the `:focus-visible` ring.

## Adding a new component

See [`docs/playbook/05-workflows.md`](docs/playbook/05-workflows.md) for the full recipe. In short:

1. Create `src/components/{Name}/{Name}.jsx`, `{Name}.scss`, `index.js`.
2. Register it in **`src/components/index.js`** (barrel) and **`src/styles/_components.scss`** (style aggregate).
3. Add a docs page `src/docs/pages/{Name}Page.jsx` and a route entry in `src/docs/routes.js`.
4. Verify in the docs site, then update the status table in [`docs/playbook/01-planning.md`](docs/playbook/01-planning.md).

## Adding or changing a token

Edit `src/styles/_tokens.scss`. If it's a documented color/type/spacing value, also update the doc data in `src/docs/tokens.js` so the foundation pages stay accurate. After a rename: `grep -r "old-name" src/`.

## Build the consumable bundles

```bash
npm run build:lib    # → dist/vipre-tokens.css  and  dist/vipre.css
```

## Before you open a PR

- [ ] Tokens only — no raw hex/px, no `!important`, no inline styles
- [ ] Component owns its styles — no page-level overrides
- [ ] `forwardRef` + `displayName`; native props spread; `cx()` for classes
- [ ] Keyboard works, focus ring visible, WCAG AA contrast, reduced-motion honored
- [ ] Docs page added/updated; status table updated; decision logged if it was a real choice
- [ ] `npm run build` and `npm run build:lib` both succeed
