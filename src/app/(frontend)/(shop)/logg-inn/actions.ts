'use server'

import { redirect } from 'next/navigation'

import { routes } from '@/lib/routes'
import { endShopSession, safeReturnPath, startShopSession, verifyShopLogin } from '@/lib/shopSession'

export type LogInState = { error: string | null }

/** Checks the credentials, then starts the shop's own session (never Payload's admin cookie). */
export async function logIn(_state: LogInState, formData: FormData): Promise<LogInState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const failure = { error: 'Feil e-post eller passord.' }
  if (!email || !password) return failure

  // Admin accounts belong in /admin; the shop only lets customers in.
  const customer = await verifyShopLogin(email, password)
  if (!customer) return failure

  await startShopSession(customer.id)
  redirect(safeReturnPath(formData.get('neste')?.toString()))
}

export async function logOut() {
  await endShopSession()
  redirect(routes.login)
}
