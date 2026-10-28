'use client'

import type { ShopAddress } from '@/lib/shopSession'

import { Plus } from 'lucide-react'
import { useId, useState } from 'react'

import { useAccountDraft } from './AccountDraft'
import { fieldErrorClass, inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from './formStyles'

type AddressFields = Pick<ShopAddress, 'label' | 'addressLine' | 'postalCode' | 'city'>
type Errors = Partial<Record<keyof AddressFields, string>>

const empty: AddressFields = { label: '', addressLine: '', postalCode: '', city: '' }

function validate(fields: AddressFields): Errors {
  const errors: Errors = {}
  if (!fields.label.trim()) errors.label = 'Gi adressen et navn.'
  if (!fields.addressLine.trim()) errors.addressLine = 'Skriv inn gateadressen.'
  if (!/^\d{4}$/.test(fields.postalCode.trim())) errors.postalCode = 'Postnummeret har fire siffer.'
  if (!fields.city.trim()) errors.city = 'Skriv inn poststedet.'
  return errors
}

/** Saved addresses: edit, add, set default and delete, for this visit only. */
export function AddressBook() {
  const { draft, update } = useAccountDraft()
  // null: no form open; 'new': adding; otherwise the ID of the address being edited.
  const [editing, setEditing] = useState<string | null>(null)
  const fullName = `${draft.firstName} ${draft.lastName}`

  const setAddresses = (change: (addresses: ShopAddress[]) => ShopAddress[]) =>
    update((current) => ({ ...current, addresses: change(current.addresses) }))

  const save = (fields: AddressFields) => {
    const clean = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value.trim()])) as AddressFields
    if (editing === 'new') {
      setAddresses((addresses) => [
        ...addresses,
        { ...clean, id: `ny-${Date.now()}`, isDefault: addresses.length === 0 },
      ])
    } else {
      setAddresses((addresses) => addresses.map((address) => (address.id === editing ? { ...address, ...clean } : address)))
    }
    setEditing(null)
  }

  const makeDefault = (id: string) =>
    setAddresses((addresses) => addresses.map((address) => ({ ...address, isDefault: address.id === id })))
  const remove = (id: string) => setAddresses((addresses) => addresses.filter((address) => address.id !== id))

  const editingAddress = draft.addresses.find((address) => address.id === editing)

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {draft.addresses.map((address) => (
          <article
            key={address.id}
            className={`flex flex-col gap-2.5 rounded-xl border-2 bg-white p-[22px] ${address.isDefault ? 'border-brand' : 'border-white'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold">{address.label}</h2>
              {address.isDefault ? (
                <span className="rounded-full bg-brand-soft px-2.5 py-[3px] text-[11px] font-bold text-brand">STANDARD</span>
              ) : null}
            </div>
            <p className="text-sm leading-[1.55] text-subtle">
              {fullName}
              <br />
              {address.addressLine}
              <br />
              {address.postalCode} {address.city}
            </p>
            <p className="text-xs text-muted">
              {address.isDefault ? 'Brukes som leverings- og fakturaadresse' : 'Kan velges i kassen'}
            </p>
            <div className="mt-auto flex flex-wrap gap-4 pt-2 text-[13px] font-semibold">
              <button type="button" onClick={() => setEditing(address.id)} className="py-1 text-brand hover:underline">
                Endre<span className="sr-only"> {address.label}</span>
              </button>
              {address.isDefault ? null : (
                <>
                  <button type="button" onClick={() => makeDefault(address.id)} className="py-1 text-brand hover:underline">
                    Gjør til standard<span className="sr-only">: {address.label}</span>
                  </button>
                  <button type="button" onClick={() => remove(address.id)} className="py-1 text-danger hover:underline">
                    Slett<span className="sr-only"> {address.label}</span>
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
        {editing === null ? (
          <button
            type="button"
            onClick={() => setEditing('new')}
            className="flex min-h-[190px] flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-steel text-sm font-semibold text-brand hover:border-brand hover:bg-white/60"
          >
            <Plus className="size-6" strokeWidth={1.8} aria-hidden="true" />
            Legg til ny adresse
          </button>
        ) : null}
      </div>

      {editing !== null ? (
        <AddressForm
          key={editing}
          title={editingAddress ? `Endre ${editingAddress.label}` : 'Ny adresse'}
          initial={editingAddress ?? empty}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      ) : null}
    </>
  )
}

type AddressFormProps = {
  title: string
  initial: AddressFields
  onSave: (fields: AddressFields) => void
  onCancel: () => void
}

function AddressForm({ title, initial, onSave, onCancel }: AddressFormProps) {
  const id = useId()
  const [fields, setFields] = useState<AddressFields>(initial)
  const [errors, setErrors] = useState<Errors>({})

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const found = validate(fields)
    setErrors(found)
    if (!Object.keys(found).length) onSave(fields)
  }

  const field = (name: keyof AddressFields, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className={labelClass}>
      {label}
      <input
        {...props}
        value={fields[name]}
        onChange={(event) => setFields((current) => ({ ...current, [name]: event.target.value }))}
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
  )

  return (
    <form onSubmit={submit} noValidate aria-labelledby={`${id}-title`} className="flex flex-col gap-4 rounded-xl bg-white p-6">
      <h2 id={`${id}-title`} className="text-lg font-bold">
        {title}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {field('label', 'Navn på adressen', { placeholder: 'F.eks. Jobb' })}
        {field('addressLine', 'Gateadresse', { autoComplete: 'street-address' })}
      </div>
      <div className="grid grid-cols-[minmax(120px,1fr)_minmax(0,2fr)] gap-4">
        {field('postalCode', 'Postnummer', { inputMode: 'numeric', autoComplete: 'postal-code', maxLength: 4 })}
        {field('city', 'Poststed', { autoComplete: 'address-level2' })}
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button type="submit" className={primaryButtonClass}>
          Lagre adresse
        </button>
        <button type="button" onClick={onCancel} className={secondaryButtonClass}>
          Avbryt
        </button>
      </div>
    </form>
  )
}
