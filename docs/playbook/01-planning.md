# 01 — Planning

> Mandate, scope, and component status. Update the status table whenever a component is added or changed.

## Mandate

A token-driven design system for Vipre's product UI — the MSP **scope navigator** and related SaaS surfaces. It must be:

- **Consumable** by Vipre's front-end team (install the package; import tokens and/or components).
- **Contributable** by designers and others (edit one component folder; everything's co-located).
- **Coherent** — cool, clinical, data-dense; one accent; the Rubik typescale; light + dark.

Structure and delivery mirror `sixbase/claude-design-system`; the aesthetic is fresh (see [00-principles.md](00-principles.md) and [06-decisions-log.md](06-decisions-log.md)).

## Foundations — status

| Foundation | Page | Status |
| --- | --- | --- |
| Colors (3-tier, light/dark) | `/foundation/colors` | ✅ |
| Typography (Rubik, 11 steps) | `/foundation/typography` | ✅ |
| Spacing (4px scale) | `/foundation/spacing` | ✅ |
| Layout (container, 12-col grid) | `/foundation/layout` | ✅ |

## Components — status

| Component | API | Status |
| --- | --- | --- |
| `Heading` | `level` (display/title/heading/subheading), `as`, `tone` | ✅ |
| `Text` | `variant` (body-lg…nano), `as`, `tone` | ✅ |
| `Button` | `variant` (primary/secondary/ghost/danger) × `size` (sm/md/lg) | ✅ |
| `Badge` | `tone` (neutral/primary/success/warning/danger/info), `dot` | ✅ |
| `ScopeNavigator` | `path`, `onNavigate`, `rootItems`, `typeConfig`, `statusConfig`, `onSearch`, `actions` — the MSP hierarchy breadcrumb (composite: Surface + Input + Icon) | ✅ |

## Roadmap — the data-dense set MSP needs

Deferred, in rough priority for the scope navigator prototype:

Table · Input · Select · Checkbox · Card · Tabs · SideNav · FilterPanel · Modal · Toast · Tooltip · Avatar · ProgressBar · Breadcrumb · Pagination.

When you complete one, move it into the Components status table and add its docs page + route.
