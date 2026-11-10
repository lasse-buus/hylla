/**
 * Smart lighting ("Lys og pærer"): what each kind of bulb can show in each scene.
 * Pure data and functions, shared by the Payload config, the filters and the light preview.
 */

export const capabilityOptions = [
  { value: 'white', label: 'Hvit (kun varmhvit)' },
  { value: 'ambiance', label: 'White Ambiance (varm til kald hvit)' },
  { value: 'color', label: 'White and Color Ambiance' },
  { value: 'filament', label: 'Filament (ekstra varm hvit)' },
  { value: 'bridge', label: 'Bridge (ingen lyskilde)' },
] as const

export const illustrationOptions = [
  { value: 'a60', label: 'Standardpære (A60)' },
  { value: 'globe', label: 'Globe (G93)' },
  { value: 'gu10', label: 'Spot (GU10)' },
  { value: 'strip', label: 'Lysstripe' },
  { value: 'go', label: 'Bærbar lampe (Go)' },
  { value: 'iris', label: 'Bordlampe (Iris)' },
  { value: 'candle', label: 'Kronepære' },
  { value: 'bridge', label: 'Bridge' },
] as const

export const socketOptions = [
  { value: 'E27', label: 'E27' },
  { value: 'E14', label: 'E14' },
  { value: 'GU10', label: 'GU10' },
] as const

export const worksWithOptions = [
  { value: 'bridge', label: 'Hue Bridge' },
  { value: 'bluetooth', label: 'Bluetooth' },
  { value: 'matter', label: 'Matter' },
  { value: 'apple-home', label: 'Apple Home' },
] as const

export type Capability = (typeof capabilityOptions)[number]['value']
export type Illustration = (typeof illustrationOptions)[number]['value']

/** The "Lysfarge" filter. Filament bulbs count as white; a Bridge has no light colour. */
export const lightColorOptions = [
  { value: 'white', label: 'Hvit' },
  { value: 'ambiance', label: 'White Ambiance' },
  { value: 'color', label: 'White and Color' },
] as const

export const lightColorOf = (capability: Capability): string | null =>
  capability === 'bridge' ? null : capability === 'filament' ? 'white' : capability

/** The type chips above the product grid, derived from the product's shape. */
export const lightTypeOptions = [
  { value: 'paerer', label: 'Smarte pærer' },
  { value: 'spotter', label: 'Spotter' },
  { value: 'lysstriper', label: 'Lysstriper' },
  { value: 'bordlamper', label: 'Bordlamper' },
  { value: 'bridge', label: 'Bridge og brytere' },
] as const

const lightTypes: Record<Illustration, (typeof lightTypeOptions)[number]['value']> = {
  a60: 'paerer',
  globe: 'paerer',
  candle: 'paerer',
  gu10: 'spotter',
  strip: 'lysstriper',
  go: 'bordlamper',
  iris: 'bordlamper',
  bridge: 'bridge',
}

export const lightTypeOf = (illustration: Illustration): string => lightTypes[illustration]

/** `second` is the scene's other colour, used for gradients. White scenes are the ones every Ambiance bulb can show. */
export const scenes = [
  { id: 'varm', label: 'Varm hvit', color: '#ffc477', second: '#ffad5c', white: true },
  { id: 'dag', label: 'Dagslys', color: '#e9f0ff', second: '#cddcff', white: true },
  { id: 'solnedgang', label: 'Solnedgang', color: '#ff7a3d', second: '#ff3d7a', white: false },
  { id: 'nordlys', label: 'Nordlys', color: '#36e0a2', second: '#3d8bff', white: false },
  { id: 'lilla', label: 'Kveldslilla', color: '#9a6bff', second: '#ff5fd0', white: false },
] as const

export type Scene = (typeof scenes)[number]
export type SceneID = Scene['id']

export const defaultScene: Scene = scenes[0]
export const sceneByID = (id: unknown): Scene => scenes.find((scene) => scene.id === id) ?? defaultScene

export type BulbLight = {
  color: string
  color2: string
  /** Why the bulb doesn't show the chosen scene, when it can't. */
  note: string | null
}

const FILAMENT = { color: '#ffb257', color2: '#ff9a3d' }
const BRIDGE_LED = { color: '#4aa3ff', color2: '#4aa3ff' }

/** The light a bulb actually gives in a scene. The notes teach the difference between the bulb types. */
export function lightFor(capability: Capability, sceneID: SceneID): BulbLight {
  const scene = sceneByID(sceneID)
  const sceneLight = { color: scene.color, color2: scene.second }
  const warm = { color: defaultScene.color, color2: defaultScene.second }
  const isWarm = scene.id === defaultScene.id

  switch (capability) {
    case 'color':
      return { ...sceneLight, note: null }
    case 'ambiance':
      return scene.white
        ? { ...sceneLight, note: null }
        : { ...warm, note: 'White Ambiance viser bare hvitt lys. Her: varm hvit.' }
    case 'filament':
      return { ...FILAMENT, note: isWarm ? null : 'Filamentpæren lyser alltid ekstra varmt.' }
    case 'bridge':
      return { ...BRIDGE_LED, note: null }
    case 'white':
      return { ...warm, note: isWarm ? null : 'Hue White lyser bare varmhvitt.' }
  }
}
