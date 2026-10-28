import type { Product, Review } from '@/payload-types'

import { BadgeCheck } from 'lucide-react'

import { formatRating, StarRating } from '@/components/shop/StarRating'
import { formatDate } from '@/lib/format'

type ProductReviewsProps = {
  rating: number
  reviewCount: number
  breakdown: Product['ratingBreakdown']
  reviews: Review[]
}

export function ProductReviews({ rating, reviewCount, breakdown, reviews }: ProductReviewsProps) {
  const bars = ([5, 4, 3, 2, 1] as const).map((stars) => ({
    stars,
    count: breakdown?.[`stars${stars}`] ?? 0,
  }))
  const hasBreakdown = bars.some((bar) => bar.count > 0)

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="flex-[1_1_300px] rounded-xl bg-white p-7">
        <p className="flex items-baseline gap-2">
          <span className="text-[56px] leading-none font-extrabold tracking-[-1.5px]">{formatRating(rating)}</span>
          <span className="text-sm text-muted">av 5</span>
        </p>
        <p className="mt-2.5 flex items-center gap-2 text-[13px] text-muted">
          <StarRating rating={rating} />
          Basert på {reviewCount} vurderinger
        </p>
        {hasBreakdown ? (
          <ul aria-label="Fordeling av vurderinger" className="mt-5 flex flex-col gap-[9px]">
            {bars.map((bar) => (
              <li key={bar.stars} className="flex items-center gap-2.5 text-xs">
                <span className="w-11">{bar.stars} ★</span>
                <span aria-hidden="true" className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e7ebf1]">
                  <span
                    className="block h-full rounded-full bg-brand"
                    style={{ width: `${reviewCount ? (bar.count / reviewCount) * 100 : 0}%` }}
                  />
                </span>
                <span className="w-7 text-right text-muted">
                  {bar.count}
                  <span className="sr-only"> vurderinger med {bar.stars} stjerner</span>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <ul className="flex min-w-0 flex-[999_1_560px] flex-col gap-3">
        {reviews.length ? (
          reviews.map((review) => (
            <li key={review.id}>
              <article className="rounded-xl bg-white px-7 py-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2.5 text-[13px]">
                    <StarRating rating={review.rating} />
                    <span className="font-semibold">{review.authorName}</span>
                    {review.place ? <span className="text-muted">{review.place}</span> : null}
                  </p>
                  {review.publishedAt ? (
                    <p className="text-xs text-muted">
                      <time dateTime={review.publishedAt}>{formatDate(review.publishedAt)}</time>
                    </p>
                  ) : null}
                </div>
                <h3 className="mt-3 mb-1.5 text-base font-semibold">{review.title}</h3>
                <p className="text-sm leading-[1.6] text-subtle">{review.body}</p>
                <p className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                  {review.verifiedPurchase ? (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-success">
                      <BadgeCheck className="size-3.5" strokeWidth={2} aria-hidden="true" />
                      Verifisert kjøp
                    </span>
                  ) : null}
                  {review.helpfulCount ? <span>{review.helpfulCount} syntes dette var nyttig</span> : null}
                </p>
              </article>
            </li>
          ))
        ) : (
          <li className="rounded-xl bg-white px-7 py-6 text-sm text-muted">Ingen skriftlige vurderinger ennå.</li>
        )}
      </ul>
    </div>
  )
}
