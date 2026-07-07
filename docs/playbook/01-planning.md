# 01 — Planning

> Mandate, scope, and component status. Update the status table whenever a component is added or changed.

## Mandate

A token-driven design system for Vipre's product UI — the MSP **scope navigator** and related SaaS surfaces. It must be:

- **Consumable** by Vipre's front-end team (install the package; import tokens and/or components — or use the CSS bundle framework-agnostically).
- **Contributable** by designers and others (edit one component folder; everything's co-located).
- **Coherent** — cool, clinical, data-dense; one accent; the Rubik typescale; light + dark; every screen size.

Structure and delivery mirror `sixbase/claude-design-system`; the aesthetic is fresh (see [00-principles.md](00-principles.md) and [06-decisions-log.md](06-decisions-log.md)).

## Foundations — status

| Foundation | Page | Status |
| --- | --- | --- |
| Colors (3-tier, light/dark) | `/foundation/colors` | ✅ |
| Typography (Rubik, 11 steps, fluid display/title/heading) | `/foundation/typography` | ✅ |
| Spacing (4px scale) | `/foundation/spacing` | ✅ |
| Layout (container, 12-col grid, responsive page-pad) | `/foundation/layout` | ✅ |
| Responsiveness (breakpoint mixins, tap targets, container-first) | `/foundation/responsiveness` | ✅ |
| Depth (elevation semantics, z-index scale) | `/foundation/depth` | ✅ |

## Components — status

All ✅ = built, token-bound, documented (with a framework-agnostic Markup section), registered in the barrel + style aggregate + routes.

**Layout primitives:** Surface · Stack · Inline · Grid · Divider

**Typography:** Text · Heading

**Controls:** Button · Icon · Field · Input · SearchInput · Textarea · Checkbox · Radio + RadioGroup · Switch · Select · Combobox · Slider · SegmentedControl · Popover · Spinner

**Overlays:** Modal · Drawer · Menu (+ MenuItem/MenuSeparator/MenuLabel) · Tooltip · Toast (+ ToastProvider/useToast) · CommandPalette

**Navigation:** Tabs (+ TabList/Tab/TabPanel) · Accordion (+ Item/Trigger/Content) · Breadcrumb · Pagination · Stepper · Kbd

**Feedback & display:** Badge · Tag · Avatar (+ AvatarGroup) · Alert · Progress · Skeleton · EmptyState · DescriptionList · VisuallyHidden

**Data & metrics:** Table (sortable, selectable, sticky, opt-in `responsive` stacked-card mode) · StatTile · MetricCard · Sparkline

**App chrome:** AppShell (+ AppShellNavTrigger) · TopBar · SideNav (the MSP v2 navy rail, + ProductTile) · CurrentLeftNav (legacy shipped nav, frozen) · PageHeader · ScopeNavigator · TimeframeSelect

## Templates

Full-page compositions documented under `/templates/*`: Product Dashboard · MSP Shell · Customer Directory · Device List · Policy List · Entity Detail · Current Nav Shell.

## Roadmap

Candidates, not commitments: DatePicker/Calendar · FileUpload · toolbar/DataGrid extensions (column resize, virtualization) · charts beyond Sparkline · Combobox multi-select (tag input) · Figma library sync.

When you complete one, move it into the status list and add its docs page + route.
