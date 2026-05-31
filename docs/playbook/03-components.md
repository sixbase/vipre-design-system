# 03 — Components

## Conventions

- **One file per component** (POC simplicity). A `.tsx`/`.test`/`.stories` split can
  come later if this graduates from POC.
- `forwardRef`, with the ref pointed at the real root element.
- Extends the native element's props (`...props` spread onto the root) so callers get
  `onClick`, `aria-*`, `id`, etc. for free.
- `variant` / `size` / `tone` have **defaults in the signature**.
- Classes assembled with the `cx()` helper (array + filter), never string templates.
- Token-bound only: colors via `bg-primary` / `text-ink`, sizing via `text-*` scale,
  radius via `rounded-[var(--radius-md)]`. No raw hex/px.
- Disabled = `opacity-50`, never a new gray.
- Interactive components get a visible `focus-visible` ring using `--color-focus-ring`.

## Status

| Component | Variants | Notes |
| --- | --- | --- |
| `Heading` | display / title / heading / subheading | `as` controls the semantic tag |
| `Text` | body-lg / body / caption / detail / micro / eyebrow / nano | `tone`: default / muted / subtle / primary / success / warning / danger |
| `Button` | primary / secondary / ghost / danger × sm / md / lg | focus ring, disabled, full native button props |
| `Badge` | neutral / primary / success / warning / danger / info | optional status `dot` |

## Deferred (next up — the data-dense set the product needs)

Table · Tabs · SideNav · FilterPanel · Card · Input / Select / Checkbox · Modal · Toast · Tooltip · Avatar · ProgressBar.

When you add one: build it token-bound, add a live example to [`App.jsx`](../../src/App.jsx),
move the row from this list into the status table, and log any real decision in
[04-decisions-log.md](04-decisions-log.md).
