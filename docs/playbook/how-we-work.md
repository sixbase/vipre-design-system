# How We Work — cheat sheet

A short, living checklist for AI agents + engineers. I (the agent) keep this updated every session.
Deeper detail lives in the numbered playbook files and `CLAUDE.md`; this is the fast reference.

## The rules that never change

1. **Tokens first.** Every visual value is a `--vds-*` token. No raw hex/px in a component — if a
   token is missing, add it. (`02-tokens.md`)
2. **Component = source of truth.** Styling lives in the component's `.scss`. Pages compose, never
   restyle. Fix the component, not the page.
3. **Icons: outline only.** Material Symbols, `-outline-rounded`. A few (e.g. `domain`) have no
   outline in the icon package — embed Google's official outlined SVG by hand. (`icons.jsx`)
4. **Optically center, don't just math-center.** Nudge the *ink*, not the box. Measure it — the icon
   and text should line up to within ~0.25px. Log the technique in `07-lessons-learned.md`.
5. **Accessibility is a gate.** WCAG AA contrast (light + dark), keyboard, focus ring, sensible ARIA.
   When a tone fails on a soft bg, add an `--vds-on-*-soft` text token at the lightest passing step.
6. **Fix, then check on the live page.** Edit source → verify in the running docs site (measure real
   computed values), never eyeball. Then show proof.

## Every change, update ALL of these

- The **component** (`.scss` / `.jsx`).
- The **token** in `_tokens.scss` *and* its mirror in `src/docs/tokens.js`.
- The **docs page** for that component (props, anatomy, markup, examples).
- The **playbook**: choices → `06-decisions-log.md`, gotchas → `07-lessons-learned.md`, status →
  `01-planning.md`. And this cheat sheet if a rule changed.

## How Alvin likes it

- Talk to him in **extremely short, baby-simple words**. No jargon.
- **Docs copy is ELI5 too**: page descriptions, Section notes, and a11y bullets use short plain
  sentences and everyday words. Keep lookup facts (prop tables, token names/values, code) technical.
  Banned jargon list + examples live in the 2026-07-16 decisions-log entry.
- When a request is ambiguous, pick the most literal reading, **say which**, and move — he'll correct.
- Push/merge only when asked. This repo works straight on `main` (linear history).

## Button size spec (current)

| Size | Height | Text step | Weight | Icon | Gap | Pad-x |
|------|--------|-----------|--------|------|-----|-------|
| xs | 28px | micro (11) | medium | 14 | 8 | 8 |
| sm | 32px | detail (12) | medium | 16 | 8 | 12 |
| md | 36px | body (14) | medium | 16 | 10 | 16 |
| lg | 44px | body-lg (15) | medium | 20 | 12 | 24 |
| xl | 52px | subheading (16) | medium | 20 | 12 | 32 |

xl stands out by **size, not weight**. Label nudged down `0.5px` at xs/md to sit level with the icon.
Open question: icon size is **not** a token yet (callers pick it) — candidate for `--vds-button-icon-*`.
