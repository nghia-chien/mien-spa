import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { about, contact, primaryCta } from '../data/site'
import { Cta } from './ui/Cta'
import { LayersCurtain } from './LayersCurtain'

gsap.registerPlugin(ScrollTrigger)

/** Về Miên — intro text (docx), four strengths (sale.md), quick facts and real photos. Entrance stagger #1 of 2. */
export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.ab-in', {
          y: 24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          delay: 0.6, // let the Thân · Tâm · Trí curtain clear first
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <LayersCurtain>
    <section ref={root} id="ve-mien" aria-labelledby="ve-mien-title" className="section-y">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <h2 id="ve-mien-title" className="h2 ab-in">{about.title}</h2>
          <p className="lead ab-in mt-4">{about.lead}</p>
          <p className="ab-in mt-3 text-ink">{about.body}</p>

          {/* grid table: cells share 1px lines (gap-px over a line-coloured ground) */}
          <ul className="ab-in mt-8 grid gap-px overflow-clip rounded-2xl bg-cocoa/20 ring-1 ring-cocoa/20 sm:grid-cols-2">
            {about.points.map((pt) => (
              <li key={pt.title} className="bg-paper p-4">
                <h3 className="font-semibold text-ink">{pt.title}</h3>
                <p className="mt-1 text-[0.96rem] text-ink/85">{pt.text}</p>
              </li>
            ))}
          </ul>

          <dl className="ab-in mt-8 grid gap-4 rounded-2xl bg-cream p-5 sm:grid-cols-3">
            <div><dt className="text-[0.875rem] text-cocoa">Giờ mở cửa</dt><dd className="mt-1 font-semibold text-ink">09:00 – 21:00, mỗi ngày</dd></div>
            <div><dt className="text-[0.875rem] text-cocoa">Địa chỉ</dt><dd className="mt-1 font-semibold text-ink">21 Điện Biên Phủ, Tuy Hòa</dd></div>
            <div><dt className="text-[0.875rem] text-cocoa">Hotline / Zalo</dt><dd className="mt-1 font-semibold text-ink"><a href={contact.phoneHref} className="hover:text-clay-deep">{contact.phoneDisplay}</a></dd></div>
          </dl>

          <div className="ab-in mt-8 flex flex-wrap items-center gap-5">
            <Cta target={primaryCta.target}>Đặt lịch tại Miên</Cta>
            <a href={contact.mapsHref} target="_blank" rel="noreferrer" className="font-medium text-clay-deep underline underline-offset-4 hover:text-ink">Xem đường đi</a>
          </div>
        </div>

        <div className="grid h-full min-h-[26rem] grid-cols-2 grid-rows-2 gap-3">
          <img src={about.images[0].src} alt={about.images[0].alt} loading="lazy" className="ab-in row-span-2 h-full w-full rounded-2xl object-cover" />
          <img src={about.images[1].src} alt={about.images[1].alt} loading="lazy" className="ab-in h-full w-full rounded-2xl object-cover" />
          <img src={about.images[2].src} alt={about.images[2].alt} loading="lazy" className="ab-in h-full w-full rounded-2xl object-cover" />
        </div>
      </div>
    </section>
    </LayersCurtain>
  )
}
