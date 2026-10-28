import { Check } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'

import { routes } from '@/lib/routes'

const steps = ['Handlekurv', 'Levering', 'Betaling'] as const

/** Finished steps link back, so the visitor can return to the cart from the checkout. */
const stepLinks: Partial<Record<(typeof steps)[number], string>> = { Handlekurv: routes.cart }

/** Handlekurv → Levering → Betaling, with the current step highlighted. «Fullført» marks every step done. */
export function CheckoutSteps({ current }: { current: (typeof steps)[number] | 'Fullført' }) {
  const currentIndex = current === 'Fullført' ? steps.length : steps.indexOf(current)

  return (
    <ol aria-label="Steg i kjøpet" className="flex items-center gap-2.5 text-[13px] font-semibold">
      {steps.map((step, index) => {
        const isCurrent = index === currentIndex
        const isDone = index < currentIndex
        const href = isDone && current !== 'Fullført' ? stepLinks[step] : undefined

        return (
          <Fragment key={step}>
            {index > 0 ? (
              <li aria-hidden="true" className={`h-px w-6 sm:w-8 ${index <= currentIndex ? 'bg-success' : 'bg-steel'}`} />
            ) : null}
            <li
              aria-current={isCurrent ? 'step' : undefined}
              className={`inline-flex items-center gap-2 ${isDone ? 'text-success' : isCurrent ? 'text-brand' : 'text-muted'}`}
            >
              <span
                className={`inline-flex size-[26px] items-center justify-center rounded-full text-xs ${
                  isDone ? 'bg-success text-white' : isCurrent ? 'bg-brand text-white' : 'border border-steel'
                }`}
              >
                {isDone ? <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" /> : index + 1}
              </span>
              {href ? (
                <Link href={href} className="hidden hover:underline sm:inline">
                  {step}
                </Link>
              ) : (
                <span className={isCurrent ? '' : 'hidden sm:inline'}>
                  {step}
                  {isDone ? <span className="sr-only"> (fullført)</span> : null}
                </span>
              )}
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}
