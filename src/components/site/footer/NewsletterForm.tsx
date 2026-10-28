'use client'

import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'

/**
 * Newsletter sign-up. Hylla is a demo shop that stores no personal data,
 * so the address is never sent anywhere – the form only confirms in place.
 */
export function NewsletterForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (isSubmitted) {
    return (
      <p role="status" className="flex max-w-[514px] items-start gap-3 rounded-md bg-white/10 px-4 py-3 text-sm">
        <Check className="mt-0.5 size-5 shrink-0" strokeWidth={2} aria-hidden="true" />
        <span>
          <strong className="font-semibold">Takk for påmeldingen!</strong> Hylla er en demobutikk, så vi har ikke
          lagret e-postadressen din.
        </span>
      </p>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setIsSubmitted(true)
      }}
      className="flex w-full max-w-[514px] flex-col gap-2.5"
    >
      <div className="flex flex-wrap gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          E-postadresse
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder="Din e-postadresse"
          className="h-[46px] min-w-0 flex-[1_1_240px] rounded-md bg-white px-4 text-sm text-ink placeholder:text-muted"
        />
        <button
          type="submit"
          className="inline-flex h-[46px] items-center gap-3 rounded-md bg-navy px-[22px] text-sm font-semibold text-white hover:bg-ink"
        >
          Meld meg på
          <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
      <p className="text-[11px] text-brand-soft">
        Ved å melde deg på godtar du personvernvilkårene våre. Du kan melde deg av når du vil.
      </p>
    </form>
  )
}
