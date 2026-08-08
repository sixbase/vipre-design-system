import { forwardRef } from 'react'
import { Check, ChevronRight, TriangleAlert } from '@icons'
import { cx } from '../../lib/cx.js'
import { Icon } from '../Icon/index.js'

/* A step's visual state. A per-step `status` (e.g. 'error') wins; otherwise
   it's derived from position relative to the current step. */
function stepState(step, index, currentIndex) {
  if (step.status) return step.status
  if (index < currentIndex) return 'complete'
  if (index === currentIndex) return 'current'
  return 'upcoming'
}

const STATE_LABEL = {
  complete: 'Completed: ',
  error: 'Error: ',
}

/**
 * Stepper
 *
 * Progress through an ordered flow — onboarding, a wizard, a remediation
 * runbook. Pass the steps as data; point `current` at where the user is.
 *
 * Props:
 * - steps:       [{ id, label, description?, status? }] — status: 'error'
 *                overrides the derived state for that step
 * - current:     the active step — an index (number) or a step id (string)
 * - variant:     'track' | 'inline' | 'compact'   (default 'track')
 * - orientation: 'horizontal' | 'vertical'   (default 'horizontal') — 'track' only
 * - onStepClick: (step, index) => void — when given, completed (and error)
 *                steps become buttons so users can jump back ('track' and
 *                'inline')
 * - all native attributes (spread onto the <ol>, or the <div> for 'compact')
 *
 * ---- Which variant -------------------------------------------------------
 * 'track' names every step on a connector line that STRETCHES to fill its
 * container. Use it when the step names are information the user needs before
 * they commit, and the stepper is the main thing on that row — a runbook, an
 * onboarding page, anything with 3+ steps and room to breathe.
 *
 * 'inline' names every step too, but sized to its CONTENT and separated by a
 * chevron instead of a rule. Use it when the stepper has to share a line with
 * something else — a page header, a toolbar, the top of a card. Track's
 * stretching connector is what makes it unusable there: it either eats the
 * whole row or strands the steps at opposite ends of it. Inline stays as wide
 * as its words, so what's left of the row is still usable. It drops
 * `description` (there's no second line to put it on) and wraps rather than
 * flipping vertical.
 *
 * 'compact' names only the step you're ON ("Step 1 of 2 · Details") over a
 * segmented rail. Use it when even the names are more than the surface can
 * carry: two- or three-step flows, and dialog, drawer or panel headers.
 *
 * So: does the user need every step's NAME? No → compact. Yes, and the stepper
 * owns the row → track. Yes, but it's sharing the row → inline.
 *
 * ---- Colour --------------------------------------------------------------
 * Every variant reads progress in ONE accent, no second hue. Green is the
 * outcome colour ("this succeeded") and clearing step 1 of 2 is not an outcome,
 * so don't recolour completed steps green per-flow.
 *
 * What separates done from here is WEIGHT, and each variant spends it where it
 * has the room: 'track' fills both and rings the current one; 'inline' has no
 * room for a ring between two chevrons, so a completed step takes the soft fill
 * and the current step keeps the solid one. Same idea — the step you're on is
 * the heaviest mark in the row — sized to the space available.
 *
 * States: complete (check in a brand fill), current (brand fill + accent
 * ring), upcoming (muted outline), error (danger fill + warning icon).
 *
 * Responsive: horizontal 'track' steppers switch to the vertical layout
 * automatically below the `sm` breakpoint (pure CSS). 'inline' wraps onto more
 * lines. 'compact' already fits and only drops its "Next:" hint.
 *
 * Accessibility:
 * - 'track' is an ordered list; the current step carries aria-current="step";
 *   completed and error steps get a visually-hidden state prefix.
 * - 'compact' carries its state as visible text, so it needs no ARIA of its
 *   own; the rail is decorative and hidden from screen readers.
 *
 * @example
 * <Stepper
 *   current={1}
 *   steps={[
 *     { id: 'scan', label: 'Scan', description: 'Find devices' },
 *     { id: 'review', label: 'Review' },
 *     { id: 'deploy', label: 'Deploy' },
 *   ]}
 *   onStepClick={(step) => goTo(step.id)}
 * />
 *
 * @example
 * // Sharing a page header with a title and a button — sized to its words.
 * <Stepper variant="inline" current={1} steps={[
 *   { id: 'resource', label: 'Add Your First Resource' },
 *   { id: 'network', label: 'Connect Your Network' },
 *   { id: 'client', label: 'Download the Client' },
 * ]} />
 *
 * @example
 * // In a dialog header — two steps, no room for a track.
 * <Stepper variant="compact" current={step} steps={[
 *   { id: 'details', label: 'Details' },
 *   { id: 'products', label: 'Products' },
 * ]} />
 */
export const Stepper = forwardRef(function Stepper(
  {
    steps = [],
    current = 0,
    variant = 'track',
    orientation = 'horizontal',
    onStepClick,
    className,
    ...props
  },
  ref,
) {
  const currentIndex =
    typeof current === 'number' ? current : steps.findIndex((s) => s.id === current)

  if (variant === 'compact') {
    const step = steps[currentIndex]
    const next = steps[currentIndex + 1]
    const state = step ? stepState(step, currentIndex, currentIndex) : 'current'

    return (
      <div
        ref={ref}
        className={cx('vds-stepper', 'vds-stepper--compact', `vds-stepper--compact-${state}`, className)}
        {...props}
      >
        {/* The position in words. This IS the accessible name of the progress —
            no aria needed, and it survives a screenshot, a print, and a user who
            can't tell the filled segments from the empty ones. */}
        <p className="vds-stepper__status">
          <span className="vds-stepper__count">
            Step {currentIndex + 1} of {steps.length}
          </span>
          {step?.label && <span className="vds-stepper__current">{step.label}</span>}
          {next?.label && <span className="vds-stepper__next">Next: {next.label}</span>}
        </p>
        {/* Decorative: one segment per step, filled up to where you are. It
            repeats what the line above already said, so it's hidden rather than
            read out twice. */}
        <span className="vds-stepper__rail" aria-hidden="true">
          {steps.map((s, i) => (
            <span
              key={s.id ?? i}
              className={cx('vds-stepper__seg', `vds-stepper__seg--${stepState(s, i, currentIndex)}`)}
            />
          ))}
        </span>
      </div>
    )
  }

  const inline = variant === 'inline'

  return (
    <ol
      ref={ref}
      className={cx(
        'vds-stepper',
        inline ? 'vds-stepper--inline' : `vds-stepper--${orientation}`,
        className,
      )}
      {...props}
    >
      {steps.map((step, i) => {
        const state = stepState(step, i, currentIndex)
        const clickable = !!onStepClick && (state === 'complete' || state === 'error')
        const Wrapper = clickable ? 'button' : 'div'

        const indicator = (
          <span className="vds-stepper__indicator" aria-hidden="true">
            {state === 'complete' ? (
              <Icon as={Check} size="sm" />
            ) : state === 'error' ? (
              <Icon as={TriangleAlert} size="sm" />
            ) : (
              <span className="vds-stepper__number">{i + 1}</span>
            )}
          </span>
        )

        return (
          <li
            key={step.id ?? i}
            aria-current={state === 'current' ? 'step' : undefined}
            className={cx('vds-stepper__step', `vds-stepper__step--${state}`)}
          >
            <Wrapper
              className="vds-stepper__content"
              {...(clickable
                ? { type: 'button', onClick: () => onStepClick(step, i) }
                : undefined)}
            >
              {indicator}
              <span className="vds-stepper__text">
                <span className="vds-stepper__label">
                  {STATE_LABEL[state] && (
                    <span className="vds-stepper__sr">{STATE_LABEL[state]}</span>
                  )}
                  {step.label}
                </span>
                {/* Inline is one line by definition — a description has nowhere to
                    go, so it's dropped rather than silently wrapped. */}
                {step.description && !inline && (
                  <span className="vds-stepper__description">{step.description}</span>
                )}
              </span>
            </Wrapper>
            {/* Inline's separator. A real element rather than a ::before, because
                it's an icon and pseudo-elements can't hold one — and inside the
                <li> rather than between them, so the list stays a clean sequence
                of <li>s. Decorative: the order is already in the markup.

                TRAILING each step rather than leading the next one, which is what
                makes wrapping survivable. Led, a wrapped row opens with a chevron
                pointing at nothing — it reads as a broken first item. Trailed, the
                line ends with "… ›" pointing at the row below, the way a hyphen
                ends a broken word. */}
            {inline && i < steps.length - 1 && (
              <span className="vds-stepper__sep" aria-hidden="true">
                <Icon as={ChevronRight} size="sm" />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
})

Stepper.displayName = 'Stepper'
