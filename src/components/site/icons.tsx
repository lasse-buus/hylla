import type { LucideIcon } from 'lucide-react'

import {
  Armchair,
  Battery,
  Cable,
  Coffee,
  Cpu,
  Gamepad2,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  Shield,
  Smartphone,
  Tv,
  WashingMachine,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react'

/** Maps the `icon` select values on Categories to lucide icons. */
export const categoryIcons: Record<string, LucideIcon> = {
  armchair: Armchair,
  cable: Cable,
  coffee: Coffee,
  cpu: Cpu,
  gamepad: Gamepad2,
  headphones: Headphones,
  keyboard: Keyboard,
  laptop: Laptop,
  monitor: Monitor,
  mouse: Mouse,
  smartphone: Smartphone,
  tv: Tv,
  'washing-machine': WashingMachine,
}

/** Maps the `icon` select values on a product's features to lucide icons. */
export const featureIcons: Record<string, LucideIcon> = {
  battery: Battery,
  headphones: Headphones,
  monitor: Monitor,
  shield: Shield,
  wind: Wind,
  wrench: Wrench,
  zap: Zap,
}

type BrandIconProps = { className?: string }

// lucide-react 1.x no longer ships brand icons, so the social icons are inline.
export const InstagramIcon = ({ className }: BrandIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <path d="M17.5 6.5h.01" />
  </svg>
)

export const FacebookIcon = ({ className }: BrandIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

export const YoutubeIcon = ({ className }: BrandIconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
)
