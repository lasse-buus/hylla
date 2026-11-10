import type { Illustration } from '@/lib/lighting'

import { useId } from 'react'

type BulbIllustrationProps = {
  illustration: Illustration
  /** Globe only: opal glass rather than clear glass with a visible filament. */
  opal?: boolean
  lit: boolean
  label: string
}

const BODY = '#fbfbfa'
const BODY_EDGE = '#d3d7de'

/**
 * Hylla's own drawings of the lighting products (no product photos or logos are used).
 * A lit bulb takes its colours from `--bulb` and `--bulb2`, set by the tile around it.
 */
export function BulbIllustration({ illustration, opal = false, lit, label }: BulbIllustrationProps) {
  const gradientID = useId()
  const clearGlass = illustration === 'globe' && !opal

  const unlitGlass = illustration === 'bridge' ? '#c9ced6' : clearGlass ? 'rgb(255 255 255 / 0.55)' : '#fafaf8'
  const litGlass = clearGlass ? 'color-mix(in srgb, var(--bulb) 55%, transparent)' : 'var(--bulb)'
  const glass = { fill: lit ? litGlass : unlitGlass }
  const edge = { stroke: lit ? 'color-mix(in srgb, var(--bulb) 90%, transparent)' : BODY_EDGE, strokeWidth: 2 }
  const shine = { fill: '#ffffff', opacity: lit ? 0.25 : 0.7 }
  const led = lit ? 'var(--bulb)' : unlitGlass

  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} className="absolute inset-0 size-full">
      {illustration === 'a60' ? (
        <>
          <path d="M100 34C136 34 156 60 156 90C156 114 138 128 128 146H72C62 128 44 114 44 90C44 60 64 34 100 34Z" style={{ ...glass, ...edge }} />
          <ellipse cx="80" cy="72" rx="12" ry="20" style={shine} />
          <rect x="72" y="146" width="56" height="14" rx="3" fill={BODY} stroke={BODY_EDGE} strokeWidth="2" />
          <rect x="78" y="160" width="44" height="22" rx="4" fill="#c4c9d1" />
          <path d="M78 167H122M78 175H122" stroke="#a3a9b3" strokeWidth="2" />
          <path d="M92 182H108L104 190H96Z" fill="#7d838d" />
        </>
      ) : null}

      {illustration === 'globe' ? (
        <>
          <circle cx="100" cy="86" r="58" style={{ ...glass, ...edge }} />
          {clearGlass ? (
            <path
              d="M86 140V104C86 92 80 84 76 76M114 140V104C114 92 120 84 124 76M76 76C88 64 112 64 124 76M80 80C92 92 108 92 120 80"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ stroke: lit ? '#fff1d6' : '#b49a6c' }}
            />
          ) : null}
          <rect x="78" y="142" width="44" height="14" rx="3" fill="#c9a76a" />
          <rect x="80" y="156" width="40" height="22" rx="4" fill="#b8a07a" />
          <path d="M80 163H120M80 171H120" stroke="#9a8460" strokeWidth="2" />
          <path d="M92 178H108L104 186H96Z" fill="#7d6a4c" />
        </>
      ) : null}

      {illustration === 'gu10' ? (
        <>
          <path d="M52 66H148L130 146H70Z" fill={BODY} stroke={BODY_EDGE} strokeWidth="2" />
          <ellipse cx="100" cy="66" rx="48" ry="14" style={{ ...glass, ...edge }} />
          <ellipse cx="100" cy="66" rx="30" ry="8" style={shine} />
          <rect x="70" y="146" width="60" height="10" rx="3" fill="#e3e6ea" />
          <rect x="82" y="156" width="8" height="18" rx="3" fill="#a3a9b3" />
          <rect x="110" y="156" width="8" height="18" rx="3" fill="#a3a9b3" />
        </>
      ) : null}

      {illustration === 'strip' ? (
        <>
          <defs>
            {/* userSpaceOnUse: the path's own box would squash the gradient. */}
            <linearGradient id={gradientID} gradientUnits="userSpaceOnUse" x1="26" y1="0" x2="176" y2="0">
              <stop offset="0" style={{ stopColor: 'var(--bulb)' }} />
              <stop offset="1" style={{ stopColor: 'var(--bulb2)' }} />
            </linearGradient>
          </defs>
          <path d="M26 132C52 88 76 152 102 108S150 66 176 96" fill="none" stroke="#e8eaee" strokeWidth="20" strokeLinecap="round" />
          <path
            d="M26 132C52 88 76 152 102 108S150 66 176 96"
            fill="none"
            stroke={`url(#${gradientID})`}
            strokeWidth="12"
            strokeLinecap="round"
            style={{ opacity: lit ? 1 : 0 }}
          />
          <path
            d="M26 132C52 88 76 152 102 108S150 66 176 96"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1 9"
            style={{ stroke: lit ? 'rgb(255 255 255 / 0.7)' : '#c3c8d0' }}
          />
          <rect x="150" y="118" width="34" height="20" rx="5" fill={BODY} stroke={BODY_EDGE} strokeWidth="2" />
        </>
      ) : null}

      {illustration === 'go' ? (
        <>
          <path d="M42 138A58 58 0 0 1 158 138Z" style={{ ...glass, ...edge }} />
          <path d="M62 112C68 96 80 88 92 86" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" style={{ opacity: shine.opacity }} />
          <ellipse cx="100" cy="142" rx="60" ry="12" fill={BODY} stroke={BODY_EDGE} strokeWidth="2" />
          <rect x="40" y="140" width="120" height="16" fill={BODY} />
          <ellipse cx="100" cy="156" rx="60" ry="10" fill="#e3e6ea" />
        </>
      ) : null}

      {illustration === 'iris' ? (
        <>
          <circle cx="100" cy="92" r="62" fill="#eef0f3" stroke={BODY_EDGE} strokeWidth="2" />
          <circle cx="100" cy="92" r="52" style={glass} />
          <rect x="74" y="150" width="52" height="12" rx="6" fill={BODY_EDGE} />
          <path d="M86 150L92 140H108L114 150Z" fill={BODY_EDGE} />
        </>
      ) : null}

      {illustration === 'candle' ? (
        <>
          <path d="M100 36C118 64 128 96 122 132H78C72 96 82 64 100 36Z" style={{ ...glass, ...edge }} />
          <ellipse cx="92" cy="86" rx="6" ry="16" style={shine} />
          <rect x="80" y="132" width="40" height="12" rx="3" fill={BODY} stroke={BODY_EDGE} strokeWidth="2" />
          <rect x="84" y="144" width="32" height="22" rx="4" fill="#c4c9d1" />
          <path d="M84 151H116M84 159H116" stroke="#a3a9b3" strokeWidth="2" />
        </>
      ) : null}

      {illustration === 'bridge' ? (
        <>
          <rect x="44" y="48" width="112" height="112" rx="26" fill={BODY} stroke={BODY_EDGE} strokeWidth="2" />
          <circle cx="100" cy="104" r="18" fill="none" strokeWidth="5" style={{ stroke: led }} />
          <circle cx="100" cy="104" r="4" style={{ fill: led }} />
        </>
      ) : null}
    </svg>
  )
}
