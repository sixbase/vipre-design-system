import { DocPage } from '../DocPage.jsx'
import { Section, Code, PropsTable, IC } from '../primitives.jsx'
import { MOTION } from '../tokens.js'

/* The shared seven-part skeleton every control binds to (§2 of the playbook doc). */
const ANATOMY = [
  ['Height', { code: '--vds-control-h-sm/md/lg' }, '32 / 36 / 44px. Growing fields (Textarea) may opt out.'],
  ['Radius', { code: '--vds-radius-sm' }, '4px — every chrome control agrees, no exceptions.'],
  ['Border', { code: '--vds-border-w' }, '1px, stays literal on purpose (hairlines don’t scale well as rem).'],
  ['Text', 'typescale step (pattern, not a token)', 'sm → detail · md → body · lg → body-lg'],
  ['Internal gap', { code: '--vds-space-2' }, 'Icon↔label, affix↔field — anything living inside one control.'],
  ['Motion', { code: '--vds-dur-fast + --vds-ease-out' }, 'Hover/focus color and border-color transitions.'],
  ['Disabled', 'opacity: 0.5 + pointer-events: none', 'The one sanctioned literal in the system — never a token, never a new gray.'],
  ['Touch', { code: '--vds-tap-target + --vds-control-font-touch-min' }, '44px hit-area overlay; 16px font floor dodges iOS auto-zoom.'],
]

const PAD_RHYTHM = [
  ['Button', 'space-3 (12px)', 'space-4 (16px)', 'space-6 (24px)', 'Pads a label — coarser jump.'],
  ['Field (Input/Textarea)', 'space-2-5 (10px)', 'space-3 (12px)', 'space-4 (16px)', 'Pads a text cursor — tighter jump.'],
]

const BORDER_RULE = [
  ['Action (Button)', 'Tone-carrying', 'The border is part of the action’s color signal (primary, danger…).'],
  ['Field (Input, Select, Textarea)', 'Always neutral — line-strong', 'Chrome, not a judgment. Only “invalid” recolors it, as a real separate signal.'],
]

export function ControlAnatomyPage() {
  return (
    <DocPage
      title="Control Anatomy"
      description="The grammar tokens can't hold on their own — how any control, existing or new, human-built or AI-explored, composes foundation tokens into the Vipre look. Read alongside the token file and a couple of reference components."
    >
      <Section
        title="The binding rule"
        note="A control's own tokens (--vds-{name}-*) point at foundation tokens. They never hold a raw value."
      >
        <Code>{`/* right — points at a foundation token */
--vds-button-pad-x-md: var(--vds-space-4);

/* wrong — a raw value hiding behind a component-scoped name */
--vds-button-pad-x-md: 1rem;`}</Code>
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ marginTop: '0.6rem' }}>
          Found a new value with no matching token? Propose a foundation token — don't inline it
          "just this once." A genuine one-off (glyph geometry, a platform hack) can stay literal,
          but only with a comment explaining why, right at the line.
        </p>
      </Section>

      <Section
        title="Control anatomy"
        note="Every control — action or field — binds to the same seven-part skeleton before it does anything of its own."
      >
        <PropsTable headers={['Part', 'Token(s)', 'Recipe']} rows={ANATOMY} />
      </Section>

      <Section
        title="Motion scale"
        note="The full duration + easing vocabulary controls bind to. The anatomy above uses --vds-dur-fast + --vds-ease-out for hover/focus; larger chrome (panels, the sidenav) reaches for the slower steps. A control's --vds-{name}-dur / -ease resolve here."
      >
        <PropsTable
          headers={['Token', 'Value', 'Controls']}
          rows={MOTION.map((m) => [{ code: m.token }, { code: m.value }, m.usage])}
        />
      </Section>

      <Section
        title="The two focus rings"
        note={<>Two recipes, kept deliberately separate — unifying them is a rendering change (<IC>outline</IC> and <IC>box-shadow</IC> behave differently with clipping and stacking), not a token rename, and it's already been rejected.</>}
      >
        <PropsTable
          headers={['Control class', 'When', 'Recipe']}
          rows={[
            ['Action (Button, Checkbox)', 'Fires on click/press', 'Hard outline — reads on any tone fill'],
            ['Field (Input, Select, Textarea)', 'Holds and edits a value', 'Soft shadow ring — reads as an active editing surface'],
          ]}
        />
        <Code>{`/* action controls */
&:focus-visible {
  outline: var(--vds-control-ring-w) solid var(--vds-focus-ring);   /* 2px */
  outline-offset: var(--vds-control-ring-offset);                    /* 2px */
}

/* field controls */
&:focus-within {
  border-color: var(--vds-focus-ring);
  box-shadow: 0 0 0 var(--vds-control-ring-w)
    color-mix(in oklab, var(--vds-focus-ring) var(--vds-control-ring-tint), transparent); /* 35% */
}
&--invalid:focus-within {
  border-color: var(--vds-danger);
  box-shadow: 0 0 0 var(--vds-control-ring-w)
    color-mix(in oklab, var(--vds-danger) var(--vds-control-ring-tint-invalid), transparent); /* 30% */
}`}</Code>
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ marginTop: '0.6rem' }}>
          The 35% / 30% split is intentional, not drift: danger hues read stronger than the focus
          hue at equal alpha, so the invalid ring drops five points to balance. Two named tokens
          &mdash; don't unify them into one ratio.
        </p>
      </Section>

      <Section
        title="Pad rhythms"
        note="Buttons pad a label; fields pad a text cursor. Different jobs, different rhythm — there's no shared 'control pad' token."
      >
        <PropsTable
          headers={['Family', 'sm', 'md', 'lg', 'Why']}
          rows={PAD_RHYTHM}
        />
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ margin: '0.75rem 0 0.4rem' }}>
          <strong>Select</strong> is the worked example of a principled deviation: its left pad-x
          matches the field family exactly; its right pad-x is one step tighter, to leave room
          for the caret.
        </p>
        <Code>{`&--sm { padding: 0 var(--vds-space-2) 0 var(--vds-space-2-5); }  /* 8px right / 10px left */
&--md { padding: 0 var(--vds-space-2-5) 0 var(--vds-space-3); }  /* 10px right / 12px left */
&--lg { padding: 0 var(--vds-space-3) 0 var(--vds-space-4); }    /* 12px right / 16px left */`}</Code>
      </Section>

      <Section
        title="Border color rule"
        note="Action controls carry tone in their border; field controls never do."
      >
        <PropsTable headers={['Control class', 'Border color', 'Why']} rows={BORDER_RULE} />
        <Code>{`/* fields only — resting-state hover darken */
--vds-input-border-hover: color-mix(in oklab, var(--vds-line-strong), var(--vds-ink) var(--vds-control-hover-mix)); /* 30% */`}</Code>
      </Section>

      <Section
        title="Composition patterns beyond controls"
        note="The same grammar extends past form controls into any composite surface."
      >
        <PropsTable
          headers={['Pattern', 'Rule', 'Reference']}
          rows={[
            ['Concentric radius', 'A wrapper’s radius = the radius of what it wraps + the gap between them, so nested corners share a center.', 'SideNav tile 8 → pill 10 → card 12 ("+2 nesting")'],
            ['Status tint', 'Pair a tone’s -soft background with that same tone’s ink — never a neutral ink on a tinted fill.', 'Badge'],
            ['Motion asymmetry', 'Things leave fast and arrive late — one easing curve, asymmetric timing, layout leads content.', 'MSP Menu motion spec'],
          ]}
        />
      </Section>

      <Section
        title="How to add a new control"
        note="Follow in order — don't skip to step 3."
      >
        <ol className="vds-depth-order">
          <li><span className="vds-depth-order__n">1</span><div><strong>Look-and-feel review.</strong> Agree on states, sizes, and whether it&rsquo;s action- or field-class before any token gets written.</div></li>
          <li><span className="vds-depth-order__n">2</span><div><strong>Bind to the anatomy above.</strong> Height, radius, border, text step, gap, motion, disabled, touch — pull from the shared slice first.</div></li>
          <li><span className="vds-depth-order__n">3</span><div><strong>Define <IC>--vds-{'{name}'}-*</IC> tokens</strong> that reference foundation only — no raw values except a commented, justified literal.</div></li>
          <li><span className="vds-depth-order__n">4</span><div><strong>Document the tokens + any motion spec.</strong> A grouped Tokens table, and prose for any choreography a token can&rsquo;t capture.</div></li>
          <li><span className="vds-depth-order__n">5</span><div><strong>Flag true gaps as foundation proposals.</strong> One raw value is a shortcut; two controls with the same raw value is a missing token.</div></li>
        </ol>
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ marginTop: '0.6rem' }}>
          Two-step review, restated: (1) does it look and behave right, then, separately, (2) does
          every visual value trace back to a token. Don&rsquo;t collapse these into one pass.
        </p>
      </Section>

      <Section
        title="For AI exploration"
        note="An agent exploring a new component needs exactly three inputs."
      >
        <PropsTable
          headers={['Input', 'What it gives you']}
          rows={[
            [{ code: '_tokens.scss' }, 'The full value vocabulary — every visual decision must resolve to something already here, or a proposed addition.'],
            ['This page', 'The "how things combine" layer — anatomy, the two ring recipes, pad rhythms, the border rule, composition patterns.'],
            ['SideNav, Button, Input', 'Read, don’t guess: concentric radius + choreography (SideNav), the outline-ring/tone-border recipe (Button), the shadow-ring/neutral-border recipe (Input).'],
          ]}
        />
        <p className="vds-text vds-text--body vds-text--tone-muted" style={{ marginTop: '0.6rem' }}>
          The one guardrail that overrides everything else: <strong>never inline a raw visual
          value.</strong> If the tokens and this page don&rsquo;t cover a case, that gap is itself
          the finding to report — propose the token, don&rsquo;t work around it with a literal.
        </p>
      </Section>
    </DocPage>
  )
}
