import type { HomePage } from '@/payload-types'

import config from '@payload-config'
import { getPayload } from 'payload'

export type HomeBlock = NonNullable<HomePage['layout']>[number]

/** The front page's sections, in the order the editor arranged them. */
export async function getHomePage(): Promise<HomeBlock[]> {
  const payload = await getPayload({ config })
  const home = await payload.findGlobal({ slug: 'home-page', depth: 1 })
  return home.layout ?? []
}
