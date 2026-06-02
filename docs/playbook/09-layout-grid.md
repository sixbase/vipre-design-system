# 09 — Layout & Grid

The structural rhythm for screens. Page composition uses these tokens; it never invents new layout values. Tokens live in `src/styles/_tokens.scss` (Tier 3) and are documented at `/foundation/layout`.

## Tokens

| Token | Value | Use for |
| --- | --- | --- |
| `--vds-container` | 1200px | Max content width, centered |
| `--vds-gutter` | 24px (`space-6`) | Gap between grid columns |
| `--vds-section` | 48px (`space-12`) | Vertical rhythm between major sections |
| `--vds-columns` | 12 | Base grid column count |

## The grid

- **12 columns**, gutter = `--vds-gutter`.
- Common splits: halves (6+6), thirds (4+4+4), quarters (3+3+3+3), wide+narrow (8+4), wide+rail (9+3).
- Content stays within `--vds-container`, centered. Dense data tables may go full-width inside their panel, but the page shell respects the container.

## Two spacing scopes — don't mix

| Scope | Token | Use for |
| --- | --- | --- |
| Component internals | `--vds-space-*` (4px grid) | Padding, element gaps, stacks inside a component |
| Section / page level | `--vds-section` | Vertical gaps between major page sections |

## Density note

Vipre is a data-dense SaaS product. Section rhythm (`--vds-section` = 48px) is deliberately tighter than an editorial/marketing system would use — screens pack more information, so the vertical rhythm is compact but consistent.
