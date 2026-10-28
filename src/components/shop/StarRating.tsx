import { Star } from 'lucide-react'

const stars = (className: string) =>
  Array.from({ length: 5 }, (_, index) => (
    <Star key={index} className={`size-3 shrink-0 ${className}`} fill="currentColor" strokeWidth={0} aria-hidden="true" />
  ))

export const formatRating = (rating: number) =>
  rating.toLocaleString('nb-NO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Five stars filled to the rating, e.g. 4.8 fills 96 %. */
export function StarRating({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`${formatRating(rating)} av 5 stjerner`} className="relative inline-flex">
      <span className="flex gap-px">{stars('text-line')}</span>
      <span className="absolute inset-y-0 left-0 flex gap-px overflow-hidden" style={{ width: `${(rating / 5) * 100}%` }}>
        {stars('text-ink')}
      </span>
    </span>
  )
}
