'use client'

import { Button, useDocumentInfo, useField, useForm } from '@payloadcms/ui'
import { useEffect, useRef, useState } from 'react'

import { statusLabel } from '@/collections/orders/constants'

const fakeTrackingNumber = () => `70${Math.floor(1e13 + Math.random() * 9e13)}`

/**
 * WooCommerce-style quick actions in the order sidebar. Each action sets the
 * relevant fields and saves the order, so the hooks log notes and adjust stock.
 */
export const OrderActions = () => {
  const { id } = useDocumentInfo()
  const { submit } = useForm()
  const status = useField<string>({ path: 'status' })
  const tracking = useField<string>({ path: 'shipping.trackingNumber' })
  const [saveRequest, setSaveRequest] = useState(0)
  const handledSaveRequest = useRef(0)
  const [isEnteringTracking, setIsEnteringTracking] = useState(false)
  const [trackingDraft, setTrackingDraft] = useState('')

  // Save on the render after the field values change, so the submitted form includes them.
  useEffect(() => {
    if (saveRequest === handledSaveRequest.current) return
    handledSaveRequest.current = saveRequest
    void submit()
  }, [saveRequest, submit])

  if (!id) {
    return (
      <p style={{ color: 'var(--theme-elevation-500)', fontSize: 13, margin: '0 0 24px' }}>
        Lagre ordren for å få tilgang til handlinger.
      </p>
    )
  }

  const current = status.value ?? 'received'

  const changeStatus = (next: string, confirmMessage?: string) => {
    if (confirmMessage && !window.confirm(confirmMessage)) return
    status.setValue(next)
    setSaveRequest((count) => count + 1)
  }

  const confirmShipped = () => {
    tracking.setValue(trackingDraft.trim() || fakeTrackingNumber())
    setIsEnteringTracking(false)
    changeStatus('shipped')
  }

  const isOpen = ['received', 'processing', 'on-hold'].includes(current)

  return (
    <div style={{ borderBottom: '1px solid var(--theme-elevation-150)', marginBottom: 24, paddingBottom: 20 }}>
      <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 10px' }}>
        Handlinger · nå: {statusLabel(current)}
      </p>

      {isEnteringTracking ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label htmlFor="tracking-draft" style={{ fontSize: 12 }}>
            Sporingsnummer (tomt = generer et fiktivt)
          </label>
          <input
            id="tracking-draft"
            onChange={(event) => setTrackingDraft(event.target.value)}
            style={{ padding: '8px 10px' }}
            type="text"
            value={trackingDraft}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button buttonStyle="primary" margin={false} onClick={confirmShipped} size="small">
              Bekreft sending
            </Button>
            <Button buttonStyle="secondary" margin={false} onClick={() => setIsEnteringTracking(false)} size="small">
              Avbryt
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {current === 'received' && (
            <Button buttonStyle="secondary" margin={false} onClick={() => changeStatus('processing')} size="small">
              Start behandling
            </Button>
          )}
          {isOpen && (
            <Button buttonStyle="primary" margin={false} onClick={() => setIsEnteringTracking(true)} size="small">
              Marker som sendt
            </Button>
          )}
          {current === 'shipped' && (
            <Button buttonStyle="primary" margin={false} onClick={() => changeStatus('delivered')} size="small">
              Marker som levert
            </Button>
          )}
          {isOpen && current !== 'on-hold' && (
            <Button buttonStyle="secondary" margin={false} onClick={() => changeStatus('on-hold')} size="small">
              Sett på vent
            </Button>
          )}
          {isOpen && (
            <Button
              buttonStyle="error"
              margin={false}
              onClick={() =>
                changeStatus('cancelled', 'Kansellere ordren? Varene legges tilbake på lager.')
              }
              size="small"
            >
              Kanseller ordre
            </Button>
          )}
          {['shipped', 'delivered', 'cancelled'].includes(current) && (
            <Button
              buttonStyle="secondary"
              margin={false}
              onClick={() => changeStatus('refunded', 'Refundere hele ordren til kunden?')}
              size="small"
            >
              Refunder
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
