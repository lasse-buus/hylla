import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Values the browser holds for us (in cookies) but must not be able to change: `value.signature`.
 * The purpose is part of the signature, so a value signed for one cookie can't be replayed in another.
 */
const signatureFor = (purpose: string, value: string) => {
  // Signing with an empty key would let anyone forge these values.
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is not set, so cookies cannot be signed.')
  return createHmac('sha256', secret).update(`${purpose}:${value}`).digest('base64url')
}

export const signValue = (purpose: string, value: string): string => `${value}.${signatureFor(purpose, value)}`

/** The signed value, or null when it is missing, malformed or has been tampered with. */
export function readSignedValue(purpose: string, signed: string | undefined): string | null {
  const dot = signed?.lastIndexOf('.') ?? -1
  if (!signed || dot <= 0) return null

  const value = signed.slice(0, dot)
  const expected = Buffer.from(signatureFor(purpose, value))
  const actual = Buffer.from(signed.slice(dot + 1))
  return expected.length === actual.length && timingSafeEqual(expected, actual) ? value : null
}
