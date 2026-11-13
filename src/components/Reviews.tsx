import type { CSSProperties } from 'react'
import { Sig705ChatReviews } from './signature/SIG-705/SIG-705'
import { reviews, reviewsCopy, guests } from '../data/site'

/**
 * Đánh giá — SIG-705 (project variant with `aside`): real guest check-in photos on the left,
 * real Google reviews (verbatim) appearing like a message thread on the right.
 */
export function Reviews() {
  const style = {
    '--sig-fg': 'var(--color-ink)',
    '--sig-accent': 'var(--color-clay-deep)',
    '--sig705-bubble': 'var(--color-cream)',
    '--sig705-bubble-fg': 'var(--color-ink)',
    '--sig705-bubble-alt': 'var(--color-clay-deep)',
    '--sig705-bubble-alt-fg': 'var(--color-night)',
  } as CSSProperties
  return (
    <div style={style}>
      <Sig705ChatReviews
        id="danh-gia"
        intensity={2}
        title={reviewsCopy.title}
        intro={reviewsCopy.intro}
        sourceLabel={reviewsCopy.source}
        aside={
          <figure className="m-0 h-full">
            <div className="grid grid-cols-2 grid-rows-[1.1fr_1fr] gap-3 lg:h-[calc(100%-2.25rem)]">
              {guests.map((g, i) => (
                <img
                  key={g.src}
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className={`h-full min-h-40 w-full rounded-2xl object-cover ${i === 0 ? 'col-span-2' : ''}`}
                />
              ))}
            </div>
            <figcaption className="mt-3 text-[0.95rem] text-cocoa">Khách check-in tại Miên Spa, 21 Điện Biên Phủ.</figcaption>
          </figure>
        }
        messages={reviews.map((r) => ({
          name: r.name,
          text: r.text,
          meta: '5 sao trên Google',
          note: 'note' in r ? r.note : undefined,
          lang: 'lang' in r ? r.lang : undefined,
        }))}
      />
    </div>
  )
}
