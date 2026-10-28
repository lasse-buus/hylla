'use client'

import { AlertCircle, ArrowRight } from 'lucide-react'
import { useActionState } from 'react'

import { inputClass, labelClass } from '@/components/account/formStyles'

import { logIn } from './actions'

type LoginFormProps = { email: string; password: string; returnTo: string }

export function LoginForm({ email, password, returnTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(logIn, { error: null })

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="neste" value={returnTo} />
      <label className={labelClass}>
        E-post
        <input type="email" name="email" autoComplete="username" defaultValue={email} required className={inputClass} />
      </label>
      <label className={labelClass}>
        Passord
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          defaultValue={password}
          required
          className={inputClass}
        />
      </label>

      {state.error ? (
        <p role="alert" className="flex items-center gap-2 text-[13px] font-semibold text-danger">
          <AlertCircle className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-1 flex h-[52px] items-center justify-center gap-2.5 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-brand-hover disabled:opacity-70"
      >
        {isPending ? 'Logger inn …' : 'Logg inn som demokunde'}
        {isPending ? null : <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />}
      </button>
    </form>
  )
}
