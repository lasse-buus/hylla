import type { ProgressStep } from '@/lib/account'

const stateText = { done: ' (fullført)', current: ' (nå)', todo: ' (ikke ennå)' }

/** Mottatt → Behandles → Sendt → Levert as four bars. */
export function OrderProgress({ steps, label, showDates = false }: { steps: ProgressStep[]; label: string; showDates?: boolean }) {
  return (
    <ol aria-label={label} className="grid grid-cols-4 gap-2">
      {steps.map((step) => (
        <li key={step.label} className="flex flex-col gap-2">
          <span aria-hidden="true" className={`h-1.5 rounded-full ${step.state === 'todo' ? 'bg-line' : 'bg-brand'}`} />
          <span
            className={`text-xs sm:text-[13px] ${step.state === 'current' ? 'font-bold' : 'font-medium'} ${
              step.state === 'todo' ? 'text-muted' : 'text-ink'
            }`}
          >
            {step.label}
            <span className="sr-only">{stateText[step.state]}</span>
          </span>
          {showDates && step.when ? <span className="text-xs text-muted">{step.when}</span> : null}
        </li>
      ))}
    </ol>
  )
}
