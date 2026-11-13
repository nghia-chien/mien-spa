import { priceGroups, primaryCta, contact } from '../data/site'
import { Cta } from './ui/Cta'

/** Full price board (bảng giá mới). Calm reading zone: heading row, then three compact table columns. */
export function PriceList() {
  return (
    <section id="bang-gia" aria-labelledby="bang-gia-title" className="section-y">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h2 id="bang-gia-title" className="h2">Bảng giá dịch vụ</h2>
            <p className="lead mt-3">Giá theo bảng giá hiện hành của Miên Spa, thời lượng tính bằng phút. Mở cửa {contact.hours}.</p>
          </div>
          <Cta target={primaryCta.target} className="shrink-0">Chọn dịch vụ và đặt lịch</Cta>
        </div>

        <div className="mt-9 columns-1 gap-8 md:columns-2 xl:columns-3">
          {priceGroups.map((g) => (
            <table key={g.title} className="mb-8 w-full break-inside-avoid border-collapse text-left">
              <caption className="mb-2 text-left text-[1.25rem] font-semibold text-clay-deep">{g.title}</caption>
              <thead className="sr-only">
                <tr><th scope="col">Dịch vụ</th><th scope="col">Thời lượng</th><th scope="col">Giá</th></tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr key={r.name} className="align-baseline odd:bg-cream">
                    <th scope="row" className="py-2 pl-3 pr-2 text-[0.98rem] font-normal text-ink">
                      {r.name}
                      {r.note && <span className="mt-0.5 block text-[0.85rem] leading-snug text-cocoa">{r.note}</span>}
                    </th>
                    <td className="whitespace-nowrap py-2 pr-2 text-[0.9rem] text-cocoa">{r.time ?? ''}</td>
                    <td className="whitespace-nowrap py-2 pr-3 text-right font-semibold tabular-nums text-ink">{r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </section>
  )
}
