'use client'

import { CircleCheck } from 'lucide-react'
import { useId, useState } from 'react'

import { type AccountDraft, useAccountDraft } from './AccountDraft'
import { fieldErrorClass, inputClass, labelClass, primaryButtonClass } from './formStyles'

type ProfileFields = Pick<AccountDraft, 'firstName' | 'lastName' | 'email' | 'phone'>
type Errors = Partial<Record<keyof ProfileFields, string>>

const fieldDefs: { name: keyof ProfileFields; label: string; type: string; autoComplete: string }[] = [
  { name: 'firstName', label: 'Fornavn', type: 'text', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Etternavn', type: 'text', autoComplete: 'family-name' },
  { name: 'email', label: 'E-post', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Mobilnummer', type: 'tel', autoComplete: 'tel-national' },
]

function validate(fields: ProfileFields): Errors {
  const errors: Errors = {}
  if (!fields.firstName.trim()) errors.firstName = 'Skriv inn fornavnet.'
  if (!fields.lastName.trim()) errors.lastName = 'Skriv inn etternavnet.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = 'Skriv inn en gyldig e-postadresse.'
  if (!/^\d{8}$/.test(fields.phone.replace(/\s/g, ''))) errors.phone = 'Mobilnummeret har åtte siffer.'
  return errors
}

/** Personal details, saved to this visit's draft. */
export function ProfileForm() {
  const id = useId()
  const { draft, update } = useAccountDraft()
  const [fields, setFields] = useState<ProfileFields>(() => ({
    firstName: draft.firstName,
    lastName: draft.lastName,
    email: draft.email,
    phone: draft.phone,
  }))
  const [errors, setErrors] = useState<Errors>({})
  const [saved, setSaved] = useState(false)

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const found = validate(fields)
    setErrors(found)
    if (Object.keys(found).length) return
    update((current) => ({
      ...current,
      firstName: fields.firstName.trim(),
      lastName: fields.lastName.trim(),
      email: fields.email.trim(),
      phone: fields.phone.replace(/\s/g, ''),
    }))
    setSaved(true)
  }

  return (
    <form onSubmit={submit} noValidate aria-labelledby={`${id}-title`} className="flex flex-col gap-4 rounded-xl bg-white p-6">
      <h2 id={`${id}-title`} className="text-lg font-bold">
        Personopplysninger
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        {fieldDefs.map(({ name, label, type, autoComplete }) => (
          <label key={name} className={labelClass}>
            {label}
            <input
              type={type}
              autoComplete={autoComplete}
              value={fields[name]}
              onChange={(event) => {
                setFields((current) => ({ ...current, [name]: event.target.value }))
                setSaved(false)
              }}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={errors[name] ? `${id}-${name}` : undefined}
              className={inputClass}
            />
            {errors[name] ? (
              <span id={`${id}-${name}`} className={fieldErrorClass}>
                {errors[name]}
              </span>
            ) : null}
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3.5">
        <button type="submit" className={primaryButtonClass}>
          Lagre endringer
        </button>
        <p role="status" className="inline-flex items-center gap-2 text-sm font-semibold text-success">
          {saved ? (
            <>
              <CircleCheck className="size-[18px]" strokeWidth={2} aria-hidden="true" />
              Endringene er lagret
            </>
          ) : null}
        </p>
      </div>
    </form>
  )
}
