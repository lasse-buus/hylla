import { getPayload } from 'payload'

import config from '../payload.config'
import { resetDemo } from './resetDemo'

const payload = await getPayload({ config })
const summary = await resetDemo(payload)

payload.logger.info(`[demo-reset] Ferdig: ${JSON.stringify(summary)}`)
process.exit(0)
