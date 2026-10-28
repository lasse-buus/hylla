import type { Endpoint } from 'payload'

import { userIsAdmin } from '@/access'
import { resetDemo } from '@/seed/resetDemo'

/**
 * GET /api/demo/reset
 * Called nightly by Vercel Cron (Authorization: Bearer $CRON_SECRET) or manually by an admin.
 */
export const demoResetEndpoint: Endpoint = {
  path: '/demo/reset',
  method: 'get',
  handler: async (req) => {
    const secret = process.env.CRON_SECRET
    const authHeader = req.headers.get('authorization')
    const isCron = Boolean(secret) && authHeader === `Bearer ${secret}`

    if (!isCron && !userIsAdmin(req.user)) {
      return Response.json({ error: 'Ikke tilgang' }, { status: 401 })
    }

    try {
      const summary = await resetDemo(req.payload)
      return Response.json({ ok: true, ...summary })
    } catch (error) {
      // Only the cron job or an admin gets here, so the real cause is safe to show (and it is logged for Vercel).
      req.payload.logger.error({ err: error }, '[demo-reset] Feilet')
      const message = error instanceof Error ? error.message : String(error)
      return Response.json({ ok: false, error: message }, { status: 500 })
    }
  },
}
