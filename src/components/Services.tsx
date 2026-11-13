import type { CSSProperties } from 'react'
import { Sig405BentoGrid } from './signature/SIG-405/SIG-405'
import { services, servicesCopy, primaryCta } from '../data/site'
import { goTo } from '../lib/smooth'

/**
 * Dịch vụ — SIG-405 bento (entrance stagger #2 of 2). Every tile shows name and starting price at rest;
 * the open tile shows the client's own description and the full price lines.
 */
export function Services() {
  const style = { '--sig-accent': 'var(--color-clay-deep)' } as CSSProperties
  return (
    <div style={style}>
      <Sig405BentoGrid
        id="dich-vu"
        intensity={2}
        title={servicesCopy.title}
        intro={servicesCopy.intro}
        items={services.map((s) => ({
          id: s.id,
          title: s.name,
          meta: s.from,
          tag: s.layer,
          image: s.image,
          details: (
            <>
              <p className="text-[0.85rem] text-clay-deep">{s.layer}</p>
              <h3 className="font-display text-[clamp(1.6rem,2.2vw,2.1rem)] font-semibold leading-tight">{s.name}</h3>
              <table className="mt-3 w-full border-collapse overflow-clip rounded-xl text-left text-[0.95rem]">
                <thead>
                  <tr className="bg-cream text-[0.85rem] text-cocoa">
                    <th scope="col" className="px-3 py-2 font-semibold">Gói · thời gian</th>
                    <th scope="col" className="px-3 py-2 text-right font-semibold">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {s.prices.map((p) => (
                    <tr key={p.name} className="border-t border-cocoa/15 align-top">
                      <th scope="row" className="px-3 py-2 font-medium text-ink">
                        {p.name}
                        <span className="block text-[0.85rem] font-normal text-cocoa">
                          {[p.time, p.note].filter(Boolean).join(' · ')}
                        </span>
                      </th>
                      <td className="whitespace-nowrap px-3 py-2 text-right font-semibold text-clay-deep">{p.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a
                href={`#${primaryCta.target}`}
                onClick={(e) => {
                  e.preventDefault()
                  goTo(primaryCta.target)
                }}
                className="mt-4 inline-flex min-h-11 items-center gap-2 self-start whitespace-nowrap rounded-full bg-clay-deep px-5 text-[0.95rem] font-semibold text-night hover:bg-ink"
              >
                Đặt lịch dịch vụ này <span aria-hidden="true">→</span>
              </a>
            </>
          ),
        }))}
      />
    </div>
  )
}
