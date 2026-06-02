# 02 — Typography

**Font:** Rubik (Google Fonts) — weights 400 / 500 / 600 / 700 + 400 italic.
Loaded in [`index.html`](../../index.html). Rubik is geometric, friendly, and tall in
the x-height, so it stays legible at the small sizes a data-dense product lives in.

## The typescale

An 11-step semantic scale, weighted toward the small end (this is a dense product —
12–14px does most of the work). Line-heights step on a 4px grid. Tracking goes
**negative as size grows, positive as it shrinks** — keeps headings tight and tiny
labels legible. Tracking is eased off vs. a typical Inter scale because Rubik is
already open.

| Token | Size | LH | Weight | Tracking | Use |
| --- | --- | --- | --- | --- | --- |
| `text-display` | 30 | 36 | 600 | -0.022 | Empty-state hero, big numbers |
| `text-title` | 24 | 32 | 600 | -0.017 | Page H1 |
| `text-heading` | 20 | 28 | 600 | -0.012 | Section H2 |
| `text-subheading` | 16 | 24 | 500 | -0.006 | Card / panel title |
| `text-body-lg` | 15 | 22 | 400 | — | Emphasis body |
| `text-body` | 14 | 20 | 400 | — | Default text |
| `text-caption` | 13 | 18 | 400 | — | Secondary text |
| `text-detail` | 12 | 16 | 400 | — | Dense tables / metadata |
| `text-micro` | 11 | 14 | 500 | — | Badges, tight labels |
| `text-eyebrow` | 11 | 14 | 600 | +0.04 | UPPERCASE overlines |
| `text-nano` | 10 | 14 | 500 | +0.03 | Smallest pills / tags |

Weight, line-height, and tracking are baked into each token, so you don't re-add
`font-semibold` / `tracking-*` at the call site. For numeric tables, still add `tabular-nums`.

## How to use it

Never reach for a raw `text-*` size or an `<h1>`. Use the components:

```jsx
<Heading level="title" as="h1">Customer Management</Heading>
<Heading level="subheading" as="h3">Package adoption</Heading>
<Text variant="body" tone="muted">…</Text>
<Text variant="eyebrow" tone="primary">Overview</Text>   {/* uppercase comes free */}
<Text variant="detail" as="span" className="tabular-nums">1,284</Text>
```

`level`/`variant` sets the **visual** size; `as` sets the **semantic** element — so
heading hierarchy stays correct independent of how big something looks.
